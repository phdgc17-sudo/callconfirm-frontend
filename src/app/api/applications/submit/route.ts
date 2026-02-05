import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationSubmitSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";

export async function POST(request: Request) {
  const body = await parseRequest(request, applicationSubmitSchema);
  let responses;
  try {
    responses = JSON.parse(body.responses);
  } catch {
    return NextResponse.json({ error: "Invalid responses JSON" }, { status: 400 });
  }
  const response = await prisma.applicationResponse.create({
    data: {
      applicationId: body.applicationId,
      applicantName: body.applicantName,
      status: "pending",
      responses
    }
  });
  return NextResponse.json({ response }, { status: 201 });
}
