import type { ContactCode } from "./contact-contract";
export class BodyError extends Error {
  constructor(public status: number, public code: ContactCode) { super(code); }
}
export async function readContactBody(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json")
    throw new BodyError(415, "UNSUPPORTED_MEDIA_TYPE");
  if (Number(request.headers.get("content-length")) > 65536) throw new BodyError(413, "REQUEST_TOO_LARGE");
  const reader = request.body?.getReader();
  if (!reader) throw new BodyError(400, "INVALID_REQUEST");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    for (;;) {
      // oxlint-disable-next-line eslint(no-await-in-loop) -- sequential reads are the size cap: reading ahead in parallel could bypass the 64 KiB limit
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 65536) { await reader.cancel(); throw new BodyError(413, "REQUEST_TOO_LARGE"); }
      chunks.push(chunk.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new BodyError(400, "INVALID_REQUEST"); }
}
