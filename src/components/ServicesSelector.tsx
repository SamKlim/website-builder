import { Asterisk, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type SubjectGroup = {
  readonly label: string;
  readonly subjects: readonly string[];
};

type ServiceItem = {
  readonly title: string;
  readonly description: string;
  readonly gradient: string;
  readonly subjectGroups?: readonly SubjectGroup[];
};

const SERVICES: readonly ServiceItem[] = [
  {
    title: "Our Subjects",
    description:
      "We specialise in VCE Mathematics and VCE English, while also supporting students across Years 1–10 to build strong foundations.",
    gradient:
      "radial-gradient(ellipse at 18% 38%, rgba(215,108,82,0.90) 0%, transparent 48%), radial-gradient(ellipse at 76% 60%, rgba(72,162,152,0.85) 0%, transparent 48%), radial-gradient(ellipse at 52% 14%, rgba(238,188,148,0.68) 0%, transparent 44%), radial-gradient(ellipse at 22% 80%, rgba(105,185,172,0.52) 0%, transparent 42%), #F2E8E2",
    subjectGroups: [
      {
        label: "VCE Mathematics",
        subjects: [
          "General Mathematics",
          "Mathematical Methods",
        ],
      },
      {
        label: "VCE English",
        subjects: [
          "English",
          "English Language",
          "English Literature",
        ],
      },
      {
        label: "Years 1–10",
        subjects: ["Mathematics", "English"],
      },
    ],
  },
  {
    title: "Where We Are",
    description:
      "Online and in the inner north of Melbourne: Alphington, Ivanhoe, Northcote, Fairfield, Richmond, Collingwood, Carlton, Thornbury.",
    gradient:
      "radial-gradient(ellipse at 24% 58%, rgba(108,158,102,0.92) 0%, transparent 48%), radial-gradient(ellipse at 74% 26%, rgba(215,138,82,0.85) 0%, transparent 48%), radial-gradient(ellipse at 62% 80%, rgba(145,195,135,0.65) 0%, transparent 44%), radial-gradient(ellipse at 14% 16%, rgba(242,185,118,0.52) 0%, transparent 42%), #E2EEDC",
  },
  {
    title: "Our Prices",
    description: "Sessions priced between $75 – $95.",
    gradient:
      "radial-gradient(ellipse at 22% 44%, rgba(218,168,82,0.92) 0%, transparent 48%), radial-gradient(ellipse at 72% 56%, rgba(145,112,202,0.82) 0%, transparent 48%), radial-gradient(ellipse at 56% 12%, rgba(245,218,128,0.68) 0%, transparent 44%), radial-gradient(ellipse at 16% 80%, rgba(172,145,222,0.52) 0%, transparent 42%), #F0E8D2",
  },
  {
    title: "Our Difference",
    description:
      "Mostly women, all passionate about STEM. For female students, that means a real role model in the room. For every student, it means a tutor who is genuinely invested in them as a person, not just a subject.",
    gradient:
      "radial-gradient(ellipse at 28% 28%, rgba(218,92,138,0.90) 0%, transparent 48%), radial-gradient(ellipse at 72% 68%, rgba(108,175,135,0.85) 0%, transparent 48%), radial-gradient(ellipse at 66% 14%, rgba(245,162,185,0.68) 0%, transparent 44%), radial-gradient(ellipse at 14% 76%, rgba(142,205,162,0.52) 0%, transparent 42%), #F5E5EE",
  },
  {
    title: "Our Experience",
    description:
      "300+ students tutored over 8 years combined. All our tutors are in the top 2% of Australia (98+ ATAR).",
    gradient:
      "radial-gradient(ellipse at 35% 52%, rgba(82,145,92,0.92) 0%, transparent 48%), radial-gradient(ellipse at 74% 30%, rgba(218,132,102,0.85) 0%, transparent 48%), radial-gradient(ellipse at 18% 20%, rgba(128,188,128,0.68) 0%, transparent 44%), radial-gradient(ellipse at 70% 78%, rgba(242,172,142,0.55) 0%, transparent 42%), #D8ECD2",
  },
  {
    title: "In Person & Online",
    description:
      "We believe in-person works best, but know it can be hard every week — which is why we offer a mix of the two, or completely remote.",
    gradient:
      "radial-gradient(ellipse at 52% 30%, rgba(152,118,215,0.92) 0%, transparent 48%), radial-gradient(ellipse at 20% 68%, rgba(222,165,88,0.85) 0%, transparent 48%), radial-gradient(ellipse at 78% 66%, rgba(192,152,235,0.68) 0%, transparent 44%), radial-gradient(ellipse at 65% 10%, rgba(245,198,122,0.55) 0%, transparent 42%), #E8E0F5",
  },
] as const;

function padIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

function ServiceDetailContent({ service, compact = false }: { service: ServiceItem; compact?: boolean }) {
  return (
    <div>
      {!compact && (
        <div
          className="rounded-2xl"
          style={{ height: "106px", width: "100%", background: service.gradient }}
          aria-hidden="true"
        />
      )}
      <div className={compact ? "" : "pt-5"}>
        {!compact && (
          <h3 className="font-sans text-2xl font-medium text-[#1A1615]">
            {service.title}
          </h3>
        )}
        <div className="mt-2 h-px w-8 bg-[#8EAF8A]" />
        <p className="mt-3 text-base leading-relaxed text-[#555551]">
          {service.description}
        </p>
        {service.subjectGroups && (
          <div className="mt-3 space-y-3">
            {service.subjectGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#8EAF8A]">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.subjects.map((subject) => (
                    <li key={subject} className="flex items-center gap-2 text-sm text-[#555551]">
                      <Asterisk size={16} className="shrink-0 text-[#F0744A]" />
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <a
          href="#contact"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#F0744A] transition-opacity hover:opacity-60"
        >
          Book a free class →
        </a>
      </div>
    </div>
  );
}

function MobileAccordion({
  openIdx,
  onToggle,
}: {
  openIdx: number | null;
  onToggle: (idx: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1 pt-2">
      {SERVICES.map((service, i) => (
        <div key={service.title}>
          <button
            type="button"
            onClick={() => onToggle(i)}
            aria-expanded={openIdx === i}
            aria-controls={`service-panel-mobile-${i}`}
            className={[
              "flex w-full items-baseline gap-1.5 rounded-2xl px-5 py-3 text-left transition-all duration-200",
              openIdx === i
                ? "bg-[#E4E4E2]/70 text-[#1A1615]"
                : "bg-transparent text-[#1A1615]",
            ].join(" ")}
          >
            <span
              className={[
                "insight-heading transition-all duration-200",
                openIdx === i ? "text-2xl font-medium" : "text-xl font-normal",
              ].join(" ")}
            >
              {service.title}
            </span>
            <span className="shrink-0 self-center">
              {openIdx === i ? (
                <ChevronUp size={14} className="text-[#1A1615]" />
              ) : (
                <ChevronDown size={14} className="text-[#B5B0AA]" />
              )}
            </span>
          </button>
          {openIdx === i && (
            <div id={`service-panel-mobile-${i}`} className="service-panel-animate px-5 pb-5 pt-2">
              <ServiceDetailContent service={service} compact />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ServicesSelector() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      {/* Desktop: split panel */}
      <div className="hidden min-[480px]:flex gap-4 sm:gap-8 md:gap-14 lg:gap-20 xl:gap-28">
        <div className="flex flex-col gap-1 pt-2 flex-1 min-w-[250px]">
          {SERVICES.map((service, i) => (
            <button
              key={service.title}
              type="button"
              onMouseEnter={() => setActiveIdx(i)}
              className={[
                /* DO NOT CHANGE — button layout locked: flex items-start gap-1.5, approved by Sam */
                "flex w-full items-start gap-1.5 rounded-2xl px-5 py-3 text-left transition-all duration-200",
                activeIdx === i
                  ? "bg-[#E4E4E2]/70 text-[#1A1615]"
                  : "bg-transparent text-[#1A1615]",
              ].join(" ")}
            >
              <span
                className={[
                  "insight-heading transition-all duration-200",
                  activeIdx === i ? "text-2xl font-medium" : "text-xl font-normal",
                ].join(" ")}
              >
                {service.title}
              </span>
              <span
                className={[
                  "text-[9px] font-medium tracking-widest shrink-0 transition-colors duration-200",
                  activeIdx === i ? "text-[#1A1615]" : "text-[#C8C3BE]",
                ].join(" ")}
              >
                {padIndex(i)}
              </span>
            </button>
          ))}
        </div>

        <div className="w-[40%] min-w-[250px] max-w-[400px] shrink-0">
          <div key={activeIdx} className="service-panel-animate">
            <ServiceDetailContent service={SERVICES[activeIdx]} />
          </div>
        </div>
      </div>

      {/* Mobile: accordion */}
      <div className="min-[480px]:hidden">
        <MobileAccordion openIdx={openIdx} onToggle={toggleAccordion} />
      </div>
    </>
  );
}
