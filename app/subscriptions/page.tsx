"use client";

import { PricingTable } from "@clerk/nextjs";

export default function SubscriptionsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FDFCF8] text-zinc-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_-15%,rgba(139,115,85,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_50%,rgba(232,215,184,0.35),transparent_50%),radial-gradient(ellipse_60%_45%_at_0%_80%,rgba(99,72,50,0.06),transparent_45%)]"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B7355]">
            Pricing
          </p>
          <h1 className="font-serif text-[2rem] font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl sm:leading-[1.15] lg:text-[2.75rem]">
            Choose Your Plan
          </h1>
          <p className="mt-5 text-pretty text-base font-medium leading-relaxed text-stone-600 sm:text-lg">
            Unlock more books, longer voice sessions, and advanced features by
            upgrading your plan.
          </p>
        </header>

        <div className="vapi-pricing-wrapper subscriptions-pricing-surface mx-auto w-full max-w-7xl rounded-3xl border border-[#e8d7b8]/90 bg-white/75 p-5 shadow-[0_22px_50px_-12px_rgba(99,72,50,0.12),0_0_0_1px_rgba(255,255,255,0.6)_inset] backdrop-blur-md sm:p-8 lg:p-10">
          <PricingTable />
        </div>
      </div>
    </main>
  );
}
