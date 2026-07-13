"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import type { Project } from "@/lib/projects";
import { isVideoFile, isVideoUrl } from "@/lib/media";
import styles from "./page.module.css";

type Status = "idle" | "working" | "done" | "error";

export default function ProjectForm({ project }: { project?: Project }) {
  const isEdit = Boolean(project);
  const router = useRouter();

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [visibility, setVisibility] = useState<"public" | "private">(
    project?.visibility ?? "public"
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    project?.images ?? []
  );
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [resultSlug, setResultSlug] = useState<string | null>(null);

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("error");
      setMessage("Project name is required.");
      return;
    }

    setStatus("working");
    setResultSlug(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setMessage(`Uploading ${i + 1} of ${files.length}…`);

        if (isVideoFile(file)) {
          // Videos bypass the ~4.5MB serverless limit by uploading directly to
          // Blob from the browser.
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/blob/client-upload",
          });
          uploadedUrls.push(blob.url);
        } else {
          const uploadData = new FormData();
          uploadData.append("file", file);
          const uploadRes = await fetch("/api/blob/upload", {
            method: "POST",
            body: uploadData,
          });
          if (!uploadRes.ok) {
            const data = (await uploadRes.json().catch(() => ({}))) as {
              error?: string;
            };
            throw new Error(data.error ?? `Failed to upload ${file.name}.`);
          }
          const blob = (await uploadRes.json()) as { url: string };
          uploadedUrls.push(blob.url);
        }
      }

      const images = [...existingImages, ...uploadedUrls];

      setMessage("Saving project…");
      const endpoint = isEdit
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, visibility, images }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Failed to save project.");
      }

      const data = (await res.json()) as { slug: string };
      setStatus("done");
      setResultSlug(data.slug);

      if (isEdit) {
        setMessage("Changes saved.");
        setExistingImages(images);
        setFiles([]);
        router.refresh();
      } else {
        setMessage("Project created.");
        setName("");
        setDescription("");
        setVisibility("public");
        setExistingImages([]);
        setFiles([]);
        router.refresh();
      }
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message);
    }
  }

  const working = status === "working";

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={working}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={working}
        />
      </div>

      <div>
        <label htmlFor="visibility">Visibility</label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) =>
            setVisibility(e.target.value as "public" | "private")
          }
          disabled={working}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {existingImages.length > 0 && (
        <div>
          <label>Current media</label>
          <div className={styles.thumbGrid}>
            {existingImages.map((url) => (
              <div key={url} className={styles.thumb}>
                {isVideoUrl(url) ? (
                  <video
                    src={url}
                    className={styles.thumbImg}
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className={styles.thumbImg} />
                )}
                <button
                  type="button"
                  className={styles.thumbRemove}
                  onClick={() => removeExistingImage(url)}
                  disabled={working}
                  aria-label="Remove media"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="images">
          {isEdit ? "Add media" : "Media (images and mp4 video)"}
        </label>
        <input
          id="images"
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          multiple
          disabled={working}
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.length > 0 && (
          <p className={styles.fileList}>
            {files.length} new file{files.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <button type="submit" className="btn" disabled={working}>
        {working
          ? "Working…"
          : isEdit
          ? "Save changes"
          : "Create project"}
      </button>

      {message && (
        <p
          className={status === "error" ? styles.error : styles.statusMessage}
        >
          {message}{" "}
          {status === "done" && resultSlug && (
            <a
              className={styles.inlineLink}
              href={`/projects/${resultSlug}`}
            >
              View project →
            </a>
          )}
        </p>
      )}
    </form>
  );
}
