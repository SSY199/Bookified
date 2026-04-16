import React from 'react'
import HeroSection from "@/components/section/HeroSection";
import BookCard from '@/components/BookCard';
import { getAllBooks } from '@/lib/actions/book.action';


const Page = async () => {

  const bookResults = await getAllBooks();
  const books = bookResults.success ? bookResults.data ?? [] : [];

  return (
    <main className="min-h-screen bg-[#FDFCF8]"> {/* Warm off-white background */}
      <HeroSection />
      
      <section className="px-10 py-16 max-w-7xl mx-auto">
        {/* Grid setup to match the screenshot density */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
          {books.map((book: any) => (
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