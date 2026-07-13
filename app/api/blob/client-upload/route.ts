import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

// Used for direct browser-to-Blob uploads of large files (videos), which
// exceed the ~4.5MB serverless request-body limit of the plain server route.
// Requests are guarded by Basic Auth in middleware.ts.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"],
        addRandomSuffix: true,
        maximumSizeInBytes: 500 * 1024 * 1024,
      }),
      // Called by Vercel via webhook after upload; not reachable on localhost.
      // Metadata is persisted separately via /api/admin/projects, so this is a
      // no-op.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
