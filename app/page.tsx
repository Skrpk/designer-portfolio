import Link from "next/link";
import { getProjects } from "@/lib/projects";
import ProjectGrid from "./ProjectGrid";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects();
  const publicProjects = projects.filter((p) => p.visibility === "public");

  return (
    <div className="container">
      <section className={styles.hero} aria-labelledby="home-intro">
        <h1 id="home-intro" className={styles.heroTitle}>
          Interior Designer creating calm, timeless spaces.
        </h1>
        <p className={styles.heroSub}>
          Selected work · Residential &amp; commercial
        </p>
      </section>

      <div className={styles.stats} aria-label="Studio highlights">
        <p className={styles.stat}>
          <strong>{publicProjects.length}</strong>
          Public projects
        </p>
        <p className={styles.stat}>
          <strong>10+</strong>
          Years of practice
        </p>
        <p className={styles.stat}>
          <strong>Dubai · Kyiv</strong>
          Studio locations
        </p>
      </div>

      <ProjectGrid
        projects={publicProjects}
        title="Selected work"
        emptyMessage="No projects yet."
      />

      <section className={styles.bottom}>
        <p className={styles.press}>
          Featured in Dezeen &amp; Architectural Digest · Shortlisted, Interior
          Design Awards 2024
        </p>
        <p className={styles.cta}>
          <Link href="/information">Start a project</Link>
          <span className={styles.ctaSep} aria-hidden="true">
            /
          </span>
          <Link href="/private">Private portfolio</Link>
        </p>
      </section>
    </div>
  );
}
