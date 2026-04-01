import { NextResponse } from "next/server";
import { getPersonById } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const person = getPersonById(params.id);
  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }
  return NextResponse.json(person);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const person = getPersonById(params.id);
  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }
  const body = await request.json();
  return NextResponse.json({ ...person, ...body, updatedAt: new Date() });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const person = getPersonById(params.id);
  if (!person) {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
