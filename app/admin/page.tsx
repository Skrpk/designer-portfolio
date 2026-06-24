import AdminForm from "./AdminForm";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="container">
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}>New project</h1>
          <p className={styles.copy}>
            Add a project. Images upload directly to Vercel Blob; metadata is
            saved to a JSON file in Blob.
          </p>
        </header>
        <AdminForm />
      </div>
    </div>
  );
}
