import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HOME_NAV_LINKS = [
  { label: "Our Story", href: "#about" },
  { label: "Our Tutors", href: "/tutors" },
  { label: "Subjects", href: "/subjects" },
  { label: "Reviews", href: "#reviews" },
  { label: "Our Difference", href: "#difference" },
];

const PAGE_NAV_LINKS = [
  { label: "Our Story", href: "/#about" },
  { label: "Our Tutors", href: "/tutors" },
  { label: "Subjects", href: "/subjects" },
  { label: "Pricing", href: "/pricing" },
];

const NAV_MARGIN_SCROLLED = "144px";
const NAV_MARGIN_DEFAULT = "44px";
const LG_BREAKPOINT = 1024;

interface Props {
  variant?: "home" | "page";
}

export default function Nav({ variant = "page" }: Props) {
  const isHome = variant === "home";
  const navLinks = isHome ? HOME_NAV_LINKS : PAGE_NAV_LINKS;
  const bookHref = "#contact";
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= LG_BREAKPOINT);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= LG_BREAKPOINT);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const marginX =
    scrolled && isDesktop ? NAV_MARGIN_SCROLLED : NAV_MARGIN_DEFAULT;

  return (
    <header className="sticky top-6 z-30 bg-transparent">
      <div
        style={{
          marginLeft: marginX,
          marginRight: marginX,
          transition:
            "margin-left 700ms cubic-bezier(0.4,0,0.2,1), margin-right 700ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="insight-nav-glass relative flex items-center overflow-hidden transition-all duration-500 ease-out"
          style={{ height: "63px", borderRadius: "100px" }}
        >
          <a
            href="/"
            className="flex min-w-0 items-center gap-1 shrink-0 pl-2 min-[400px]:pl-4"
          >
            <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M14 23 L4 17 L4 5 L14 11 Z" fill="#F0744A" />
              <path d="M14 23 L24 17 L24 5 L14 11 Z" fill="#F0744A" fillOpacity="0.55" />
              <line x1="14" y1="23" x2="14" y2="11" stroke="white" strokeOpacity="0.5" strokeWidth="1.4" />
              <circle cx="14" cy="11" r="1.2" fill="white" fillOpacity="0.4" />
            </svg>
            <span className="insight-heading hidden min-[320px]:inline text-[15px] font-semibold tracking-tight whitespace-nowrap">
              Insight Tutors
            </span>
          </a>

          <ul className="hidden flex-1 items-center justify-center gap-4 text-sm font-medium text-[#555551] lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-[#1A1615] whitespace-nowrap">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto shrink-0 pr-1 min-[400px]:pr-4">
            <a
              href={bookHref}
              className="liquid-glass-light hidden lg:flex items-center justify-center px-6 text-sm ring-1 ring-black/20 whitespace-nowrap transition-opacity hover:opacity-75 active:scale-[0.98]"
              style={{ height: "47px", borderRadius: "100px" }}
            >
              Book a free class
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden flex h-[40px] w-[40px] min-[400px]:w-[56px] items-center justify-center rounded-full text-[#1A1615] transition-colors hover:bg-black/5 active:scale-[0.97]"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="insight-nav-glass mt-3 rounded-2xl p-6 lg:hidden">
            <ul className="flex flex-col items-center gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="text-base font-medium text-[#1A1615] transition-colors hover:text-[#F0744A]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={bookHref}
              onClick={closeMenu}
              className="liquid-glass-light mt-6 flex w-full items-center justify-center rounded-full py-3.5 text-sm ring-1 ring-black/20 transition-opacity hover:opacity-75 active:scale-[0.98]"
            >
              Book a free class
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
