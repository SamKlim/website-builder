import { useState } from "react";
import type { Tutor, TutorCategory } from "../data/tutors";
import TutorCard from "./TutorCard";

interface Props {
  tutors: Tutor[];
  defaultCategory?: TutorCategory;
  showToggle?: boolean;
}

export default function TutorGrid({ tutors, defaultCategory = "math", showToggle = true }: Props) {
  const [activeCategory, setActiveCategory] = useState<TutorCategory>(defaultCategory);

  const category = showToggle ? activeCategory : defaultCategory;
  const filtered = tutors.filter((t) => t.category === category);

  return (
    <>
      {showToggle && (
        <div className="mt-8 flex justify-center">
          <div
            className="liquid-glass-light relative flex items-center rounded-full p-1 ring-2 ring-black/35"
            style={{ background: "rgba(255,255,255,0.70)", boxShadow: "none" }}
          >
            <div className="pointer-events-none absolute inset-y-1 left-1 right-1">
              <div
                className="h-full w-1/2 rounded-full bg-[#8EAF8A] shadow-sm transition-transform duration-300 ease-out"
                style={{ transform: activeCategory === "english" ? "translateX(100%)" : "translateX(0)" }}
              />
            </div>
            {(["math", "english"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`relative z-10 rounded-full px-8 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeCategory === cat ? "text-white" : "text-[#888884] hover:text-[#555551]"
                }`}
              >
                {cat === "math" ? "Math" : "English"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 ${showToggle ? "mt-10" : "mt-8"}`}>
        {filtered.map((tutor, i) => (
          <TutorCard key={tutor.name} tutor={tutor} index={i} />
        ))}
      </div>
    </>
  );
}
