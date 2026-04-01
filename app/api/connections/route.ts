import { NextResponse } from "next/server";
import { MOCK_CONNECTIONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(MOCK_CONNECTIONS);
}
