import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { description } = await request.json();
    const updatedBanner = await prisma.bannerSettings.update({
      where: { id: parseInt(id) },
      data: { description },
    });
    return NextResponse.json({ data: updatedBanner });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
