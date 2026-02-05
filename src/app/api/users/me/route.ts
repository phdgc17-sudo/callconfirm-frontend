import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { parseRequest } from "@/lib/request";
import { profileSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function PUT(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await parseRequest(request, profileSchema);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name,
      email: body.email
    }
  });
  return NextResponse.json({ user: updated });
}
