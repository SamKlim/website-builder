import { useState, useEffect } from "react";
import { ArrowRight, Clock, Menu, X } from "lucide-react";
// @ts-expect-error shaders has no bundled types
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from "shaders/react";

const NAV_LINKS = ["Projects", "Studio", "Journal", "Connect"] as const;

function getLondonTime(): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  }).format(new Date());
}

function TextRoll({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`overflow-hidden h-[20px] flex flex-col ${className}`}>
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2 flex flex-col">
        <span>{text}</span>
        <span aria-hidden>{text}</span>
      </span>
    </span>
  );
}

function ArrowCircle({
  size = "sm",
  bg = "white",
  iconColor = "text-[#1A1615]",
}: {
  size?: "sm" | "md";
  bg?: "white" | "dark";
  iconColor?: string;
}) {
  const dims = size === "sm" ? "w-6 h-6" : "w-7 h-7 sm:w-8 sm:h-8";
  const bgClass = bg === "white" ? "bg-white" : "bg-white";
  return (
    <span
      className={`${dims} ${bgClass} rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45`}
    >
      <ArrowRight size={size === "sm" ? 12 : 14} className={iconColor} />
    </span>
  );
}

function NavCTA() {
  return (
    <button className="group flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 hover:bg-gray-800 transition-colors duration-300">
      <TextRoll text="Book a strategy call" />
      <ArrowCircle size="sm" bg="white" iconColor="text-[#1A1615]" />
    </button>
  );
}

function MobileMenu({
  open,
  onClose,
  londonTime,
}: {
  open: boolean;
  onClose: () => void;
  londonTime: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`absolute bottom-0 left-0 right-0 mx-3 mb-3 bg-white rounded-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex items-center gap-2 mb-8">
          <Clock size={12} className="text-[#453F3D]" />
          <span className="text-[13px] text-[#453F3D]">{londonTime} in London</span>
        </div>
        <nav className="flex flex-col gap-4 mb-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[28px] leading-[32px] font-medium text-[#1A1615] hover:text-[#453F3D] transition-colors duration-300"
              onClick={onClose}
            >
              {link}
            </a>
          ))}
        </nav>
        <button className="group w-full flex items-center justify-between bg-[#F26522] text-white text-[13px] font-medium rounded-full pl-6 pr-2 py-2 hover:bg-[#e05a1a] transition-colors duration-300">
          <TextRoll text="Start a project" />
          <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
            <ArrowRight size={14} className="text-[#F26522]" />
          </span>
        </button>
      </div>
    </div>
  );
}

function PartnerBadge() {
  return (
    <div
      className="flex items-center gap-2.5 bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-[4px] cursor-default"
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#E8704E] shrink-0"
      >
        <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
      </svg>
      <span className="text-[13px] sm:text-[14px] font-medium text-[#1A1615]">Certified Partner</span>
      <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium shrink-0">
        Featured
      </span>
    </div>
  );
}

export function HeroSection() {
  const [londonTime, setLondonTime] = useState(getLondonTime);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLondonTime(getLondonTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#EFEFEF] flex flex-col overflow-hidden">
      {/* Shader overlay */}
      <Shader className="absolute inset-0 z-10 pointer-events-none">
        <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
        <ChromaFlow
          baseColor="#ffffff"
          downColor="#ff5f03"
          leftColor="#ff5f03"
          rightColor="#ff5f03"
          upColor="#ff5f03"
          momentum={13}
          radius={3.5}
        />
        <FlutedGlass
          aberration={0.61}
          angle={31}
          frequency={8}
          highlight={0.12}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0.15}
        />
        <FilmGrain strength={0.05} />
      </Shader>

      {/* Navbar */}
      <div className="relative z-20 w-full p-2 sm:p-3">
        <div className="max-w-[1440px] mx-auto">
          <nav className="bg-white rounded-full px-[5px] py-[5px] flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold tracking-tight" style={{ fontSize: "10px", lineHeight: "11px" }}>
                  AX
                </span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[14px] text-[#1A1615] hover:text-[#453F3D] transition-colors duration-300"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-4">
              <span className="hidden lg:block text-[13px] text-[#453F3D]">
                Taking on projects for Q1 2026
              </span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#453F3D]" />
                <span className="text-[13px] text-[#453F3D]">{londonTime} in London</span>
              </div>
              <NavCTA />
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium rounded-full px-4 py-2"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
              <span>{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} londonTime={londonTime} />

      {/* Spacer pushes content to bottom */}
      <div className="flex-1" />

      {/* Hero content */}
      <div className="relative z-20 w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          <p
            className="text-[#1A1615] tracking-wide mb-5 sm:mb-8"
            style={{ fontSize: "13px", lineHeight: "14px" }}
          >
            Axion Studio
          </p>
          <h1
            className="font-medium leading-[1.08] tracking-[-0.03em] text-[#1A1615] mb-0"
            style={{
              fontSize: "clamp(1.75rem, 7vw, 4.2rem)",
            }}
          >
            <span className="sm:hidden">
              We craft digital experiences for brands ready to dominate their category online.
            </span>
            <span className="hidden sm:block" style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}>
              We craft digital experiences
              <br />
              for brands ready to dominate
              <br />
              their category online.
            </span>
          </h1>

          {/* CTA row */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
            <button className="group flex items-center gap-2 bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full pl-5 sm:pl-6 pr-2 py-2 transition-colors duration-300">
              <TextRoll
                text="Start a project"
                className="text-[13px] sm:text-[14px]"
              />
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight size={14} className="text-[#F26522]" />
              </span>
            </button>
            <PartnerBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
