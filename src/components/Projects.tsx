import { profile } from "@/data/profile";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projetos" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-zinc-900">Projetos</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {profile.projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
