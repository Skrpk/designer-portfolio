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
          Interior designer crafting calm, considered spaces where light,
          material, and proportion work in quiet harmony.
        </p>

        <div className={styles.body}>
          <p>
            With over a decade of practice across residential and commercial
            projects, my work is rooted in the belief that good design is felt
            before it is seen. Every room begins with how people move, rest, and
            gather — and grows from there into something both functional and
            timeless.
          </p>
          <p>
            I work closely with a trusted network of craftspeople and suppliers,
            selecting natural materials and honest finishes that age gracefully.
            The result is interiors that feel personal, unhurried, and made to
            last.
          </p>
          <p>
            From first sketch to final styling, I stay hands-on — because the
            details are where a space truly comes alive.
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
