import type { Project } from "@/data/profile";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900">{project.name}</h3>
      <p className="mt-2 text-zinc-700">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
          >
            {tech}
          </li>
        ))}
      </ul>
      {project.link && (
        <a
          href={project.link}
          className="mt-4 inline-block text-sm font-medium text-zinc-900 underline"
        >
          Ver projeto
        </a>
      )}
    </article>
  );
}
