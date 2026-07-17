import type { Metadata } from "next";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Contact Me — Studio",
  description: "Get in touch with Anastasiia Skrypka.",
};

export default function ContactPage() {
  return (
    <div className="container">
      <article className={styles.wrap}>
        <p className={styles.kicker}>Contact</p>
        <h1 className={styles.title}>Contact me</h1>

        <dl className={styles.defs}>
          <div className={styles.defRow}>
            <dt className={styles.defTerm}>Email</dt>
            <dd className={styles.defVal}>
              <a href="mailto:skripka.design@gmail.com">
                skripka.design@gmail.com
              </a>
            </dd>
          </div>
          <div className={styles.defRow}>
            <dt className={styles.defTerm}>Phone</dt>
            <dd className={styles.defVal}>
              <a href="tel:+380664752398">+380 664752398</a>
            </dd>
          </div>
          <div className={styles.defRow}>
            <dt className={styles.defTerm}>LinkedIn</dt>
            <dd className={styles.defVal}>
              <a
                href="https://www.linkedin.com/in/anastasia-skrypka-9a2999139/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Anastasia Skrypka
              </a>
            </dd>
          </div>
          <div className={styles.defRow}>
            <dt className={styles.defTerm}>Instagram</dt>
            <dd className={styles.defVal}>
              <a
                href="https://www.instagram.com/skrypka_design?igsh=MWFqaW9nNWMyYWJhcQ=="
                target="_blank"
                rel="noopener noreferrer"
              >
                @skrypka_design
              </a>
            </dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
