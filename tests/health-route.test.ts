import { expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";

it("reports only liveness with no provider calls", async () => {
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("network forbidden"); }));
  const response = await GET(); expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(fetch).not.toHaveBeenCalled();
});
