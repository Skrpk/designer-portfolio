import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/lib/projects";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/auth";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  if (project.visibility === "private") {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;
    const authorized = await verifySessionValue(session);
    if (!authorized) {
      redirect(`/unlock?next=${encodeURIComponent(`/projects/${slug}`)}`);
    }
  }

  return (
    <article className="container">
      <Link href="/" className={styles.back}>
        &larr; Back to work
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{project.name}</h1>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
      </header>

      {project.images.length > 0 && (
        <div className={styles.gallery}>
          {project.images.map((src, i) => (
            <div key={src} className={styles.imageWrap}>
              <Image
                src={src}
                alt={`${project.name} — image ${i + 1}`}
                width={1600}
                height={1066}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 1200px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
