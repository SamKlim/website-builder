import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import type { Tutor } from "../data/tutors";

function formatBio(bio: string): string {
  return bio.replace(/\s*—\s*/g, ", ").replace(/—/g, ", ").replace(/\n\n/g, " ");
}

export default function TutorCard({
  tutor,
  index,
  defaultExpanded = false,
}: {
  tutor: Tutor;
  index: number;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => setExpanded((e) => !e);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") toggle();
      }}
      className="insight-tutor-card flex flex-col rounded-2xl bg-white border border-[#DCDCDA] p-3 select-none"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start gap-4">
        <img
          src={tutor.image}
          alt={`${tutor.name} portrait`}
          className="h-36 w-36 shrink-0 rounded-xl object-cover object-top"
        />
        <div className="flex flex-col justify-center pt-1">
          <h3 className="text-xl font-medium text-[#1A1615]">{tutor.name}</h3>
          <ul className="mt-2 space-y-1.5">
            {tutor.expertise.split(", ").map((subject) => (
              <li key={subject} className="flex items-center gap-[3px] text-sm font-normal leading-[1.3] text-[#555551]">
                <span className="text-[24px] leading-[0.7] text-[#555551]">·</span>
                {subject}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 flex flex-col rounded-xl p-2">
        <p className="font-sans text-lg font-semibold text-[#1A1615]">Bio</p>
        <p className={`mt-2 text-sm font-normal leading-relaxed text-[#555551] ${expanded ? "" : "line-clamp-6"}`}>
          {formatBio(tutor.bio)}
        </p>
        <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#F0744A]">
          {expanded ? "Close" : `Learn more about ${tutor.name}`}
          {expanded ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </span>
      </div>
    </div>
  );
}
