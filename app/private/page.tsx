import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProjects } from "@/lib/projects";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/auth";
import ProjectGrid from "../ProjectGrid";

export const dynamic = "force-dynamic";

export default async function PrivatePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  const authorized = await verifySessionValue(session);

  if (!authorized) {
    redirect(`/unlock?next=${encodeURIComponent("/private")}`);
  }

  const projects = await getProjects();
  const privateProjects = projects.filter((p) => p.visibility === "private");

  return (
    <div className="container">
      <ProjectGrid
        projects={privateProjects}
        title="Private work"
        emptyMessage="No private projects yet."
      />
    </div>
  );
}
