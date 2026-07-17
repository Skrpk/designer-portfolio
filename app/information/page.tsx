import type { Metadata } from "next";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Information — Studio",
  description: "Services, process, and contact information.",
};

export default function InformationPage() {
  return (
    <div className="container">
      <article className={styles.wrap}>
        <p className={styles.kicker}>Information</p>
        <h1 className={styles.title}>Studio &amp; services</h1>

        <p className={styles.lead}>
          A full-service interior design studio working on residential,
          hospitality, and workspace projects worldwide.
        </p>

        <h2 className={styles.sectionTitle}>Services</h2>
        <div className={styles.body}>
          <p>
            Interior architecture · Space planning · Furniture, fixtures &amp;
            equipment · Material and finish selection · Custom joinery ·
            Styling and art direction · Project management.
          </p>
        </div>

        <h2 className={styles.sectionTitle}>Process</h2>
        <div className={styles.body}>
          <p>
            1. Discovery &amp; brief — 2. Concept &amp; mood — 3. Design
            development — 4. Documentation — 5. Procurement — 6. Delivery &amp;
            styling.
          </p>
        </div>

        <h2 className={styles.sectionTitle}>Contact</h2>
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
