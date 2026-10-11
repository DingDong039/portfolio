// @vitest-environment jsdom
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ContactVerification from "@/components/ContactVerification";

let intersect: IntersectionObserverCallback;
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersect = callback; }
    observe() {} disconnect() {} unobserve() {}
  });
});
afterEach(() => {
  delete (window as { turnstile?: unknown }).turnstile;
  document.documentElement.classList.remove("dark");
});
vi.mock("next/script", () => ({ default: () => null }));

function stubTurnstile() {
  const renderWidget = vi.fn().mockReturnValue("widget-1");
  const removeWidget = vi.fn();
  window.turnstile = { render: renderWidget, remove: removeWidget };
  return { renderWidget, removeWidget };
}
function activate() {
  act(() => intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
}

it("expires and resets widget tokens", async () => {
  const { renderWidget, removeWidget } = stubTurnstile();
  const onToken = vi.fn();
  const view = render(<ContactVerification onToken={onToken} resetVersion={0} />);
  activate();
  await waitFor(() => expect(renderWidget).toHaveBeenCalled());
  const options = renderWidget.mock.calls[0][1];
  act(() => options.callback("fresh-token")); expect(onToken).toHaveBeenLastCalledWith("fresh-token");
  act(() => options["expired-callback"]()); expect(onToken).toHaveBeenLastCalledWith("");
  view.rerender(<ContactVerification onToken={onToken} resetVersion={1} />);
  await waitFor(() => expect(removeWidget).toHaveBeenCalledWith("widget-1"));
});

it("renders nothing before the contact area approaches the viewport", () => {
  const { renderWidget } = stubTurnstile();
  render(<ContactVerification onToken={vi.fn()} resetVersion={0} />);
  expect(renderWidget).not.toHaveBeenCalled();
});

it("renders the widget with the contact action, flexible size, and reserved height", async () => {
  const { renderWidget } = stubTurnstile();
  const view = render(<ContactVerification onToken={vi.fn()} resetVersion={0} />);
  const slot = view.container.querySelector("[data-turnstile-container]");
  expect(slot).toHaveStyle({ minHeight: "65px" });
  activate();
  await waitFor(() => expect(renderWidget).toHaveBeenCalled());
  const options = renderWidget.mock.calls[0][1];
  expect(options.sitekey).toBe("1x00000000000000000000AA");
  expect(options.action).toBe("contact");
  expect(options.size).toBe("flexible");
  expect(options.theme).toBe("light");
});

it("stale callbacks from a removed widget cannot restore an old token", async () => {
  const { renderWidget } = stubTurnstile();
  const onToken = vi.fn();
  const view = render(<ContactVerification onToken={onToken} resetVersion={0} />);
  activate();
  await waitFor(() => expect(renderWidget).toHaveBeenCalled());
  const stale = renderWidget.mock.calls[0][1];
  view.rerender(<ContactVerification onToken={onToken} resetVersion={1} />);
  await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(2));
  act(() => stale.callback("stale-token"));
  expect(onToken).not.toHaveBeenCalledWith("stale-token");
  expect(onToken).toHaveBeenLastCalledWith("");
});

it("re-renders the widget with the explicit theme when the html class flips", async () => {
  const { renderWidget, removeWidget } = stubTurnstile();
  render(<ContactVerification onToken={vi.fn()} resetVersion={0} />);
  activate();
  await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(1));
  act(() => { document.documentElement.classList.add("dark"); });
  await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(2));
  expect(renderWidget.mock.calls[1][1].theme).toBe("dark");
  expect(removeWidget).toHaveBeenCalledWith("widget-1");
});

it("a widget error clears the token and offers an accessible retry and direct email", async () => {
  const { renderWidget } = stubTurnstile();
  const onToken = vi.fn();
  render(<ContactVerification onToken={onToken} resetVersion={0} />);
  activate();
  await waitFor(() => expect(renderWidget).toHaveBeenCalled());
  act(() => renderWidget.mock.calls[0][1]["error-callback"]());
  expect(onToken).toHaveBeenLastCalledWith("");
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.getByRole("button", { name: /retry/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /email me directly/i })).toHaveAttribute("href", "mailto:watchara.ddev@gmail.com");
});

it("a missing site key shows the direct-email alternative without loading the script", () => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  const { renderWidget } = stubTurnstile();
  render(<ContactVerification onToken={vi.fn()} resetVersion={0} />);
  activate();
  expect(renderWidget).not.toHaveBeenCalled();
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.getByRole("link", { name: /email me directly/i })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
});

it("removes the widget and clears the token on unmount", async () => {
  const { renderWidget, removeWidget } = stubTurnstile();
  const onToken = vi.fn();
  const view = render(<ContactVerification onToken={onToken} resetVersion={0} />);
  activate();
  await waitFor(() => expect(renderWidget).toHaveBeenCalled());
  view.unmount();
  expect(removeWidget).toHaveBeenCalledWith("widget-1");
  expect(onToken).toHaveBeenLastCalledWith("");
});
