// lib/zod.ts
import * as z from "zod";

const MAX_FILE_SIZE = 50000000; // 50MB

export const bookUploadSchema = z.object({
  pdf: z
    .any()
    .refine((file) => file instanceof File, "A PDF file is required.")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 50MB."),
  coverImage: z.any().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  voiceId: z.string().min(1, "Please select an assistant voice"),
});

// Export the type so we can use it across our app
export type BookUploadValues = z.infer<typeof bookUploadSchema>;
