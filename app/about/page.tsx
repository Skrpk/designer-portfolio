import type { Metadata } from "next";
import Image from "next/image";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "About Me — Studio",
  description: "About the interior designer behind the studio.",
};

export default function AboutPage() {
  return (
    <div className="container">
      <article className={styles.wrap}>
        <p className={styles.kicker}>About me</p>

        <Image
          src="/avatar.jpg"
          alt="Anastasiia Skrypka"
          width={853}
          height={1280}
          className={styles.portraitImg}
          sizes="(max-width: 640px) 60vw, 18rem"
          priority
        />

        <h1 className={styles.title}>Anastasiia Skrypka</h1>

        <p className={styles.lead}>
          I believe every space has a story to tell. As an Interior Designer
          with 14 years of international experience—including 11 years in
          Ukraine and 3 years in Dubai—I create interiors that balance
          aesthetics, functionality, and the way people truly live and work.
        </p>

        <div className={styles.body}>
          <p>
            My portfolio includes residential, commercial, hospitality, and
            workplace projects, each shaped by its own context, culture, and
            purpose. I enjoy transforming ideas into thoughtfully designed
            environments, guiding every stage of the process—from the first
            concept, mood boards, and material selection to technical
            documentation, site coordination, and final execution.
          </p>
          <p>
            For me, interior design is about more than creating beautiful
            spaces. It is about understanding people, solving problems through
            design, and crafting interiors that feel timeless, authentic, and
            effortless. I pay close attention to proportions, materials, natural
            light, and every detail that turns a space into an experience.
          </p>
        </div>

        <h2 className={styles.sectionTitle}>Selected recognition</h2>
        <div className={styles.body}>
          <p>
            Featured in Dezeen and Architectural Digest · Shortlisted, Interior
            Design Awards 2024 · Guest lecturer at the School of Design.
          </p>
        </div>
      </article>
    </div>
  );
}
