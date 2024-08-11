// pages/api/banner/[id].js

import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function  DELETE (req: NextRequest) {
    try {
      const id = req.json();
      await prisma.bannerSettings.delete({
        where: {
          id: Number(id),
        },
      });
      return NextResponse.json({ message: 'done' });
    } catch (error) {
      console.error('Error deleting banner:', error);
      return NextResponse.json({ error: 'Internal Server Error' });
    }
};

