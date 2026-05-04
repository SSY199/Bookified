"use client";

import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export interface Messages  {
    role: string;
    content: string;
}


interface TranscriptProps {
  messages: Messages[];
  currentMessage: string;
  currentUserMessage: string;
}

export const Transcript = ({
  messages,
  currentMessage,
  currentUserMessage,
}: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  const hasMessages =
    messages.length > 0 || currentMessage.length > 0 || currentUserMessage.length > 0;

  return (
    <section className="bg-[#EBEAE5] rounded-2xl shadow-sm border border-stone-200 min-h-100 max-h-150 flex flex-col overflow-hidden relative w-full">
      
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white rounded-full shadow-sm">
            <Mic className="w-8 h-8 text-zinc-800" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">
            No conversation yet
          </h3>
          <p className="text-stone-500 mt-2 font-medium">
            Click the mic button above to start talking
          </p>
        </div>
      ) : (
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"
        >
          {/* Render Completed Messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-4 max-w-[80%] text-[15px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#663820] text-white rounded-2xl rounded-br-sm"
                    : "bg-[#E6D4B8] text-zinc-900 rounded-2xl rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Render Streaming User Message */}
          {currentUserMessage && (
            <div className="flex w-full justify-end">
              <div className="px-5 py-4 max-w-[80%] text-[15px] leading-relaxed shadow-sm bg-[#663820] text-white rounded-2xl rounded-br-sm">
                {currentUserMessage}
                <span className="inline-block w-1.5 h-4 ml-1 bg-white animate-pulse align-middle" />
              </div>
            </div>
          )}

          {/* Render Streaming Assistant Message */}
          {currentMessage && (
            <div className="flex w-full justify-start">
              <div className="px-5 py-4 max-w-[80%] text-[15px] leading-relaxed shadow-sm bg-[#E6D4B8] text-zinc-900 rounded-2xl rounded-bl-sm">
                {currentMessage}
                <span className="inline-block w-1.5 h-4 ml-1 bg-zinc-900 animate-pulse align-middle" />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};