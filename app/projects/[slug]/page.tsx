import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/auth";
import { isVideoUrl } from "@/lib/media";
import ImageGallery from "./ImageGallery";
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

  const images = project.images.filter((src) => !isVideoUrl(src));
  const videos = project.images.filter((src) => isVideoUrl(src));
  const backHref = project.visibility === "private" ? "/private" : "/";

  return (
    <article className="container-small">
      <Link href={backHref} className={styles.back}>
        &larr; Back to work
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{project.name}</h1>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
      </header>

      {images.length > 0 && (
        <ImageGallery images={images} projectName={project.name} />
      )}

      {videos.length > 0 && (
        <div className={styles.videos}>
          {videos.map((src) => (
            <div key={src} className={styles.videoWrap}>
              <video
                src={src}
                className={styles.video}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
