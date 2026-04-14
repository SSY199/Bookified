import { Schema, Types } from "mongoose";
import { model, models } from "mongoose";

export interface IVoiceSession {
  _id: string;
  clerkId: string;
  bookId: Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;
  billingPeriodStart: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const VoiceSessionSchema = new Schema<IVoiceSession>(
  {
    clerkId: { type: String, required: true, index: true },
    bookId: { type: Types.ObjectId, required: true },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date },
    durationSeconds: { type: Number, required: true, default: 0 },
    billingPeriodStart: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

VoiceSessionSchema.index({ clerkId: 1, billingPeriodStart: 1 });

const VoiceSession = models.VoiceSession || model<IVoiceSession>("VoiceSession", VoiceSessionSchema);

export default VoiceSession;