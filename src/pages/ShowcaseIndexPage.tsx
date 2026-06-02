const SHOWCASE_PAGES = [
  { href: "/halo.html", title: "Halo", description: "USD fintech landing page" },
  { href: "/max-reed.html", title: "Max Reed", description: "Portfolio features page" },
  { href: "/max-reed-v2.html", title: "Max Reed v2", description: "Portfolio refresh" },
] as const;

export function ShowcaseIndexPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Website Builder</h1>
      <p className="mt-3 text-lg leading-relaxed text-neutral-600">
        Vite showcase for prompt-driven landing pages. Insight Tutors lives separately in{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm">sites/insight-tutors/</code>{" "}
        as an Astro site.
      </p>
      <ul className="mt-10 space-y-3">
        {SHOWCASE_PAGES.map((page) => (
          <li key={page.href}>
            <a
              href={page.href}
              className="block rounded-xl border border-neutral-200 px-5 py-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.99]"
            >
              <span className="font-medium text-neutral-900">{page.title}</span>
              <span className="mt-1 block text-sm text-neutral-500">{page.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
