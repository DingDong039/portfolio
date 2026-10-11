import { NextResponse } from "next/server";

// Liveness only: no provider checks, no configuration data, no secrets.
export function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
