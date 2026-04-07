// components/upload/FileUploadDropzone.tsx
import { X } from "lucide-react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input"; // Add this import

interface FileUploadDropzoneProps {
  label: string;
  accept: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  file?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
  isOptional?: boolean;
}

export function FileUploadDropzone({
  label,
  accept,
  icon,
  title,
  description,
  file,
  onChange,
  error,
  isOptional
}: FileUploadDropzoneProps) {
  return (
    <Field>
      <FieldLabel className="font-bold text-zinc-900 text-base">
        {label} {isOptional && <span className="font-normal text-stone-500">(Optional)</span>}
      </FieldLabel>
      
      <div className="upload-dropzone relative border-2 border-dashed border-stone-200 rounded-xl bg-white hover:bg-stone-50 transition-colors flex flex-col items-center justify-center p-10 cursor-pointer mt-2">
        {file ? (
          <div className="flex items-center gap-4 bg-stone-100 px-6 py-4 rounded-lg shadow-sm border border-stone-200 z-10 w-full max-w-sm justify-between">
            <div className="flex items-center gap-4 truncate">
              {icon}
              <div className="flex flex-col truncate">
                <span className="font-semibold text-zinc-900 truncate">{file.name}</span>
                <span className="text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Remove ${label}`}
              onClick={(e) => {
                e.preventDefault();
                onChange(undefined);
              }}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-zinc-900 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Swapped to shadcn Input here */}
            <Input
              type="file"
              accept={accept}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) onChange(selectedFile);
              }}
            />
            {icon}
            <p className="font-semibold text-zinc-900 mt-3">{title}</p>
            <FieldDescription className="mt-1 text-stone-500">{description}</FieldDescription>
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-500 font-medium mt-1">{error}</p>}
    </Field>
  );
}