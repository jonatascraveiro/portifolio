import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">{profile.name}</h1>
      <p className="mt-3 text-xl text-zinc-600">{profile.title}</p>
    </section>
  );
}
