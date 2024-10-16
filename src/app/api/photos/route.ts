import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const photos = await prisma.photo.findMany({
    include: { comments: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  const imgbbApiKey = process.env.IMGBB_API_KEY;
  if (!imgbbApiKey) {
    return NextResponse.json({ error: "ImgBB API key not configured" }, { status: 500 });
  }

  try {
    const imgbbFormData = new FormData();
    const blob = new Blob([await image.arrayBuffer()], { type: image.type });
    imgbbFormData.append("image", blob, image.name);
    imgbbFormData.append("key", imgbbApiKey);

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    });

    if (!imgbbResponse.ok) {
      throw new Error("Failed to upload image to ImgBB");
    }

    const imgbbData = await imgbbResponse.json();
    const imageUrl = imgbbData.data.url;

    const photo = await prisma.photo.create({
      data: { url: imageUrl },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
