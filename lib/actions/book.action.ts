"use server";

import { connectToDatabase } from "@/database/mongoose";
import { generateSlug } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import { revalidatePath } from "next/cache";
import { getPlanLimits } from "@/lib/subscriptions.server";


export interface CreateBook {
  clerkId: string;
  title: string;
  author: string;
  persona?: string;
  fileURL: string;
  fileBlobKey: string;
  coverURL?: string;
  coverBlobKey?: string;
  fileSize: number;
}

export interface TextSegment {
  text: string;
  segmentIndex: number;
  pageNumber?: number;
  wordCount: number;
}

export const getAllBooks = async () => {
  try {
    await connectToDatabase();
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(books)),
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      success: false,
      error: "Failed to fetch books. Please try again later.",
    };
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    await connectToDatabase();

    // Find the book by its slug
    const book = await Book.findOne({ slug }).lean();

    if (!book) {
      return {
        success: false,
        error: "Book not found.",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(book)),
    };
  } catch (error) {
    console.error("Error fetching book by slug:", error);
    return {
      success: false,
      error: "Failed to fetch book details. Please try again later.",
    };
  }
};

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(title);
    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        exists: true,
        data: JSON.parse(JSON.stringify(existingBook)),
        alreadyExists: true,
      };
    } else {
      return {
        exists: false,
      };
    }
  } catch (error) {
    console.error("Error checking book existence:", error);
    return {
      success: false,
      error: "Failed to check book existence. Please try again later.",
    };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(data.title);
    // Check if a book with the same slug already exists
    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(existingBook)),
        alreadyExists: true,
      };
    }

    // check subscription limits before creating a new book
    // (implementation for subscription limit checking would go here)
    const limits = await getPlanLimits();

    // 2. Count Existing Books
    const currentBookCount = await Book.countDocuments({
      clerkId: data.clerkId,
    });

    // 3. Enforce Limit
    if (currentBookCount >= limits.maxBooks) {
      return { 
        success: false, 
        error: `You have reached your limit of ${limits.maxBooks} book(s) on your current plan. Please upgrade to add more.` 
      };
    }
    const book = await Book.create({
      ...data,
      slug,
      totalSegments: 0,
    });
    if (book) {
      revalidatePath("/");
      return {
        success: true,
        data: JSON.parse(JSON.stringify(book)),
      };
    } else {
      return {
        success: false,
        error: "Failed to create book. Please try again later.",
      };
    }
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      success: false,
      error: "Failed to create book. Please try again later.",
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();

    const segmentToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        bookId,
        clerkId,
        content: text,
        segmentIndex: segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentToInsert);

    await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

    console.log("Book segments saved successfully");

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    };
  } catch (error) {
    console.error("Error saving book segments:", error);
    await BookSegment.deleteMany({ bookId, clerkId });
    await Book.findByIdAndDelete(bookId);
    console.log("Deleted book and segments due to error during segment saving");
    return {
      success: false,
      error: "Failed to save book segments. Please try again later.",
    };
  }
};


// Append this to the bottom of lib/actions/book.action.ts

export const searchBookSegments = async (bookId: string, query: string, limit: number = 5) => {
  try {
    await connectToDatabase();

    // Standard MongoDB text search. 
    // Ensure you have a text index created on the 'content' field in your BookSegment schema.
    const segments = await BookSegment.find(
      { 
        bookId, 
        $text: { $search: query } 
      },
      { score: { $meta: "textScore" } } // Project the match score
    )
    .sort({ score: { $meta: "textScore" } }) // Sort by highest relevance
    .limit(limit) // Limit to top 5 as requested
    .lean();

    return {
      success: true,
      data: segments,
    };
  } catch (error) {
    console.error("Error searching book segments:", error);
    return {
      success: false,
      error: "Failed to search segments. Please try again later.",
    };
  }
};