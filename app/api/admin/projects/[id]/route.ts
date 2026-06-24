import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  deleteProject,
  updateProject,
  type Visibility,
} from "@/lib/projects";

interface UpdatePayload {
  name?: unknown;
  description?: unknown;
  visibility?: unknown;
  images?: unknown;
}

// Requests to this route are already guarded by Basic Auth in middleware.ts.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let payload: UpdatePayload;
  try {
    payload = (await request.json()) as UpdatePayload;
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
    const project = await updateProject(id, {
      name,
      description,
      visibility,
      images,
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const ok = await deleteProject(id);
    if (!ok) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
