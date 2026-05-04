import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import VapiControls from "@/components/VapiControls";

// Import your database action
import { getBookBySlug } from "@/lib/actions/book.action";

interface BookDetailsPageProps {
  params: {
    slug: string;
  };
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  // 1. Require Authentication
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Fetch Book Data
  const { slug } = await params;
  // 3. Redirect if book doesn't exist
  const { success, data: book } = await getBookBySlug(slug);
  if (!success || !book) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] py-12 px-6 relative">
      {/* Floating Back Button */}
      <Link
        href="/"
        aria-label="Back to home"
        className="back-btn-floating fixed top-24 left-6 md:left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-stone-200 hover:bg-stone-50 transition-colors z-50 text-zinc-700"
      >
        <ArrowLeft aria-hidden="true" className="w-5 h-5" />
      </Link>

      <div className="book-page-container max-w-4xl mx-auto space-y-6 pt-12 md:pt-0">
        {/* 1. Header Card Section */}
        

        {/* 2. Transcript Area Section */}
        <section className="transcript-container bg-white rounded-2xl p-8 shadow-sm border border-stone-100 min-h-100 flex items-center justify-center">
          <VapiControls book={book} />
        </section>
      </div>
    </main>
  );
}

