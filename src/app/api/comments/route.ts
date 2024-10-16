import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { content, photoId } = await request.json();
  const comment = await prisma.comment.create({
    data: { content, photoId },
    include: { photo: true }, // Include the photo to ensure we have the correct photoId
  });
  return NextResponse.json(comment);
}
