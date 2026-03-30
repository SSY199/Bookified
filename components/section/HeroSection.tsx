import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="px-10 py-8">
      <div className="relative w-full min-h-100 bg-[#F2E8CF] rounded-[32px] p-12 flex items-center justify-between overflow-hidden shadow-sm">
        
        {/* LEFT: Text Content */}
        <div className="flex-1 z-10 max-w-sm">
          <h1 className="font-serif text-5xl font-bold text-zinc-900 mb-4">
            Your Library
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed mb-8">
            Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
          </p>
          <Button 
            className="bg-white text-zinc-900 hover:bg-white/90 rounded-xl px-6 py-6 text-lg font-semibold shadow-sm border-none gap-2"
          >
            <Plus className="w-5 h-5" />
            Add new book
          </Button>
        </div>

        {/* CENTER: Illustration */}
        <div className="flex-1 flex justify-center z-10">
          <div className="relative w-112.5 h-75">
            <Image
              src="/assets/hero-illustration.png" // Replace with your actual asset path
              alt="Vintage books and globe"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* RIGHT: Process Card */}
        <div className="z-10">
          <div className="bg-white rounded-2xl p-8 shadow-sm w-70 flex flex-col gap-6">
            <Step number={1} title="Upload PDF" desc="Add your book file" />
            <Step number={2} title="AI Processing" desc="We analyze the content" />
            <Step number={3} title="Voice Chat" desc="Discuss with AI" />
          </div>
        </div>
      </div>

      
    </section>
  );
};

// Reusable Step Component
const Step = ({ number, title, desc }: { number: number; title: string; desc: string }) => (
  <div className="flex items-start gap-4">
    <div className="shrink-0 w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-sm font-medium text-stone-600">
      {number}
    </div>
    <div className="flex flex-col">
      <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
      <p className="text-xs text-stone-500">{desc}</p>
    </div>
  </div>
);

export default HeroSection;