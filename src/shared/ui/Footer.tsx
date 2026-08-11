export function Footer() {
  return (
    <footer className="flex items-center justify-center gap-2 py-2 text-[0.7rem] text-chalk-faint">
      <span>&copy; 2026</span>
      <span aria-hidden="true">&middot;</span>
      <a
        href="https://momiro.ski"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-chalk-dim underline decoration-brand/60 underline-offset-4 transition-colors hover:text-brand-lift hover:decoration-brand-lift"
      >
        momiro.ski
      </a>
    </footer>
  );
}
