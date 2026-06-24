"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function DeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [working, setWorking] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This also removes its images.`)) {
      return;
    }

    setWorking(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Failed to delete project.");
      }
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <button
      type="button"
      className={styles.deleteButton}
      onClick={handleDelete}
      disabled={working}
    >
      {working ? "…" : "Delete"}
    </button>
  );
}
