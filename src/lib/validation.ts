import { z } from "zod";
export  const inputSchema = z.object({
    description: z.string().min(1, "Description is required"),
    timer: z.string().min(1, "Timer is required").regex(/^\d+$/, "Timer must be a number"),
    link: z.string().url().refine((val) => val.startsWith("https"), {
      message: "Link must start with https",
    }),
  });