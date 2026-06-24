import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div style={{ maxWidth: "30rem", margin: "8rem auto" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          Not found
        </h1>
        <p style={{ marginTop: "1rem", color: "var(--muted)" }}>
          This page does not exist.
        </p>
        <p style={{ marginTop: "2rem" }}>
          <Link href="/" className="btn">
            Back to work
          </Link>
        </p>
      </div>
    </div>
  );
}
