"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import { bookUploadSchema, type BookUploadValues } from "@/lib/zod";

import { LoadingOverlay } from "./LoadingOverlay";
import { FileUploadDropzone } from "./FileUploadDropzone";
import { VoiceSelector } from "./VoiceSelector";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  checkBookExists,
  createBook,
  saveBookSegments,
} from "@/lib/actions/book.action";
import { useRouter } from "next/navigation";
import { parsePDFFile } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

export default function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  const form = useForm<BookUploadValues>({
    resolver: zodResolver(bookUploadSchema),
    defaultValues: {
      title: "",
      author: "",
      voiceId: "rachel",
      pdf: undefined,
      coverImage: undefined,
    },
  });

  const { pdf, coverImage, voiceId } = form.watch();
  const errors = form.formState.errors;

  const onSubmit = async (data: BookUploadValues) => {
    if (!userId) {
      toast.error("You must be logged in to upload a book.");
      return;
    }

    setIsSubmitting(true);

    try {
      const existsCheck = await checkBookExists(data.title);
      if (existsCheck.exists) {
        toast.info(
          "A book with this title already exists. Redirecting to book page...",
        );
        form.reset();
        router.push(`/books/${existsCheck.data.slug}`);
        return;
      }

      const fileTitle = data.title.replace(/\s+/g, "_").toLowerCase();
      
      // FIX: Check for the file properly and handle both Array and single File formats
      if (!data.pdf) {
        toast.error("Please upload a PDF file.");
        return;
      }
      
      // Safely extract the file
      const pdfFile = Array.isArray(data.pdf) ? data.pdf[0] : (data.pdf as File);

      const parsedFile = await parsePDFFile(pdfFile);
      if (parsedFile.content.length === 0) {
        toast.error("Failed to parse PDF file. Please try again.");
        return;
      }

      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
      });

      let coverUrl: string;
      
      // FIX: Apply the same safe extraction logic to the cover image
      if (data.coverImage) {
        const coverFile = Array.isArray(data.coverImage) ? data.coverImage[0] : (data.coverImage as File);
        const uploadedCoverBlob = await upload(
          fileTitle + "_cover",
          coverFile,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: coverFile.type,
          },
        );
        coverUrl = uploadedCoverBlob.url;
      } else {
        const response = await fetch(parsedFile.cover);
        const blob = await response.blob();
        const uploadedCoverBlob = await upload(fileTitle + "_cover", blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: blob.type,
        });
        coverUrl = uploadedCoverBlob.url;
      }

      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.voiceId,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      });
      
      if (!book.success) {
        toast.error("Failed to create book record. Please try again.");
        return;
      }
      
      if (book.alreadyExists) {
        toast.info(
          "A book with this title already exists. Redirecting to book page...",
        );
        form.reset();
        router.push(`/books/${book.data.slug}`);
        return;
      }

      const segments = await saveBookSegments(
        book.data._id,
        userId,
        parsedFile.content,
      );
      
      if (!segments.success) {
        toast.error("Failed to save book segments. Please try again.");
        throw new Error("Failed to save book segments");
      }

      form.reset();
      toast.success("Book uploaded successfully! Redirecting to book page...");
      router.push("/");
    } catch (error) {
      console.error("Error uploading book:", error);
      toast.error("Failed to upload book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-book-wrapper relative p-8 max-w-3xl mx-auto bg-[#FDFCF8] rounded-2xl shadow-sm border border-stone-100">
      {isSubmitting && <LoadingOverlay />}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-8">
          {/* PDF Upload */}
          <FileUploadDropzone
            label="Book PDF File"
            accept=".pdf"
            icon={<Upload className="w-8 h-8 text-[#663820]" />}
            title="Click to upload PDF"
            description="PDF file (max 50MB)"
            file={pdf}
            onChange={(file) =>
              form.setValue("pdf", file, { shouldValidate: true })
            }
            error={errors.pdf?.message as string}
          />

          {/* Cover Image Upload */}
          <FileUploadDropzone
            label="Cover Image"
            isOptional={true}
            accept="image/*"
            icon={<ImageIcon className="w-8 h-8 text-[#663820]" />}
            title="Click to upload cover image"
            description="Leave empty to auto-generate from PDF"
            file={coverImage}
            onChange={(file) =>
              form.setValue("coverImage", file, { shouldValidate: true })
            }
          />

          {/* Title */}
          <Field>
            <FieldLabel
              htmlFor="title"
              className="font-bold text-zinc-900 text-base"
            >
              Title
            </FieldLabel>

            <Input
              id="title"
              {...form.register("title")}
              className="mt-2 bg-white border-stone-200 py-6 text-base focus-visible:ring-[#663820]"
              placeholder="ex: Rich Dad Poor Dad"
            />

            {errors.title && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.title.message}
              </p>
            )}
          </Field>

          {/* Author */}
          <Field>
            <FieldLabel
              htmlFor="author"
              className="font-bold text-zinc-900 text-base"
            >
              Author Name
            </FieldLabel>

            <Input
              id="author"
              {...form.register("author")}
              className="mt-2 bg-white border-stone-200 py-6 text-base focus-visible:ring-[#663820]"
              placeholder="ex: Robert Kiyosaki"
            />

            {errors.author && (
              <p className="text-sm text-red-500 font-medium mt-1">
                {errors.author.message}
              </p>
            )}
          </Field>

          {/* Voice Selector */}
          <VoiceSelector
            currentVoiceId={voiceId}
            onSelect={(id) =>
              form.setValue("voiceId", id, { shouldValidate: true })
            }
            error={errors.voiceId?.message}
          />

          {/* Submit Button */}
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