import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import { isVideoUrl } from "@/lib/media";
import styles from "./ProjectGrid.module.css";

export default function ProjectGrid({
  projects,
  title,
  emptyMessage,
}: {
  projects: Project[];
  title: string;
  emptyMessage: string;
}) {
  return (
    <>
      <h1 className={styles.srOnly}>{title}</h1>

      {projects.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
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
    </>
  );
}
