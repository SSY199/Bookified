import { Types, Schema } from "mongoose";
import { model, models } from "mongoose";

export interface IBookSegment {
  clerkId: string;
  bookId: Types.ObjectId;
  content: string;
  segmentIndex: number;
  pageNumber?: number;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const BookSegmentSchema = new Schema<IBookSegment>(
  {
    clerkId: { type: String, required: true },
    bookId: { type: Types.ObjectId, required: true, ref: "Book", index: true },
    content: { type: String, required: true },
    segmentIndex: { type: Number, required: true, index: true },
    pageNumber: { type: Number, index: true },
    wordCount: { type: Number, required: true },
  },
  { timestamps: true },
);

BookSegmentSchema.index({ bookId: 1, segmentIndex: 1 }, { unique: true });

BookSegmentSchema.index({ bookId: 1, segmentIndex: 1, pageNumber: 1 }, { unique: true });

BookSegmentSchema.index({ bookId: 1, content: "text" });

const BookSegment = models.BookSegment || model<IBookSegment>("BookSegment", BookSegmentSchema);

export default BookSegment;
