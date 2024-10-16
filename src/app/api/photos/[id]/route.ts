import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    await prisma.comment.deleteMany({
      where: { photoId: id },
    });
    const deletedPhoto = await prisma.photo.delete({
      where: { id },
    });
    return NextResponse.json(deletedPhoto);
  } catch {
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
