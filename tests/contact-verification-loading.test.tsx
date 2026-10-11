// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ContactVerification from "@/components/ContactVerification";

let intersect: IntersectionObserverCallback;
const scriptSelector = 'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]';
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");
  delete window.turnstile;
  document.querySelectorAll(scriptSelector).forEach(script => script.remove());
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersect = callback; }
    observe() {} disconnect() {} unobserve() {}
  });
});
afterEach(() => { delete window.turnstile; });

it("retries an actual failed script load and renders verification after recovery", async () => {
  const onToken = vi.fn();
  const view = render(<ContactVerification onToken={onToken} resetVersion={0} />);
  act(() => intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
  await waitFor(() => expect(document.querySelector(scriptSelector)).not.toBeNull());
  const failedScript = document.querySelector(scriptSelector)!;
  await act(async () => { fireEvent.error(failedScript); });
  fireEvent.click(await screen.findByRole("button", { name: /retry verification/i }));
  await waitFor(() => expect(document.querySelector(scriptSelector)).not.toBe(failedScript));
  const retryScript = document.querySelector(scriptSelector)!;
  expect(retryScript).not.toBeNull();
  expect(document.querySelectorAll(scriptSelector)).toHaveLength(1);

  const renderWidget = vi.fn().mockReturnValue("recovered-widget");
  const removeWidget = vi.fn();
  window.turnstile = { render: renderWidget, remove: removeWidget };
  fireEvent.load(retryScript);
  await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(1));
  act(() => renderWidget.mock.calls[0][1].callback("fresh-token"));
  expect(onToken).toHaveBeenLastCalledWith("fresh-token");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  view.unmount();
  expect(removeWidget).toHaveBeenCalledWith("recovered-widget");
  expect(document.querySelector(scriptSelector)).toBeNull();
});

it("can retry another load failure and detaches pending script callbacks on unmount", async () => {
  const onToken = vi.fn();
  const view = render(<ContactVerification onToken={onToken} resetVersion={0} />);
  act(() => intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
  const firstScript = document.querySelector(scriptSelector)!;
  fireEvent.error(firstScript);
  fireEvent.click(await screen.findByRole("button", { name: /retry verification/i }));
  const secondScript = document.querySelector(scriptSelector)!;
  expect(secondScript).not.toBe(firstScript);
  fireEvent.error(secondScript);
  fireEvent.click(await screen.findByRole("button", { name: /retry verification/i }));
  const pendingScript = document.querySelector(scriptSelector)!;
  expect(pendingScript).not.toBe(secondScript);
  expect(document.querySelectorAll(scriptSelector)).toHaveLength(1);
  view.unmount();
  onToken.mockClear();
  fireEvent.error(pendingScript);
  fireEvent.load(pendingScript);
  expect(onToken).not.toHaveBeenCalled();
  expect(document.querySelector(scriptSelector)).toBeNull();
});
