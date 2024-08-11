import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { description, timer, link } = await request.json();
    const updatedBanner = await prisma.bannerSettings.create({
      data: {
        description,
        timer: parseInt(timer),
        link,
      },
    });
    return NextResponse.json({ data: updatedBanner });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}