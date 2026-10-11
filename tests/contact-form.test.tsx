// @vitest-environment jsdom
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import Contact from "@/components/Contact";

// jsdom 29.1.1 does not implement dialog.showModal(); emulate the modal-open
// half so the dialog behaviors under test are observable.
beforeAll(() => {
  if (typeof HTMLDialogElement !== "undefined") {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.setAttribute("open", ""); };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.removeAttribute("open"); };
  }
});

vi.mock("@/components/Reveal", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock("next/image", () => ({ default: ({ alt, src }: { alt: string; src: string }) =>
  // oxlint-disable-next-line next/no-img-element -- test double for the next/image boundary; the jsdom run has no image optimizer to call
  <img alt={alt} src={src} /> }));
vi.mock("@/components/ContactVerification", () => ({ default: ({ onToken }: { onToken: (token: string) => void }) =>
  <button type="button" onClick={() => onToken("fresh-token")}>Supply test token</button> }));

const okSuccess = () => new Response(JSON.stringify({ ok: true }), { status: 200 });
const providerFailure = () => new Response(JSON.stringify({ ok: false, code: "EMAIL_PROVIDER_FAILED", error: "Could not submit your message. Please retry or email me directly." }), { status: 502 });

async function fill(user: ReturnType<typeof userEvent.setup>, overrides: Partial<Record<"name" | "email" | "subject" | "message", string>> = {}) {
  const values = { name: "Tester", email: "tester@example.com", subject: "Hello", message: "Keep my message", ...overrides };
  await user.type(screen.getByLabelText(/^Name/), values.name);
  await user.type(screen.getByLabelText(/^Email/), values.email);
  await user.type(screen.getByLabelText(/^Subject/), values.subject);
  await user.type(screen.getByLabelText(/^Message/), values.message);
}
async function supplyTokenAndSend(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Supply test token" }));
  await user.click(screen.getByRole("button", { name: /Send message/i }));
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okSuccess()));
});

it("preserves the user's draft on provider rejection", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerFailure()));
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
  expect(screen.getByLabelText(/^Message/)).toHaveValue("Keep my message");
  expect(screen.queryByText(/Message submitted/)).not.toBeInTheDocument();
});

it("an HTTP 200 response without the success shape is not a success", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false }), { status: 200 })));
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
  expect(screen.getByLabelText(/^Message/)).toHaveValue("Keep my message");
  expect(screen.queryByText(/Message submitted/)).not.toBeInTheDocument();
});

it("focuses the first invalid field and never fetches", async () => {
  const user = userEvent.setup(); render(<Contact />);
  await user.click(screen.getByRole("button", { name: /Send message/i }));
  expect(document.activeElement).toBe(screen.getByLabelText(/^Name/));
  expect(screen.getByLabelText(/^Name/)).toHaveAttribute("aria-invalid", "true");
  expect(fetch).not.toHaveBeenCalled();
});

it("the name input cap stops an over-limit draft at 100 UTF-16 units", async () => {
  const user = userEvent.setup(); render(<Contact />);
  const name = screen.getByLabelText(/^Name/);
  await user.type(name, "😀".repeat(51));
  // Browser-level maxLength truncates at the contract limit, so an over-limit
  // draft cannot even be typed; the JS boundary itself is unit-tested in the
  // contract suite.
  expect(name).toHaveValue("😀".repeat(50));
});

it("rejects an invalid mailbox with a field error and no request", async () => {
  const user = userEvent.setup(); render(<Contact />);
  await fill(user, { email: "a@b" });
  await supplyTokenAndSend(user);
  expect(document.activeElement).toBe(screen.getByLabelText(/^Email/));
  expect(fetch).not.toHaveBeenCalled();
});

it("requires a verification token before submitting", async () => {
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await user.click(screen.getByRole("button", { name: /Send message/i }));
  expect(screen.getByRole("alert")).toHaveTextContent(/Complete verification/i);
  expect(fetch).not.toHaveBeenCalled();
});

it("disables editing while the send is pending and restores after", async () => {
  let resolveFetch!: (value: Response) => void;
  vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(resolve => { resolveFetch = resolve; })));
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  const message = screen.getByLabelText(/^Message/);
  expect(message).toBeDisabled();
  expect(screen.getByRole("button", { name: /Sending/ })).toBeDisabled();
  await act(async () => { resolveFetch(okSuccess()); });
  await waitFor(() => expect(screen.getByLabelText(/^Message/)).toBeEnabled());
  expect(screen.getByLabelText(/^Message/)).toHaveValue("");
});

