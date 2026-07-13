import { getProjects } from "@/lib/projects";
import ProjectGrid from "./ProjectGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects();
  const publicProjects = projects.filter((p) => p.visibility === "public");

  return (
    <div className="container">
      <ProjectGrid
        projects={publicProjects}
        title="Selected work"
        emptyMessage="No projects yet."
      />
    </div>
  );
}
