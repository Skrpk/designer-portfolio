"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Status = "idle" | "working" | "done" | "error";

export default function AdminForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("error");
      setMessage("Project name is required.");
      return;
    }

    setStatus("working");
    setCreatedSlug(null);

    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setMessage(`Uploading image ${i + 1} of ${files.length}…`);
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
        urls.push(blob.url);
      }

      setMessage("Saving project…");
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          visibility,
          images: urls,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Failed to save project.");
      }

      const data = (await res.json()) as { slug: string };
      setStatus("done");
      setMessage("Project created.");
      setCreatedSlug(data.slug);
      setName("");
      setDescription("");
      setVisibility("public");
      setFiles([]);
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

      <div>
        <label htmlFor="images">Images</label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          disabled={working}
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.length > 0 && (
          <p className={styles.fileList}>
            {files.length} file{files.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <button type="submit" className="btn" disabled={working}>
        {working ? "Working…" : "Create project"}
      </button>

      {message && (
        <p
          className={
            status === "error" ? styles.error : styles.statusMessage
          }
        >
          {message}{" "}
          {status === "done" && createdSlug && (
            <a
              className={styles.inlineLink}
              href={`/projects/${createdSlug}`}
            >
              View project →
            </a>
          )}
        </p>
      )}
    </form>
  );
}
