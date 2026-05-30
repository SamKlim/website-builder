import { ArrowRight } from "lucide-react";

const VIDEO_NARRATIV =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4";
const VIDEO_LUMINAR =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4";

function LinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function SectionBadge() {
  return (
    <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
      <span
        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold shrink-0"
        style={{ fontSize: "11px", lineHeight: "12px" }}
      >
        2
      </span>
      <span className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
        Featured client work
      </span>
    </div>
  );
}

function NarrativCard() {
  return (
    <div>
      <div className="relative aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] group cursor-pointer">
        <video
          src={VIDEO_NARRATIV}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Hover expand button */}
        <div className="absolute bottom-4 left-4 flex items-center overflow-hidden h-9 bg-white rounded-full transition-all duration-300 ease-in-out w-9 group-hover:w-[148px]">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-[13px] font-medium text-[#1A1615] whitespace-nowrap pl-4 pr-1">
            Learn more
          </span>
          <span className="shrink-0 w-9 h-9 flex items-center justify-center ml-auto">
            <LinkIcon className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 text-[#1A1615]" />
          </span>
        </div>
      </div>
      <p className="text-[13px] sm:text-[14px] text-[#453F3D] mt-4 leading-relaxed">
        Winner of Site of the Month 2025 - an interactive 3D showcase driving record engagement
      </p>
      <p className="text-[14px] sm:text-[15px] font-semibold text-[#1A1615] mt-1">Narrativ</p>
    </div>
  );
}

function LuminarCard() {
  return (
    <div>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] group cursor-pointer">
        <video
          src={VIDEO_LUMINAR}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Hover expand button */}
        <div className="absolute bottom-4 left-4 flex items-center overflow-hidden h-9 bg-gray-900 rounded-full transition-all duration-300 ease-in-out w-9 group-hover:w-[168px]">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-[13px] font-medium text-white whitespace-nowrap pl-4 pr-1">
            View case study
          </span>
          <span className="shrink-0 w-9 h-9 flex items-center justify-center ml-auto">
            <ArrowRight
              size={14}
              className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 text-white"
            />
          </span>
        </div>
      </div>
      <p className="text-[13px] sm:text-[14px] text-[#453F3D] mt-4 leading-relaxed">
        Transforming a dated platform into a conversion-focused brand experience
      </p>
      <p className="text-[14px] sm:text-[15px] font-semibold text-[#1A1615] mt-1">Luminar</p>
    </div>
  );
}

export function CaseStudiesSection() {
  return (
    <section className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto">
        <SectionBadge />

        <h2
          className="font-medium leading-[1.08] tracking-[-0.03em] text-[#1A1615] mb-10 sm:mb-14 lg:mb-16 px-5 sm:px-8 lg:px-12"
          style={{ fontSize: "clamp(1.75rem, 7vw, 4.2rem)" }}
        >
          <span className="sm:hidden">Our projects</span>
          <span className="hidden sm:block" style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}>
            Our projects
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
          <NarrativCard />
          <LuminarCard />
        </div>
      </div>
    </section>
  );
}
