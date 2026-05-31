import { Asterisk, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { SubjectCoverItem } from "../data/subjects";

function padIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

function CoverDetail({ item, compact = false }: { item: SubjectCoverItem; compact?: boolean }) {
  return (
    <div>
      {!compact && (
        <div
          className="rounded-2xl"
          style={{ height: "106px", width: "100%", background: item.gradient }}
          aria-hidden="true"
        />
      )}
      <div className={compact ? "" : "pt-5"}>
        {!compact && (
          <h3 className="font-sans text-2xl font-medium text-[#1A1615]">{item.title}</h3>
        )}
        <div className="mt-2 h-px w-8 bg-[#8EAF8A]" />
        <p className="mt-3 text-base leading-relaxed text-[#555551]">{item.description}</p>
        {item.topics && item.topics.length > 0 && (
          <ul className="mt-3 space-y-1">
            {item.topics.map((topic) => (
              <li key={topic} className="flex items-center gap-2 text-sm text-[#555551]">
                <Asterisk size={16} className="shrink-0 text-[#F0744A]" />
                {topic}
              </li>
            ))}
          </ul>
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
  items,
  openIdx,
  onToggle,
}: {
  items: SubjectCoverItem[];
  openIdx: number | null;
  onToggle: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1 pt-2">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => onToggle(i)}
            aria-expanded={openIdx === i}
            className={`flex w-full items-baseline gap-1.5 rounded-2xl px-5 py-3 text-left transition-all duration-200 ${
              openIdx === i ? "bg-[#E4E4E2]/70 text-[#1A1615]" : "bg-transparent text-[#1A1615]"
            }`}
          >
            <span
              className={`insight-heading transition-all duration-200 ${
                openIdx === i ? "text-2xl font-medium" : "text-xl font-normal"
              }`}
            >
              {item.title}
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
            <div className="service-panel-animate px-5 pb-5 pt-2">
              <CoverDetail item={item} compact />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface Props {
  items: SubjectCoverItem[];
}

export default function SubjectCoverSelector({ items }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <div className="hidden min-[480px]:flex gap-4 sm:gap-8 md:gap-14 lg:gap-20 xl:gap-28">
        <div className="flex flex-col gap-1 pt-2 flex-1 min-w-[250px]">
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex w-full items-start gap-1.5 rounded-2xl px-5 py-3 text-left transition-all duration-200 ${
                activeIdx === i ? "bg-[#E4E4E2]/70 text-[#1A1615]" : "bg-transparent text-[#1A1615]"
              }`}
            >
              <span
                className={`insight-heading transition-all duration-200 ${
                  activeIdx === i ? "text-2xl font-medium" : "text-xl font-normal"
                }`}
              >
                {item.title}
              </span>
              <span
                className={`text-[9px] font-medium tracking-widest shrink-0 transition-colors duration-200 ${
                  activeIdx === i ? "text-[#1A1615]" : "text-[#C8C3BE]"
                }`}
              >
                {padIndex(i)}
              </span>
            </button>
          ))}
        </div>
        <div className="w-[40%] min-w-[250px] max-w-[400px] shrink-0">
          <div key={activeIdx} className="service-panel-animate">
            <CoverDetail item={items[activeIdx]} />
          </div>
        </div>
      </div>
      <div className="min-[480px]:hidden">
        <MobileAccordion
          items={items}
          openIdx={openIdx}
          onToggle={(i) => setOpenIdx((p) => (p === i ? null : i))}
        />
      </div>
    </>
  );
}
