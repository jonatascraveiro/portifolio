export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-6">
      <p className="mx-auto max-w-3xl px-6 text-sm text-zinc-500">
        © {new Date().getFullYear()} Jonatas Craveiro. Projeto pessoal sem fins comerciais.
      </p>
    </footer>
  );
}
