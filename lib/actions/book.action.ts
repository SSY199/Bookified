"use server";

import { connectToDatabase } from "@/database/mongoose";
import { generateSlug } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";


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
        console.error('Error checking book existence:', error);
        return {
            success: false,
            error: 'Failed to check book existence. Please try again later.',
        }
    }
}

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
      const book = await Book.create({
        ...data,
        slug,
        totalSegments: 0
      });
      if (book) {
        return {
          success: true,
          data: JSON.parse(JSON.stringify(book)),
        };
      } else {
        return {
          success: false,
          error: 'Failed to create book. Please try again later.',
        };
      }
      
    } catch (error) {
      console.error('Error creating book:', error);
      return {
        success: false,
        error: 'Failed to create book. Please try again later.',
      }
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase();

        const segmentToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            bookId,
            clerkId,
            content: text,
            segmentIndex:segmentIndex,
            pageNumber,
            wordCount
        }));
        
        await BookSegment.insertMany(segmentToInsert);

        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

        console.log('Book segments saved successfully');

        return {
            success: true,
            data: { segmentsCreated: segments.length },
        }
    }
    catch (error) {
        console.error('Error saving book segments:', error);
        await BookSegment.deleteMany({ bookId, clerkId });
        await Book.findByIdAndDelete(bookId);
        console.log('Deleted book and segments due to error during segment saving');
        return {
            success: false,
            error: 'Failed to save book segments. Please try again later.',
        }
    }
}