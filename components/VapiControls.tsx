"use client";

import React from "react";
import { Mic, MicOff } from "lucide-react";
import { IBook } from "@/database/models/book.model";
import { useVapi } from "@/hooks/useVapi";
import Image from "next/image";
import { Transcript } from "./Transcript"; // Adjust import path if needed

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    messages,
    isActive,
    currentMessage,
    currentUserMessage,
    start,
    stop,
    clearError,
  } = useVapi(book);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Card Section */}
      <section className="bg-[#f3e4c7] rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start shadow-sm border border-[#e8d7b8]">
        {/* Left: Book Cover & Mic Overlay */}
        <div className="relative shrink-0">
          <div className="relative w-32.5 aspect-2/3 rounded-lg shadow-md overflow-hidden border border-stone-200/20 bg-stone-100">
            <Image
              src={book.coverURL || "/assets/placeholder-book.png"}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Overlapping Mic Button - Toggles Vapi Status */}
          <button
            onClick={isActive ? stop : start}
            disabled={status === "connecting" || status === "starting"}
            className={`absolute -bottom-4 -right-4 w-15 h-15 rounded-full flex items-center justify-center shadow-lg border border-stone-100 hover:scale-105 transition-all z-10 ${
              isActive
                ? "bg-red-50 text-red-500 animate-pulse"
                : "bg-white text-zinc-700"
            }`}
          >
            {isActive ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Right: Book Details & Badges */}
        <div className="flex flex-col mt-2 sm:mt-0 text-center sm:text-left w-full">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900 leading-tight">
            {book.title}
          </h1>
          <p className="text-stone-600 mt-2 mb-6 font-medium text-lg">
            by {book.author}
          </p>

          {/* Pill Badges Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-auto">
            {/* Status Pill */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-sm font-semibold text-zinc-800 shadow-sm border border-stone-100">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-stone-400"}`}
              ></span>
              <span>{status || "Ready"}</span>
            </div>

            {/* Voice Selection Pill */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md text-sm font-semibold text-zinc-800 shadow-sm border border-stone-100">
              <span className="text-stone-500 font-medium">Voice</span>
              <span className="capitalize">{book.persona || "Default"}</span>
            </div>

            {/* Timer Pill - Can be re-enabled when you add a timer hook */}
            {/* <div className="flex items-center bg-white px-3 py-1.5 rounded-md text-sm font-semibold text-zinc-800 shadow-sm border border-stone-100">
              0:00/15:00
            </div> */}
          </div>
        </div>
      </section>

      {/* 2. Transcript Area Section */}
      <div className="w-full">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
    </div>
  );
};

export default VapiControls;
