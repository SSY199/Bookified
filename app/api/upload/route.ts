import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request): Promise<NextResponse> {

  try {
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth();
        if (!userId) {
          throw new Error("Unauthorized: User not authenticated");
        }
        return {
          allowedContentTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
          tokenPayload: JSON.stringify({ userId }),
          callbackUrl: "/api/upload",
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload completed for blob:", blob);

        // TODO: Posting — tokenPayload contains JSON.stringify({ userId }) from onBeforeGenerateToken
      },

    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    const status = message.includes("Unauthorized") ? 401 : 500;

    console.error("Error handling upload:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: status },
    );
  }
}
