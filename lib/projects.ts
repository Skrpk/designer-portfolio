import { del, list, put } from "@vercel/blob";

const DATA_PATHNAME = "data/projects.json";

export type Visibility = "public" | "private";

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  visibility: Visibility;
  images: string[];
  cover: string | null;
  createdAt: string;
  order: number;
}

export interface NewProjectInput {
  name: string;
  description: string;
  visibility: Visibility;
  images: string[];
}

export interface UpdateProjectInput {
  name: string;
  description: string;
  visibility: Visibility;
  images: string[];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

async function resolveDataUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: DATA_PATHNAME, limit: 1 });
  const match = blobs.find((b) => b.pathname === DATA_PATHNAME);
  return match ? match.url : null;
}

export async function getProjects(): Promise<Project[]> {
  const url = await resolveDataUrl();
  if (!url) return [];

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  try {
    const data = (await res.json()) as Project[];
    if (!Array.isArray(data)) return [];
    return data.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

async function deleteBlobs(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  try {
    await del(urls);
  } catch {
    // Ignore cleanup failures so the metadata update still succeeds.
  }
}

async function saveProjects(projects: Project[]): Promise<void> {
  await put(DATA_PATHNAME, JSON.stringify(projects, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });
}

export async function createProject(
  input: NewProjectInput
): Promise<Project> {
  const projects = await getProjects();

  const existingSlugs = new Set(projects.map((p) => p.slug));
  let slug = slugify(input.name) || "project";
  if (existingSlugs.has(slug)) {
    slug = `${slug}-${shortId()}`;
  }

  const maxOrder = projects.reduce((m, p) => Math.max(m, p.order), -1);

  const project: Project = {
    id: shortId() + shortId(),
    slug,
    name: input.name.trim(),
    description: input.description.trim(),
    visibility: input.visibility,
    images: input.images,
    cover: input.images[0] ?? null,
    createdAt: new Date().toISOString(),
    order: maxOrder + 1,
  };

  projects.push(project);
  await saveProjects(projects);
  return project;
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = projects[index];
  const trimmedName = input.name.trim();

  const removedImages = current.images.filter(
    (url) => !input.images.includes(url)
  );

  let slug = current.slug;
  if (trimmedName !== current.name) {
    const taken = new Set(
      projects.filter((p) => p.id !== id).map((p) => p.slug)
    );
    slug = slugify(trimmedName) || "project";
    if (taken.has(slug)) {
      slug = `${slug}-${shortId()}`;
    }
  }

  const updated: Project = {
    ...current,
    name: trimmedName,
    slug,
    description: input.description.trim(),
    visibility: input.visibility,
    images: input.images,
    cover: input.images[0] ?? null,
  };

  projects[index] = updated;
  await saveProjects(projects);
  await deleteBlobs(removedImages);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const [removed] = projects.splice(index, 1);
  await saveProjects(projects);
  await deleteBlobs(removed.images);
  return true;
}
