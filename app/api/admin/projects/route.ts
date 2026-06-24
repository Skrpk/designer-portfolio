import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createProject, type Visibility } from "@/lib/projects";

interface CreatePayload {
  name?: unknown;
  description?: unknown;
  visibility?: unknown;
  images?: unknown;
}

// Requests to this route are already guarded by Basic Auth in middleware.ts.
export async function POST(request: NextRequest) {
  let payload: CreatePayload;
  try {
    payload = (await request.json()) as CreatePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description : "";
  const visibility: Visibility =
    payload.visibility === "private" ? "private" : "public";
  const images = Array.isArray(payload.images)
    ? payload.images.filter((u): u is string => typeof u === "string")
    : [];

  if (!name) {
    return NextResponse.json(
      { error: "Project name is required." },
      { status: 400 }
    );
  }

  try {
    const project = await createProject({
      name,
      description,
      visibility,
      images,
    });

    revalidatePath("/");
    revalidatePath(`/projects/${project.slug}`);

    return NextResponse.json({ slug: project.slug });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
