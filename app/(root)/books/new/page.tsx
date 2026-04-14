import React from 'react'
import UploadForm from '@/components/upload/UploadForm';

const Page = () => {
  return (
    <main className="wrapper container py-14">
      <div className="mx-auto max-w-4xl space-y-12">

        {/* Header Section */}
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl font-serif font-semibold text-gray-900 tracking-tight">
            Add a New Book
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            Upload a PDF to generate an interactive AI-powered conversation for your readers.
          </p>
        </section>

        {/* Form Section */}
         <UploadForm />

      </div>
    </main>
  );
};

export default Page;