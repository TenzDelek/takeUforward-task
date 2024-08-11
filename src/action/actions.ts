"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createpostla(formData: FormData) {
  const description = formData.get("title") as string;
  const timer = parseInt(formData.get("timer") as string, 10) || 0; // Convert to number and default to 0 if null
  const link = formData.get("link") as string; 
  //adding to db or updating for db
  await prisma.bannerSettings.create({
    data: {
        description,
        timer,
      link,
    },
  });

  //revalidate
  revalidatePath("/");
}
