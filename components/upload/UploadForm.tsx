"use client";

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

// Import your new extracted schema and type
import { bookUploadSchema, type BookUploadValues } from "@/lib/zod";

import { LoadingOverlay } from "./LoadingOverlay";
import { FileUploadDropzone } from "./FileUploadDropzone";
import { VoiceSelector } from "./VoiceSelector";

export default function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the imported type and schema here
  const form = useForm<BookUploadValues>({
    resolver: zodResolver(bookUploadSchema),
    defaultValues: { title: "", author: "", voiceId: "rachel" },
  });

  const { pdf, coverImage, voiceId } = form.watch();
  const errors = form.formState.errors;

  const onSubmit = async (data: BookUploadValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate API
    console.log("Form Data Submitted:", data);
    setIsSubmitting(false);
  };

  return (
    <div className="new-book-wrapper relative p-8 max-w-3xl mx-auto bg-[#FDFCF8] rounded-2xl shadow-sm border border-stone-100">
      {isSubmitting && <LoadingOverlay />}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-8">
          
          <FileUploadDropzone
            label="Book PDF File"
            accept=".pdf"
            icon={<Upload className="w-8 h-8 text-[#663820]" />}
            title="Click to upload PDF"
            description="PDF file (max 50MB)"
            file={pdf}
            onChange={(file) => form.setValue("pdf", file, { shouldValidate: true })}
            error={errors.pdf?.message as string}
          />

          <FileUploadDropzone
            label="Cover Image"
            isOptional={true}
            accept="image/*"
            icon={<ImageIcon className="w-8 h-8 text-[#663820]" />}
            title="Click to upload cover image"
            description="Leave empty to auto-generate from PDF"
            file={coverImage}
            onChange={(file) => form.setValue("coverImage", file, { shouldValidate: true })}
          />

          <Field>
            <FieldLabel htmlFor="title" className="font-bold text-zinc-900 text-base">Title</FieldLabel>
            <Input
              id="title"
              {...form.register("title")}
              className="mt-2 bg-white border-stone-200 py-6 text-base focus-visible:ring-[#663820]"
              placeholder="ex: Rich Dad Poor Dad"
            />
            {errors.title && <p className="text-sm text-red-500 font-medium mt-1">{errors.title.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="author" className="font-bold text-zinc-900 text-base">Author Name</FieldLabel>
            <Input
              id="author"
              {...form.register("author")}
              className="mt-2 bg-white border-stone-200 py-6 text-base focus-visible:ring-[#663820]"
              placeholder="ex: Robert Kiyosaki"
            />
            {errors.author && <p className="text-sm text-red-500 font-medium mt-1">{errors.author.message}</p>}
          </Field>

          <VoiceSelector
            currentVoiceId={voiceId}
            onSelect={(id) => form.setValue("voiceId", id, { shouldValidate: true })}
            error={errors.voiceId?.message}
          />

          <Field>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#663820] hover:bg-[#522c19] text-white font-serif font-bold text-lg py-7 rounded-xl shadow-md transition-colors mt-4"
            >
              Begin Synthesis
            </Button>
          </Field>

        </FieldGroup>
      </form>
    </div>
  );
}