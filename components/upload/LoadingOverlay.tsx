// components/upload/LoadingOverlay.tsx
import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#FDFCF8]/80 backdrop-blur-sm rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#663820]" />
        <p className="font-serif text-[#663820] font-semibold text-lg animate-pulse">
          Synthesizing your book...
        </p>
      </div>
    </div>
  );
}