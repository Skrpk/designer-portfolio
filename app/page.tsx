import Link from "next/link";
import { getProjects } from "@/lib/projects";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="container">
      <section className={styles.intro}>
        <h1 className={styles.lead}>
          Interior design studio shaping calm, considered spaces.
        </h1>
        <p className={styles.subhead}>Selected Work — {projects.length}</p>
      </section>

      {projects.length === 0 ? (
        <p className={styles.empty}>
          No projects yet. Add your first one from the{" "}
          <Link href="/admin" className={styles.inlineLink}>
            admin page
          </Link>
          .
        </p>
      ) : (
        <ul className={styles.list}>
          {projects.map((project, index) => (
            <li key={project.id} className={styles.row}>
              <Link href={`/projects/${project.slug}`} className={styles.link}>
                <span className={styles.index}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.name}>
                  {project.name}
                  {project.visibility === "private" && (
                    <span className={styles.lock} aria-label="Private project">
                      &#128274;
                    </span>
                  )}
                </span>
                <span className={styles.meta}>
                  {project.visibility === "private" ? "Private" : "View"}
                </span>
                {project.cover && (
                  <span
                    className={styles.preview}
                    style={{ backgroundImage: `url(${project.cover})` }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
