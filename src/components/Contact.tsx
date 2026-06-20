import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <section id="contato" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-zinc-900">Contato</h2>
      <ul className="mt-6 flex flex-col gap-3">
        <li>
          <a
            href={`mailto:${profile.links.email}`}
            className="text-zinc-700 underline hover:text-zinc-950"
          >
            {profile.links.email}
          </a>
        </li>
        <li>
          <a
            href={profile.links.github}
            className="text-zinc-700 underline hover:text-zinc-950"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href={profile.links.linkedin}
            className="text-zinc-700 underline hover:text-zinc-950"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </section>
  );
}
