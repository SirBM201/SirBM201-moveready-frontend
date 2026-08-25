import { NextResponse } from "next/server";

const allowedMetrics = new Set(["CLS", "FCP", "INP", "LCP", "TTFB"]);

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name || "").toUpperCase();
    const value = Number(body.value);
    if (!allowedMetrics.has(name) || !Number.isFinite(value) || value < 0) {
      return NextResponse.json({ ok: false, error: "invalid_metric" }, { status: 400 });
    }
    const safeMetric = {
      name,
      value,
      rating: String(body.rating || "unknown").slice(0, 16),
      delta: Number.isFinite(Number(body.delta)) ? Number(body.delta) : 0,
      id: String(body.id || "").slice(0, 100),
      navigation_type: String(body.navigationType || "unknown").slice(0, 32),
    };
    console.info("moveready_web_vital", safeMetric);
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_metric" }, { status: 400 });
  }
}
