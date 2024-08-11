
// import prisma from '@/lib/db';
// import { NextRequest, NextResponse } from 'next/server';

import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const bannerSettings = await prisma.bannerSettings.findFirst();
//     return NextResponse.json(bannerSettings);
//   } catch (error) {
//     console.error('Database error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function POST(request:NextRequest) {
//   try {
//     const { description, timer, link } = await request.json();
//     const updatedBanner = await prisma.bannerSettings.upsert({
//       where: { id: 1 },
//       update: { description, timer, link },
//       create: { id: 1, description, timer, link },
//     });
//     return NextResponse.json({ message: 'Banner settings updated successfully', data: updatedBanner });
//   } catch (error) {
//     console.error('Database error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
export async function POST(request: NextRequest) {
    try {
      const { description, timer, link } = await request.json();
      const updatedBanner =await prisma.bannerSettings.create({
        data: {
            description,
            timer:parseInt(timer),
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
