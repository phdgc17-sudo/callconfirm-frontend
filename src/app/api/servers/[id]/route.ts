import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: { id: string } }) {
  const server = await prisma.server.findUnique({ where: { id: context.params.id } });
  if (!server) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    server: {
      ...server,
      staffList: server.staffList ?? [],
      rules: server.rules ?? []
    }
  });
}
