import Link from "next/link";
import { getProjects } from "@/lib/projects";
import ProjectForm from "./ProjectForm";
import DeleteButton from "./DeleteButton";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const projects = await getProjects();

  return (
    <div className="container">
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}>New project</h1>
          <p className={styles.copy}>
            Add a project. Images upload to Vercel Blob; metadata is saved to a
            JSON file in Blob.
          </p>
        </header>

        <ProjectForm />

        <section className={styles.listSection}>
          <h2 className={styles.subtitle}>
            Existing projects ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <p className={styles.copy}>No projects yet.</p>
          ) : (
            <ul className={styles.projectList}>
              {projects.map((project) => (
                <li key={project.id} className={styles.projectRow}>
                  <div className={styles.projectThumb}>
                    {project.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.cover}
                        alt=""
                        className={styles.projectThumbImg}
                      />
                    ) : (
                      <span className={styles.projectThumbEmpty} />
                    )}
                  </div>
                  <div className={styles.projectInfo}>
                    <span className={styles.projectName}>{project.name}</span>
                    <span className={styles.projectMeta}>
                      {project.visibility} · {project.images.length} image
                      {project.images.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className={styles.projectActions}>
                    <Link
                      href={`/admin/${project.id}/edit`}
                      className={styles.actionLink}
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      className={styles.actionLink}
                    >
                      View
                    </Link>
                    <DeleteButton id={project.id} name={project.name} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
