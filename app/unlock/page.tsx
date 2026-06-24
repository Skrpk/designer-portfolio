import styles from "./page.module.css";

function safeNext(next: string | undefined): string {
  if (!next) return "/";
  // Only allow internal, absolute paths to avoid open redirects.
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const target = safeNext(next);

  return (
    <div className="container">
      <div className={styles.wrap}>
        <h1 className={styles.title}>Private project</h1>
        <p className={styles.copy}>
          This project is password protected. Enter the access password to
          continue.
        </p>

        <form action="/api/auth/verify" method="post" className={styles.form}>
          <input type="hidden" name="next" value={target} />
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
            />
          </div>

          {error && <p className={styles.error}>Incorrect password. Try again.</p>}

          <button type="submit" className="btn">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
