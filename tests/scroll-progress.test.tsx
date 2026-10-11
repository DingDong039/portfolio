// @vitest-environment jsdom
import { Profiler } from "react";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ScrollProgress from "@/components/ScrollProgress";

let nextFrame = 0;
const frames = new Map<number, FrameRequestCallback>();
const mediaListeners = new Set<(event: MediaQueryListEvent) => void>();
let reduced = false;
function flushAnimationFrames() { const queued = [...frames.values()]; frames.clear(); queued.forEach(f => f(16)); }
function changeReducedMotion(value: boolean) { reduced = value; mediaListeners.forEach(f => f({ matches: value } as MediaQueryListEvent)); }
beforeEach(() => {
  frames.clear(); mediaListeners.clear(); nextFrame = 0; reduced = false;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++nextFrame, callback); return nextFrame; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({
    get matches() { return reduced; },
    addEventListener: (_name: string, f: (event: MediaQueryListEvent) => void) => mediaListeners.add(f),
    removeEventListener: (_name: string, f: (event: MediaQueryListEvent) => void) => mediaListeners.delete(f),
  }));
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 2000 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});
afterEach(() => { Object.defineProperty(window, "scrollY", { configurable: true, value: 0 }); });

it("does not render React again for scroll updates", () => {
  let renders = 0; render(<Profiler id="progress" onRender={() => renders++}><ScrollProgress /></Profiler>);
  const mounted = renders;
  Object.defineProperty(window, "scrollY", { configurable: true, value: 600 });
  act(() => { window.dispatchEvent(new Event("scroll")); flushAnimationFrames(); });
  expect(renders).toBe(mounted);
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")?.getAttribute("style")).toContain("scaleX(0.5)");
});

it("hides the rail when reduced motion changes after mount", () => {
  render(<ScrollProgress />);
  act(() => changeReducedMotion(true));
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")!.parentElement!.hidden).toBe(true);
  expect(frames.size).toBe(0);
});

it("clamps progress at the document ends", () => {
  render(<ScrollProgress />);
  Object.defineProperty(window, "scrollY", { configurable: true, value: 5000 });
  act(() => { window.dispatchEvent(new Event("scroll")); flushAnimationFrames(); });
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")?.style.transform).toBe("scaleX(1)");
  Object.defineProperty(window, "scrollY", { configurable: true, value: -300 });
  act(() => { window.dispatchEvent(new Event("scroll")); flushAnimationFrames(); });
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")?.style.transform).toBe("scaleX(0)");
});

it("produces a safe zero at equal scroll and viewport heights", () => {
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 800 });
  render(<ScrollProgress />);
  Object.defineProperty(window, "scrollY", { configurable: true, value: 10 });
  act(() => { window.dispatchEvent(new Event("scroll")); flushAnimationFrames(); });
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")?.style.transform).toBe("scaleX(0)");
});

it("updates on resize", () => {
  render(<ScrollProgress />);
  Object.defineProperty(window, "scrollY", { configurable: true, value: 1200 });
  act(() => { window.dispatchEvent(new Event("resize")); flushAnimationFrames(); });
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")?.style.transform).toBe("scaleX(1)");
});

it("stays hidden with no listeners when mounted under reduced motion", () => {
  reduced = true;
  render(<ScrollProgress />);
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")!.parentElement!.hidden).toBe(true);
  Object.defineProperty(window, "scrollY", { configurable: true, value: 1000 });
  act(() => { window.dispatchEvent(new Event("scroll")); flushAnimationFrames(); });
  expect(frames.size).toBe(0);
  expect(document.querySelector<HTMLElement>("[data-scroll-progress]")?.style.transform).not.toContain("NaN");
});

it("detaches everything on unmount", () => {
  const view = render(<ScrollProgress />);
  view.unmount();
  act(() => { window.dispatchEvent(new Event("scroll")); window.dispatchEvent(new Event("resize")); flushAnimationFrames(); });
  expect(frames.size).toBe(0);
});
