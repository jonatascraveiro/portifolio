import { profile } from "@/data/profile";

export default function About() {
  return (
    <section id="sobre" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-zinc-900">Sobre</h2>
      <p className="mt-4 text-lg font-medium text-zinc-900">
        {profile.name} — {profile.title}
      </p>
      <p className="mt-4 leading-relaxed text-zinc-700">{profile.bio}</p>
    </section>
  );
}
