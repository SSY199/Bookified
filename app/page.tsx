import React from 'react'
import HeroSection from "@/components/section/HeroSection";
import { sampleBooks } from '@/lib/constants';
import BookCard from '@/components/BookCard';

const Page = () => {
  return (
    <main className="min-h-screen bg-[#FDFCF8]"> {/* Warm off-white background */}
      <HeroSection />
      
      <section className="px-10 py-16 max-w-7xl mx-auto">
        {/* Grid setup to match the screenshot density */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
          {sampleBooks.map((book) => (
            <BookCard 
              key={book._id} 
              title={book.title} 
              author={book.author} 
              coverURL={book.coverURL} 
              slug={book.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page