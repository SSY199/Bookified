import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  coverURL: string;
  slug: string;
}

const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`} className="group block w-full">
      <article className="flex flex-col">
        {/* The White Card Container */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 mb-4">
          <div className="relative aspect-2/3 w-full overflow-hidden rounded-md shadow-inner">
            <Image 
              src={coverURL} 
              alt={title} 
              fill 
              className="object-cover" 
            />
          </div>
        </div>

        {/* Text Metadata */}
        <div className="space-y-1 px-1">
          <h3 className="font-bold text-zinc-900 leading-tight line-clamp-1">
            {title}
          </h3>
          <p className="text-sm font-medium text-stone-500">
            {author}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default BookCard;
