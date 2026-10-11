# Container verification — 2026-10-11

Image `portfolio-remediation:local`, built from the D2 sources
(`node:24-alpine`, Alpine v3.24, musl 1.2.6), Docker 29.8.2 on Windows 11.

## Liveness

- `HEALTHCHECK` uses the image's own Node runtime (`fetch` with a 2.5s
  `AbortSignal.timeout`) against `http://127.0.0.1:3000/api/health` — no curl
  package added.
- Started container reached `healthy` within the bounded wait window
  (~15s start period), `GET /api/health` answered `200 {"status":"ok"}` with
  `Cache-Control: no-store`.
- A second container from the same image running a non-listening Node loop
  (`node -e "setInterval(()=>{},1000)"`) transitioned
  `starting → starting → … → unhealthy` (~35s, 3 failed retries), proving the
  probe actually fails on connection errors. The ordinary server container
  remained `healthy` throughout.

## Runtime posture

- Non-root execution confirmed: `docker exec … id` → `uid=1001(nextjs)`.
- Static page served (`200`, hero present), `/_next/image?url=%2Fprojects%2Finvestra-ui.png&w=640&q=75`
  returned `200 image/png` (~36 KB) — the image-optimization path works.
- With no correspondence settings present, `POST /api/contact` with valid
  fields and a dummy token answered `503 {"ok":false,"code":"CONTACT_UNAVAILABLE"}`
  and no outgoing email was attempted.
- Container logs: clean startup only (5 lines, no native-library load failures).

## libc disposition

The audit suggested installing libc compatibility in the base stage. The
runner stage has no compat package, yet startup, static serving, and image
optimization all succeed — **the blanket base-stage recommendation was not
needed for this stack**. `libc6-compat` remains in the `deps` stage only,
where `npm ci` runs; it has no runtime footprint and is retained to keep
native build-time binaries safe. Removing it would require a separate
rebuild proving install/build success, which is not warranted by any
observed failure.

## External boundary

This verifies the local image only. Production Turnstile keys, Compose
secrets, and the published registry/deployment flow are operator actions
outside this check.
