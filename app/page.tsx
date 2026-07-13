import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/projects";
import { isVideoUrl } from "@/lib/media";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="container">
      <h1 className={styles.srOnly}>Selected work</h1>

      {projects.length === 0 ? (
        <p className={styles.empty}>
          No projects yet. Add your first one from the{" "}
          <Link href="/admin" className={styles.inlineLink}>
            admin page
          </Link>
          .
        </p>
      ) : (
        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.id} className={styles.card}>
              <Link
                href={`/projects/${project.slug}`}
                className={styles.cardLink}
              >
                <div className={styles.imageWrap}>
                  {project.cover ? (
                    isVideoUrl(project.cover) ? (
                      <video
                        src={project.cover}
                        className={styles.video}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={project.cover}
                        alt={project.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )
                  ) : (
                    <span className={styles.placeholder} aria-hidden="true" />
                  )}

                  <div className={styles.overlay}>
                    <div className={styles.caption}>
                      <span className={styles.name}>{project.name}</span>
                      <span className={styles.meta}>
                        {project.visibility === "private" ? (
                          <>
                            <span aria-hidden="true">&#128274;</span> Private
                          </>
                        ) : (
                          "Public"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
