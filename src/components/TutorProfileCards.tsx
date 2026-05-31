import { GraduationCap } from "lucide-react";
import { useState } from "react";

export type TutorForProfileCard = {
  readonly name: string;
  readonly expertise: string;
  readonly bio: string;
  readonly atar: string;
  readonly image: string;
};

function firstSentence(bio: string): string {
  const dot = bio.indexOf(". ");
  return dot !== -1 ? bio.slice(0, dot + 1) : bio.split("\n")[0];
}

function firstParagraph(bio: string): string {
  return bio.split("\n\n")[0];
}

function GreenBadge() {
  return (
    <span
      className="inline-flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full"
      style={{ background: "#8EAF8A" }}
      aria-label="Verified tutor"
    >
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M2.5 6L5 8.5L9.5 3.5"
          stroke="white"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Five blur layers, each starting progressively later.
 * They compound at the bottom — all five active = completely frosted glass.
 * Blur values and white tint both increase toward the bottom to match
 * the "goes to fully frosted" effect.
 */
const FROST_LAYERS = [
  {
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    background: "rgba(255,253,251,0.04)",
    maskImage: "linear-gradient(to bottom, transparent 18%, black 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 18%, black 100%)",
  },
  {
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: "rgba(255,253,251,0.08)",
    maskImage: "linear-gradient(to bottom, transparent 38%, black 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 38%, black 100%)",
  },
  {
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    background: "rgba(255,253,251,0.14)",
    maskImage: "linear-gradient(to bottom, transparent 56%, black 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 56%, black 100%)",
  },
  {
    backdropFilter: "blur(50px)",
    WebkitBackdropFilter: "blur(50px)",
    background: "rgba(255,253,251,0.22)",
    maskImage: "linear-gradient(to bottom, transparent 70%, black 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 70%, black 100%)",
  },
  {
    backdropFilter: "blur(70px)",
    WebkitBackdropFilter: "blur(70px)",
    background: "rgba(255,253,251,0.34)",
    maskImage: "linear-gradient(to bottom, transparent 82%, black 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 82%, black 100%)",
  },
] as const;

export function FrostTutorCard({ tutor }: { tutor: TutorForProfileCard }) {
  const [expanded, setExpanded] = useState(false);
  const atarDisplay = tutor.atar.split("·")[0].trim();

  return (
    <article
      className="group relative w-full overflow-hidden rounded-[24px] cursor-pointer select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.97]"
      style={{
        aspectRatio: "3 / 4",
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
      }}
      onClick={() => setExpanded((e) => !e)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setExpanded((p) => !p);
      }}
    >
      {/* Full-bleed image — covers the entire card */}
      <img
        src={tutor.image}
        alt={`${tutor.name} portrait`}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* Progressive frost layers — compound at the bottom */}
      {FROST_LAYERS.map((style, i) => (
        <div key={i} className="pointer-events-none absolute inset-0" style={style} />
      ))}

      {/* White text sits on top of the frosted bottom */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-semibold leading-tight text-white drop-shadow-sm">
            {tutor.name}
          </span>
          <GreenBadge />
        </div>

        <p
          className={`mt-2 text-[13px] leading-relaxed text-white/85 ${
            expanded ? "max-h-[110px] overflow-y-auto" : "line-clamp-3"
          }`}
        >
          {expanded ? firstParagraph(tutor.bio) : firstSentence(tutor.bio)}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] text-white/55">
            <GraduationCap size={11} className="shrink-0" />
            {atarDisplay}
          </span>
          <span className="text-[11px] font-medium text-white/70">
            {expanded ? "Close ↑" : "Read bio →"}
          </span>
        </div>
      </div>
    </article>
  );
}

