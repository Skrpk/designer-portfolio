import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import ProjectForm from "../../ProjectForm";
import styles from "../../page.module.css";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container">
      <div className={styles.wrap}>
        <header className={styles.header}>
          <Link href="/admin" className={styles.actionLink}>
            &larr; Back to admin
          </Link>
          <h1 className={styles.title}>Edit project</h1>
          <p className={styles.copy}>
            Update details or images. Removed images are deleted from Blob when
            you save.
          </p>
        </header>

        <ProjectForm project={project} />
      </div>
    </div>
  );
}
