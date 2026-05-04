"use server";

import VoiceSession from "@/database/models/voice-session.model";
import { connectToDatabase } from "@/database/mongoose";
import { getBillingPeriodStart } from "@/lib/subscription-constants";
import { success } from "zod";

export interface StartSessionResult {
  success: boolean;
  sessionId?: string;
  maxDurationSeconds?: number;
  error?: string;
}

export interface EndSessionResult {
  success: boolean;
  error?: string;
}

export const startVoiceSession = async (
  clerkId: string,
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    await connectToDatabase();
    // check for limits/Plan to see if user can start session

    const session = await VoiceSession.create({
      clerkId,
      bookId,
      status: "active",
      startedAt: new Date(),
      billingPeriodStart: getBillingPeriodStart(),
      durationSeconds: 0,
    });

    return {
      success: true,
      sessionId: session._id.toString(),
      //maxDurationMinutes: 60, // TODO: Fetch from user's subscription plan
    };
  } catch (error) {
    console.error("Error starting voice session:", error);
    return {
      success: false,
      error: "Failed to start voice session. Please try again later.",
    };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    await connectToDatabase();

    const result = await VoiceSession.findByIdAndUpdate(sessionId, {
      status: "completed",
      endedAt: new Date(),
      durationSeconds,
    });

    if (!result) {
      console.error("Voice session not found");
      throw new Error("Voice session not found");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error ending voice session:", error);
    return {
      success: false,
      error: "Failed to end voice session. Please try again later.",
    };
  }
};
