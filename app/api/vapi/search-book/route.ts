import { NextResponse } from "next/server";
import { searchBookSegments } from "@/lib/actions/book.action";
import type { IBookSegment } from "@/database/models/book-segment.model";



export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Vapi sends tool calls inside the message object
    if (body.message?.type === "toolCalls") {
      const toolCalls = body.message.toolCalls;
      const results = [];

      for (const toolCall of toolCalls) {
        // Match the exact name of the tool configured in your Vapi dashboard
        if (toolCall.function.name === "searchBook") {
          
          // Vapi passes arguments as a JSON string, so we must parse it
          const args = typeof toolCall.function.arguments === "string" 
            ? JSON.parse(toolCall.function.arguments) 
            : toolCall.function.arguments;

          const { bookId, query } = args;

          // Call the database action to get the top 3 segments
          const searchResults = await searchBookSegments(bookId, query, 3);

          let resultString = "";

          // Handle the case where no matches are found
          if (!searchResults || !searchResults.success || !searchResults.data || searchResults.data.length === 0) {
            resultString = "No information found about this topic.";
          } else {
            // Combine the matching segments separated by double new lines
            resultString = (searchResults.data as Pick<IBookSegment, "content">[])
              .map((segment) => segment.content)
              .join("\n\n");
          }

          // Push the formatted result matching Vapi's required response schema
          results.push({
            toolCallId: toolCall.id,
            result: resultString,
          });
        }
      }

      // Return the array of results to Vapi
      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });

  } catch (error) {
    console.error("Error handling Vapi tool call:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}