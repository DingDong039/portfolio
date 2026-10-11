import { expect, it, vi } from "vitest";
import { readContactBody } from "@/lib/read-contact-body";

// ASCII-only fixture so string length equals byte length.
const baseJson = (pad: number) => JSON.stringify({ name: "Tester", email: "tester@example.com", subject: "Hello", message: "a".repeat(pad), website: "", turnstileToken: "token" });
const OVERHEAD = baseJson(0).length;
function jsonOfExactBytes(target: number): string {
  if (target < OVERHEAD) throw new Error("target smaller than fixture overhead");
  return baseJson(target - OVERHEAD);
}
function streamOf(chunks: Uint8Array[]) {
  const cancel = vi.fn();
  let index = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) { if (index < chunks.length) controller.enqueue(chunks[index++]); else controller.close(); },
    cancel,
  });
  return { stream, cancel };
}
function requestWith(stream: ReadableStream<Uint8Array>, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST", headers: { "content-type": "application/json", ...headers }, body: stream,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
}
const bytesOf = (text: string) => new TextEncoder().encode(text);

it("cancels chunked input above the limit without a length header", async () => {
  const cancel = vi.fn();
  const body = new ReadableStream<Uint8Array>({ pull(c) { c.enqueue(new Uint8Array(32768)); }, cancel });
  const request = new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body, duplex: "half" } as RequestInit & { duplex: "half" });
  await expect(readContactBody(request)).rejects.toMatchObject({ status: 413 });
  expect(cancel).toHaveBeenCalledTimes(1);
});

it("permits exactly 65,536 bytes to reach JSON parsing", async () => {
  const payload = jsonOfExactBytes(65536);
  expect(payload.length).toBe(65536);
  const { stream, cancel } = streamOf([bytesOf(payload.slice(0, 32768)), bytesOf(payload.slice(32768))]);
  const value = await readContactBody(requestWith(stream));
  expect(value).toMatchObject({ name: "Tester", turnstileToken: "token" });
  expect((value as { message: string }).message).toBe("a".repeat(65536 - OVERHEAD));
  expect(cancel).not.toHaveBeenCalled();
  await expect(stream.cancel()).resolves.toBeUndefined(); // reader lock was released
});

it("rejects 65,537 bytes as too large", async () => {
  const { stream, cancel } = streamOf([new Uint8Array(32768), new Uint8Array(32768), new Uint8Array(1)]);
  await expect(readContactBody(requestWith(stream))).rejects.toMatchObject({ status: 413, code: "REQUEST_TOO_LARGE" });
  expect(cancel).toHaveBeenCalledTimes(1);
});

it("a lying small Content-Length does not bypass the stream check", async () => {
  const { stream, cancel } = streamOf([new Uint8Array(40000), new Uint8Array(40000)]);
  await expect(readContactBody(requestWith(stream, { "content-length": "100" }))).rejects.toMatchObject({ status: 413 });
  expect(cancel).toHaveBeenCalledTimes(1);
});

it("an oversized Content-Length header is rejected before reading", async () => {
  const { stream, cancel } = streamOf([new Uint8Array(10)]);
  await expect(readContactBody(requestWith(stream, { "content-length": "65537" }))).rejects.toMatchObject({ status: 413 });
  expect(cancel).not.toHaveBeenCalled();
});

it("malformed UTF-8 is an invalid request", async () => {
  const { stream } = streamOf([new Uint8Array([0x7b, 0x22, 0x61, 0x22, 0x3a, 0xff, 0x7d])]);
  await expect(readContactBody(requestWith(stream))).rejects.toMatchObject({ status: 400, code: "INVALID_REQUEST" });
});

it("rejects a request without a body", async () => {
  const request = new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" } });
  await expect(readContactBody(request)).rejects.toMatchObject({ status: 400 });
});
