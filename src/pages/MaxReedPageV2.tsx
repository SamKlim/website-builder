import type { LucideIcon } from "lucide-react";
import {
  Aperture,
  ArrowUpRight,
  Box,
  Brush,
  Camera,
  Chrome,
  Figma,
  Framer,
  Layers,
  Palette,
  PenTool,
  Sparkle,
  Type,
  Wand2,
} from "lucide-react";

const ICON_PROPS = { strokeWidth: 1.5 } as const;

const TIMELINE = [
  { years: "2023-Now", role: "Freelance Creative", company: "Solo Studio" },
  { years: "2020-2023", role: "Head of Brand Design", company: "Rove Studio" },
  { years: "2017-2020", role: "Visual Stylist", company: "Ember Works" },
];

const ROW_ONE_ICONS: LucideIcon[] = [
  Figma,
  Framer,
  Palette,
  PenTool,
  Layers,
  Type,
  Aperture,
  Chrome,
];

const ROW_TWO_ICONS: LucideIcon[] = [
  Camera,
  Brush,
  Box,
  Wand2,
  Figma,
  Framer,
  Type,
  Layers,
];

const BG_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_150203_44a5bd32-516a-47ce-a077-8acbf9aa8991.mp4";

const STAT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_154543_d5b83fc1-9cea-44f3-b5e8-8f325935211a.mp4";

const SOFTWARE_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_153148_d7a3e1dd-e5d0-4ce6-8306-00d7522ecc44.mp4";

function SectionLabel({
  label,
  align = "center",
  onVideo = false,
}: {
  label: string;
  align?: "center" | "start";
  onVideo?: boolean;
}) {
  const justify = align === "start" ? "justify-start" : "justify-center";
  const colour = onVideo ? "text-white/70" : "text-black/50";

  return (
    <div className={`flex items-center gap-2 ${justify}`}>
      <Sparkle className={`h-3 w-3 ${colour}`} {...ICON_PROPS} />
      <span className={`uppercase tracking-[0.22em] text-[11px] ${colour}`}>
        {label}
      </span>
      <Sparkle className={`h-3 w-3 ${colour}`} {...ICON_PROPS} />
    </div>
  );
}

function IconMarqueeRow({
  icons,
  direction,
}: {
  icons: LucideIcon[];
  direction: "left" | "right";
}) {
  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  const items = [...icons, ...icons];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={`flex w-max ${animationClass}`}>
        {items.map((Icon, index) => (
          <div
            key={index}
            className="liquid-glass h-14 w-14 md:h-16 md:w-16 rounded-xl flex items-center justify-center mx-2 shrink-0"
          >
            <Icon className="h-5 w-5 text-white" {...ICON_PROPS} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MaxReedPageV2() {
  return (
    <section
      className="min-h-screen lg:h-screen bg-[#f5f5f5] text-[#0a0a0a] antialiased px-4 sm:px-6 md:px-10 lg:px-14 py-6 sm:py-8 md:py-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6 md:mb-8">
        <div className="max-w-3xl">
          <h1 className="text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.15] font-normal tracking-tight">
            Hi, I&apos;m Max Reed!
          </h1>
          <p className="mt-4 text-sm md:text-[15px] leading-[1.6] text-black/50 max-w-3xl">
            A London-based independent creator shaping sharp visual systems,
            web-ready products, and story-first campaigns. With a decade of
            craft behind me, I help ideas move with focus and intention.
          </p>
        </div>
        <button
          type="button"
          className="liquid-glass-light rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm shrink-0 self-start ring-1 ring-black/20"
        >
          Let&apos;s Team Up Today
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <div className="relative rounded-2xl bg-white overflow-hidden min-h-[420px] flex flex-col justify-between p-5 md:p-6">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={BG_VIDEO}
          />
          <div className="absolute inset-0 bg-white/30" />
          <div className="relative z-10">
            <SectionLabel label="Background" onVideo />
          </div>
          <div className="relative z-10 space-y-3">
            {TIMELINE.map((entry) => (
              <div
                key={entry.years}
                className="grid grid-cols-[auto_auto_1fr_auto] gap-x-3 gap-y-1 items-center text-[13px] text-white/85"
              >
                <span className="text-white/60">{entry.years}</span>
                <Sparkle className="h-3 w-3 text-white/60" {...ICON_PROPS} />
                <span>
                  {entry.role} · {entry.company}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-rows-[auto_1fr] gap-4 md:gap-5">
          <div className="relative rounded-2xl bg-[#c8dcdc] p-5 md:p-6 noise-overlay min-h-[180px] flex flex-col gap-4">
            <SectionLabel label="Client Voice" align="start" />
            <p className="text-[13px] sm:text-[13.5px] leading-[1.6] text-black/75">
              Max reshaped our image with a degree of finesse and vision that
              surpassed what we&apos;d hoped for. The process felt graceful, and
              the outcomes speak for themselves.
            </p>
            <p className="text-[13px] text-black/75">
              <strong>Elena Brooks</strong>, Creative Director — Halcyon
            </p>
          </div>

          <div className="relative rounded-2xl bg-white overflow-hidden min-h-[280px] flex flex-col items-center justify-center p-5">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              src={STAT_VIDEO}
            />
            <div className="absolute inset-0 bg-white/30" />
            <p className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-light tracking-tight drop-shadow text-center text-white">
              10M+
            </p>
            <p className="relative z-10 mt-2 text-white/85 text-sm text-center">
              Raised for startups
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:gap-5">
          <div className="relative rounded-2xl bg-white overflow-hidden min-h-[320px] flex flex-col justify-between p-5 md:p-6">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              src={SOFTWARE_VIDEO}
            />
            <div className="absolute inset-0 bg-white/30" />
            <div className="relative z-10">
              <SectionLabel label="Daily Software" onVideo />
            </div>
            <div className="relative z-10 space-y-3 mt-auto pt-8">
              <IconMarqueeRow icons={ROW_ONE_ICONS} direction="left" />
              <IconMarqueeRow icons={ROW_TWO_ICONS} direction="right" />
            </div>
          </div>

          <div className="relative rounded-2xl bg-[#c8dcdc] p-5 md:p-6 noise-overlay min-h-[160px]">
            <div className="flex items-start justify-between">
              <SectionLabel label="Reach Me" align="start" />
              <button
                type="button"
                className="h-9 w-9 rounded-full liquid-glass-light flex items-center justify-center"
                aria-label="Contact"
              >
                <ArrowUpRight className="h-4 w-4 text-[#0a0a0a]" {...ICON_PROPS} />
              </button>
            </div>
            <div className="mt-6 space-y-1 text-sm text-black/75">
              <p>hi@maxreed.com</p>
              <p>+44 207 81 63</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