it("two synchronous submit events cause a single request", async () => {
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await user.click(screen.getByRole("button", { name: "Supply test token" }));
  const form = screen.getByRole("button", { name: /Send message/i }).closest("form")!;
  act(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

it("a non-JSON response keeps the draft with the confirmation-failure copy", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("gateway html", { status: 502, headers: { "Content-Type": "text/html" } })));
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/could not be confirmed/i));
  expect(screen.getByLabelText(/^Message/)).toHaveValue("Keep my message");
});

it("a request timeout keeps the draft and offers retry or direct email", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("aborted", "AbortError")));
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/could not be confirmed/i));
  expect(screen.getByLabelText(/^Message/)).toHaveValue("Keep my message");
});

it("surfaces server field errors with the same focus order", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, code: "INVALID_REQUEST", error: "Check your contact details.", fieldErrors: { email: "Enter one valid email address." } }), { status: 400 })));
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByLabelText(/^Email/)).toHaveAttribute("aria-invalid", "true"));
  expect(document.activeElement).toBe(screen.getByLabelText(/^Email/));
  expect(screen.getByLabelText(/^Email/)).toHaveAttribute("aria-describedby", expect.stringMatching(/-error$/));
});

it("retries with a fresh token without losing the text, then succeeds", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(providerFailure()).mockResolvedValueOnce(okSuccess()));
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
  expect(screen.getByLabelText(/^Message/)).toHaveValue("Keep my message");
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByText(/Message submitted\./)).toBeVisible());
  expect(screen.getByLabelText(/^Message/)).toHaveValue("");
  expect(fetch).toHaveBeenCalledTimes(2);
});

it("clears the form only after provider acceptance", async () => {
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/Message submitted\./));
  for (const label of [/^Name/, /^Email/, /^Subject/, /^Message/]) {
    expect(screen.getByLabelText(label)).toHaveValue("");
  }
});

it("a stale success timer cannot erase a later failure outcome", async () => {
  const setSpy = vi.spyOn(globalThis, "setTimeout");
  const clearSpy = vi.spyOn(globalThis, "clearTimeout");
  const user = userEvent.setup(); render(<Contact />);
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByText(/Message submitted\./)).toBeVisible());
  // The success banner armed a 6s clear timer; a new attempt must cancel it
  // before it could erase the newer outcome.
  const successCall = setSpy.mock.calls.findIndex(([, ms]) => ms === 6000);
  expect(successCall).toBeGreaterThanOrEqual(0);
  const successTimerId = setSpy.mock.results[successCall].value;
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerFailure()));
  await fill(user);
  await supplyTokenAndSend(user);
  await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
  expect(clearSpy).toHaveBeenCalledWith(successTimerId);
  // Errors stay visible until the next attempt — no auto-clear runs.
  expect(screen.queryByText(/Message submitted\./)).not.toBeInTheDocument();
});

it("caps inputs at the shared limits and states the message limit", () => {
  render(<Contact />);
  expect(screen.getByLabelText(/^Name/)).toHaveAttribute("maxlength", "100");
  expect(screen.getByLabelText(/^Email/)).toHaveAttribute("maxlength", "254");
  expect(screen.getByLabelText(/^Subject/)).toHaveAttribute("maxlength", "200");
  const message = screen.getByLabelText(/^Message/);
  expect(message).toHaveAttribute("maxlength", "5000");
  expect(message).toHaveAttribute("aria-describedby", expect.stringMatching(/-help$/));
  expect(screen.getByText(/5,000 characters/)).toBeVisible();
});

it("keeps the honeypot out of navigation and the accessibility tree", () => {
  const view = render(<Contact />);
  const honeypot = view.container.querySelector('input[name="website"]') as HTMLInputElement;
  expect(honeypot).not.toBeNull();
  expect(honeypot.tabIndex).toBe(-1);
  expect(honeypot.autocomplete).toBe("off");
  expect(honeypot.closest("[aria-hidden=true]")).not.toBeNull();
});

it("preserves channel links, external safety, and the QR dialog behavior", async () => {
  const user = userEvent.setup(); render(<Contact />);
  const github = screen.getByRole("link", { name: /github/i });
  expect(github).toHaveAttribute("href", "https://github.com/DingDong039");
  expect(github).toHaveAttribute("target", "_blank");
  expect(github).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.getByRole("link", { name: /^Email/ })).toHaveAttribute("href", "mailto:watchara.ddev@gmail.com");
  await user.click(screen.getByRole("button", { name: /Line QR/i }));
  const dialog = screen.getByRole("dialog", { name: "Line QR code" }) as HTMLDialogElement;
  expect(dialog.open).toBe(true);
  expect(screen.getByAltText("Line QR code — scan to add Watchara")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Close" }));
  expect(dialog.open).toBe(false);
});
