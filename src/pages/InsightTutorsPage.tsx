import { ArrowDown, ArrowUp, ChevronDown, Menu, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ServicesSelector } from "../components/ServicesSelector";

type TutorCategory = "math" | "english";

type Tutor = {
  name: string;
  expertise: string;
  bio: string;
  atar: string;
  scores: string;
  image: string;
  category: TutorCategory;
};


type Review = {
  quote: string;
  author: string;
};

const TUTORS: Tutor[] = [
  {
    name: "Samantha",
    expertise: "VCE Math Methods, VCE General Maths, Year 1–10 Maths",
    bio: "Hi, I'm Sam — a qualified Software Engineer with a strong passion for education and mentoring. Outside of my engineering work, I dedicate my time to private tutoring, where I support students not only in improving their academic performance, but also in building confidence and motivation. I take a holistic approach to tutoring: for me, it's not just about solving problems on a page — it's about helping students understand why things work, develop a genuine interest in the subject, and feel capable in their abilities.\n\nI create engaging lessons filled with analogies and real-world examples, making concepts easier to understand and apply. Each lesson is tailored to the student's individual needs, and I strongly believe in fostering a growth mindset — letting go of the idea of being 'bad at math' and instead focusing on small wins that build confidence over time.",
    atar: "99.05 · DUX of the year level",
    scores: "General Maths: 46 · Methods: 44 · Specialist Maths: 49",
    image: "/tutors/samantha.png",
    category: "math",
  },
  {
    name: "Georgia",
    expertise: "VCE Math Methods, Year 1–10 Maths",
    bio: "Hi, I'm Georgia. I have over two years of tutoring experience in all of the below listed subjects. I am currently studying a Bachelor of Commerce at Melbourne University, followed by a Masters of Engineering.\n\nMy strong interpersonal skills allow me to best meet an individual student's needs by tailoring explanations to suit their natural way of thinking. In doing this, I am able to break down complex concepts in a way that makes sense to the individual. I believe everyone responds best to different teaching styles and I aim to cater for this in tutoring sessions.",
    atar: "99.25",
    scores: "Methods: 40",
    image: "/tutors/georgia.png",
    category: "math",
  },
  {
    name: "Sophie",
    expertise: "VCE Math Methods, Year 1–10 Maths",
    bio: "Hi, I'm Sophie! I'm a medical student with a strong passion for tutoring and mentoring students. I tutor Maths for Years 7 to 12, including all three senior subjects (General, Methods, and Specialist Maths). I hold a First Class Honours degree in Science, with a major in Biomedical Science and a minor in Mathematics.\n\nI like to understand each student's current learning strategies so I can build on their strengths and effectively address any weaknesses. My goal is not only to help students build confidence and achieve academic success, but also to be a supportive role model along the way.",
    atar: "98.35",
    scores: "Specialist Maths: 46 · Methods: 47",
    image: "/tutors/sophie.png",
    category: "math",
  },
  {
    name: "Stephanie",
    expertise: "VCE English, VCE English Literature, VCE Biology, Year 7–10 English",
    bio: "Hi, I'm Stephanie — a passionate and experienced tutor specialising in English, English Literature, and Biology. I now help students build the skills and confidence they need to succeed, particularly in written expression.\n\nMy tutoring style is positive, flexible, and tailored to each student. In English, I focus on breaking down complex texts, strengthening sentence structure, and helping students write clear, compelling essays. I work closely with students to develop their own voice, sharpen their arguments, and understand how to meet assessment criteria without losing creativity.",
    atar: "98.05",
    scores: "English: 48 · English Literature: 46 · Biology: 43",
    image: "/tutors/stephanie.png",
    category: "english",
  },
  {
    name: "Alyssa",
    expertise: "VCE Math Methods, Year 1–10 Maths",
    bio: "Hi, I'm Alyssa — a passionate tutor with a genuine love for helping students grow in confidence and ability. I believe that with the right explanation and a supportive environment, every student can develop a strong grasp of the subject.\n\nI tailor each session to the individual, focusing on the areas where they need the most support while building on their existing strengths. My aim is always for students to leave each lesson feeling more capable and prepared than when they arrived.",
    atar: "99.6",
    scores: "Specialist Maths: 51 · Methods: 44",
    image: "/tutors/alyssa.png",
    category: "math",
  },
  {
    name: "Alex",
    expertise: "VCE Math Methods, VCE Specialist Maths, Year 1–10 Maths",
    bio: "Hi there, I'm Alex, a third-year student at Monash University studying a Bachelor of Mechatronics Engineering and a Bachelor of Commerce. I have been a tutor for 3 years since graduating back in 2022, teaching a wide variety of students, including some with learning difficulties.\n\nAs a tutor, I seek to not only improve my students' academic performance, but also their engagement with the content they learn. Learning is an active process, and that concept shapes the way I tutor. With enough support, I believe that any student can thrive beyond expectations, gaining confidence not only in math, but across school and life in general.",
    atar: "96.8",
    scores: "Methods: 47.5 · Specialist: 46.4",
    image: "/tutors/alex.png",
    category: "math",
  },
  {
    name: "Michaela",
    expertise: "VCE English, VCE English Literature, Year 7–10 English",
    bio: "Hi, I'm Michaela — a passionate English tutor who loves helping students find their voice on the page. Whether it's unpacking a complex text, crafting a persuasive argument, or polishing an essay, I tailor every session to what each student actually needs.\n\nI believe strong writing starts with strong thinking. My focus is on helping students understand how language works and why it matters — so they can approach any task with confidence, not just follow a formula.",
    atar: "TBC",
    scores: "English: TBC · English Literature: TBC",
    image: "/tutors/michaela.png",
    category: "english",
  },
  {
    name: "Zara",
    expertise: "VCE General Maths, Year 1–10 Maths",
    bio: "Hi, I'm Zara. I'm studying a Bachelor of Commerce at Monash University, and graduated with an ATAR of 94.50 and achieved a 49 study score in General Maths. I find it incredibly rewarding to help others understand maths — whether that's classmates at university or students I tutor.\n\nMy tutoring style is flexible and tailored to each student's needs. I meet students at whatever level they are at when they start with me. That might mean covering content from the very beginning, addressing specific gaps, working through exercise questions and practice tests, or reviewing past assessments. I also share test-taking tips and strategies to help students perform their best on every maths test. I work together with students to gain confidence as well as knowledge; success is not just about how to get better at maths, it's also about building confidence in yourself and your skills to apply yourself to every situation.",
    atar: "94.50",
    scores: "General Maths: 49",
    image: "/tutors/zara.png",
    category: "math",
  },
];


const REVIEWS: Review[] = [
  {
    quote:
      "I've been doing tutoring with Sam for almost two years now, and she has never failed to help me understand my math homework. She makes our lessons fun, and it feels like I'm doing maths with a friend!",
    author: "Tessa",
  },
  {
    quote:
      "Having a female tutor who's also an engineer made me feel like engineering could actually be for me. Rather than just memorising steps, my tutor helped me genuinely understand the material — and suddenly STEM felt like a real path I could take.",
    author: "Jane",
  },
  {
    quote:
      "I used to panic during tests because I always felt underprepared, but tutoring helped me build better study habits — we ditched the textbook questions and worked on VCE exam questions and practice tests.",
    author: "Michael",
  },
  {
    quote:
      "I liked how my tutor didn't just give me the answer, she helped me understand the 'why' behind each step. I went from memorising steps to actually knowing how to apply them.",
    author: "Sophie",
  },
  {
    quote:
      "My Methods mark jumped from a C+ to an A in one term. Sam knew exactly where I was going wrong and fixed it without making me feel bad about not getting it sooner.",
    author: "Liam",
  },
  {
    quote:
      "Michaela is incredibly patient. She never rushes through a concept and always checks I actually understand before moving on. I finally feel confident going into exams.",
    author: "Priya",
  },
  {
    quote:
      "What I appreciated most was that my tutor remembered everything about my weak spots from session to session. It felt personalised in a way school never does.",
    author: "Chloe",
  },
  {
    quote:
      "Honestly thought I'd have to drop down to General but Sam talked me through staying in Methods and actually helped me pass. Can't thank her enough.",
    author: "James",
  },
  {
    quote:
      "My daughter went from dreading maths to genuinely looking forward to her sessions. The improvement in her confidence has been remarkable.",
    author: "Helen (parent)",
  },
];

const REVIEWS_MARQUEE = [...REVIEWS, ...REVIEWS];
const TUTOR_MARQUEE = [...TUTORS, ...TUTORS];

const DIFFERENCE_POINTS_1 = [
  "In every lesson, students work through VCAA exam-style questions throughout the entire year.",
  "This helps them learn how to connect multiple concepts rather than practising topics in isolation.",
];

const DIFFERENCE_POINTS_2 = [
  "Exam Vault is our own proprietary platform which contains 26 years of past exam questions organised by topic, subtopic, and varying levels of difficulty.",
  "This allows students to target weak areas while practising questions at the same difficulty as the final exam. With the support of our tutors, our approach ensures students are fully prepared for real exam conditions.",
];

function useScrollReveal(ref: { current: HTMLElement | null }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.15) {
        setVisible(true);
        window.removeEventListener("scroll", check);
        doneTimer = setTimeout(() => setDone(true), 3600);
      }
    };
    const startTimer = setTimeout(() => {
      window.addEventListener("scroll", check, { passive: true });
      check();
    }, 150);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(doneTimer);
      window.removeEventListener("scroll", check);
    };
  }, [ref]);

  return { visible, done };
}

function TutorCard({ tutor, index }: { tutor: Tutor; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={() => setExpanded((e) => !e)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded((prev) => !prev); }}
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
          {tutor.bio.replace(/\n\n/g, " ")}
        </p>
        <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#F0744A]">
          {expanded ? "Close" : `Learn more about ${tutor.name}`}
          {expanded ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </span>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="liquid-glass-pink flex h-[290px] w-[266px] shrink-0 flex-col justify-between rounded-2xl p-4 ring-1 ring-[#F0744A]/15">
      <div>
        <div className="mb-4 flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={22} className="text-[#F0744A]" strokeWidth={1.5} fill="#F0744A" />
          ))}
        </div>
        <p className="text-[15px] leading-relaxed text-[#777]">{review.quote}</p>
      </div>
      <p className="text-[20px] font-semibold text-black">{review.author}</p>
    </article>
  );
}

function ReviewsMarquee() {
  return (
    <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex w-max gap-4 animate-marquee-reviews">
        {REVIEWS_MARQUEE.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </div>
  );
}

const MOBILE_NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Our Tutors", href: "#tutors" },
  { label: "Our Services", href: "#services" },
  { label: "Our Difference", href: "#difference" },
  { label: "Reviews", href: "#reviews" },
];

type TutorPreference = "male" | "female" | "both";
type FormStep = "contact" | "q2" | "done";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const WEEKEND_DAYS = ["Sat", "Sun"] as const;
const WEEKDAY_TIMES = ["4:00–5:00", "5:00–6:00", "6:00–7:00", "7:00–8:00"] as const;
const WEEKEND_TIMES = ["9:00–10:00", "10:00–11:00", "11:00–12:00"] as const;

const TUTOR_PREFERENCE_OPTIONS: { value: TutorPreference; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "both", label: "No preference" },
];

const GRADES = [
  "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6",
  "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12",
] as const;


const REFERRAL_SOURCES = [
  "Google search",
  "Google Maps",
  "Word of mouth",
  "Other",
] as const;

const SUBJECTS_YEARS_1_10 = ["Mathematics", "English"] as const;
const SUBJECTS_YEARS_11_12 = [
  "English",
  "English Literature",
  "English Language",
  "General Mathematics",
  "Mathematical Methods",
  "Specialist Mathematics",
] as const;

function getSubjectsForGrade(grade: string): readonly string[] {
  const yearNum = parseInt(grade.replace("Year ", ""), 10);
  if (yearNum >= 11) return SUBJECTS_YEARS_11_12;
  return SUBJECTS_YEARS_1_10;
}

function slotKey(day: string, time: string) {
  return `${day}-${time}`;
}

function SlotGrid({
  days,
  times,
  selectedSlots,
  onToggle,
}: {
  days: readonly string[];
  times: readonly string[];
  selectedSlots: Set<string>;
  onToggle: (day: string, time: string) => void;
}) {
  return (
    <table className="border-collapse text-xs">
      <thead>
        <tr>
          <th className="w-24 pb-2 text-left font-medium text-[#888884]" />
          {days.map((day) => (
            <th key={day} className="pb-2 px-1 text-center font-medium text-[#888884]">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {times.map((time) => (
          <tr key={time}>
            <td className="py-1 pr-3 text-left whitespace-nowrap text-[#555551]">{time}</td>
            {days.map((day) => {
              const key = slotKey(day, time);
              const active = selectedSlots.has(key);
              return (
                <td key={day} className="py-1 px-1 text-center">
                  <button
                    type="button"
                    onClick={() => onToggle(day, time)}
                    aria-label={`${day} ${time}`}
                    aria-pressed={active}
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-md border text-[11px] transition-colors ${
                      active
                        ? "border-[#8EAF8A] bg-[#8EAF8A] text-white"
                        : "border-[#D4D0CB] bg-white text-transparent hover:border-[#8EAF8A]"
                    }`}
                  >
                    ✓
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const NAV_MARGIN_SCROLLED = "144px";
const NAV_MARGIN_DEFAULT = "44px";
const LG_BREAKPOINT = 1024;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function InsightTutorsPage() {
  const [activeCategory, setActiveCategory] = useState<TutorCategory>("math");
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= LG_BREAKPOINT);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);
  const examVaultRef = useRef<HTMLDivElement>(null);
  const { visible: examVaultVisible, done: examVaultDone } = useScrollReveal(examVaultRef);
  const examVaultRef2 = useRef<HTMLDivElement>(null);
  const { visible: examVaultVisible2, done: examVaultDone2 } = useScrollReveal(examVaultRef2);
  const [tutorPreference, setTutorPreference] = useState<TutorPreference | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [formStep, setFormStep] = useState<FormStep>("contact");
  const [grade, setGrade] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [referralOther, setReferralOther] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step1Error, setStep1Error] = useState("");
  const [submitError, setSubmitError] = useState("");

  const toggleSlot = (day: string, time: string) => {
    const key = slotKey(day, time);
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) { next.delete(subject); } else { next.add(subject); }
      return next;
    });
  };

  const closeMenu = () => setMenuOpen(false);

  const handleContinue = async () => {
    if (!name.trim() || !studentName.trim() || !mobile.trim()) {
      setStep1Error("Please fill in your name, student name, and mobile.");
      return;
    }
    setStep1Error("");
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string,
          subject: "New enquiry — contact details only",
          from_name: name,
          name,
          student_name: studentName,
          mobile,
          email: email || "(not provided)",
        }),
      });
      const data = await res.json() as { success: boolean };
      if (data.success) { setFormStep("q2"); } else { setSubmitError("Something went wrong. Please try again."); }
    } catch { setSubmitError("Something went wrong. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string,
          subject: "Complete enquiry — all details",
          from_name: name,
          name,
          student_name: studentName,
          mobile,
          email: email || "(not provided)",
          grade,
          subjects: selectedSubjects.size > 0 ? Array.from(selectedSubjects).join(", ") : "(none selected)",
          tutor_preference: tutorPreference ?? "No preference",
          availability: selectedSlots.size > 0 ? Array.from(selectedSlots).join(", ") : "(none selected)",
          referral_source: referralSource === "Other" ? `Other: ${referralOther}` : referralSource || "(not provided)",
        }),
      });
      const data = await res.json() as { success: boolean };
      if (data.success) { setFormStep("done"); } else { setSubmitError("Something went wrong. Please try again."); }
    } catch { setSubmitError("Something went wrong. Please try again."); }
    finally { setIsSubmitting(false); }
  };

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

  return (
    <div className="bg-[#F4F4F2] text-[#1A1615]">
      {/* Nav — sticky, pill, liquid glass, 24px outer margin each side */}
      <header className="sticky top-6 z-30 bg-transparent">
        <div
          style={{
            marginLeft: scrolled && isDesktop ? NAV_MARGIN_SCROLLED : NAV_MARGIN_DEFAULT,
            marginRight: scrolled && isDesktop ? NAV_MARGIN_SCROLLED : NAV_MARGIN_DEFAULT,
            transition: "margin-left 700ms cubic-bezier(0.4, 0, 0.2, 1), margin-right 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Nav pill */}
          <div
            className="insight-nav-glass relative flex items-center overflow-hidden transition-all duration-500 ease-out"
            style={{ height: "63px", borderRadius: "100px" }}
          >
            {/* Logo */}
            <div className="flex min-w-0 items-center gap-1 shrink-0 pl-2 min-[400px]:pl-4">
              <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M14 23 L4 17 L4 5 L14 11 Z" fill="#F0744A" />
                <path d="M14 23 L24 17 L24 5 L14 11 Z" fill="#F0744A" fillOpacity="0.55" />
                <line x1="14" y1="23" x2="14" y2="11" stroke="white" strokeOpacity="0.5" strokeWidth="1.4" />
                <circle cx="14" cy="11" r="1.2" fill="white" fillOpacity="0.4" />
              </svg>
              <span className="insight-heading hidden min-[320px]:inline text-[15px] font-semibold tracking-tight whitespace-nowrap">
                Insight Tutors
              </span>
            </div>

            {/* Desktop links — centered */}
            <ul className="hidden flex-1 items-center justify-center gap-4 text-sm font-medium text-[#555551] lg:flex">
              {MOBILE_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-[#1A1615] whitespace-nowrap">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right side */}
            <div className="ml-auto shrink-0 pr-1 min-[400px]:pr-4">
              {/* Desktop: Book a free class */}
              <a
                href="#contact"
                className="liquid-glass-light hidden lg:flex items-center justify-center px-6 text-sm ring-1 ring-black/20 whitespace-nowrap transition-opacity hover:opacity-75 active:scale-[0.98]"
                style={{ height: "47px", borderRadius: "100px" }}
              >
                Book a free class
              </a>

              {/* Mobile: kebab toggle */}
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

          {/* Mobile dropdown panel */}
          {menuOpen && (
            <div className="insight-nav-glass mt-3 rounded-2xl p-6 lg:hidden">
              <ul className="flex flex-col items-center gap-5">
                {MOBILE_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="text-base font-medium text-[#1A1615] transition-colors hover:text-[#5B9BD5]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={closeMenu}
                className="liquid-glass-light mt-6 flex w-full items-center justify-center rounded-full py-3.5 text-sm ring-1 ring-black/20 transition-opacity hover:opacity-75 active:scale-[0.98]"
              >
                Book a free class
              </a>
            </div>
          )}
        </div>
      </header>

      <main className="pt-[87px]">{/* 63px nav + 24px sticky offset */}
        {/* Hero */}
        <section className="w-full pt-12 pb-0">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <p className="mx-auto max-w-lg text-xl leading-relaxed text-[#6B6867]">At Insight Tutors, meet</p>
            <h1 className="insight-heading mt-2 text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              The math tutor who builds your confidence
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-xl leading-relaxed text-[#6B6867]">
              We are female math and english tutors who prioritise in-person teaching when the world goes online.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <a
                href="#contact"
                className="liquid-glass-light rounded-full px-7 py-3.5 text-sm ring-1 ring-black/20 transition-opacity hover:opacity-75 active:scale-[0.98]"
              >
                Book a free class
              </a>
            </div>
          </div>

          {/* Tutor face marquee */}
          <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex w-max animate-marquee-tutors gap-4 pb-16">
              {TUTOR_MARQUEE.map((tutor, i) => (
                <div
                  key={i}
                  className="relative h-60 w-44 shrink-0 overflow-hidden rounded-2xl"
                >
                  <img
                    src={tutor.image}
                    alt={`${tutor.name} portrait`}
                    className="h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
                    <p
                      className="text-[13px] font-semibold text-white"
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.5)" }}
                    >
                      {tutor.name}
                    </p>
                    {tutor.atar !== "TBC" && (
                      <p
                        className="text-[11px] text-white/90"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                      >
                        ATAR {tutor.atar.split("·")[0].trim()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-y border-[#E2DFDB] bg-[#F4F4F2]">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-16 py-16 md:py-20">
            <h2 className="insight-heading text-center text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">Our Story</h2>
            <div className="mx-auto mt-6 max-w-2xl text-center text-xl leading-relaxed text-[#6B6867]">
              <p>
                We're a female-led tutoring company dedicated to helping students excel in maths and english.
                Maths is often called the language of the universe, yet many students grow up believing they
                can't speak it. We believe every student deserves the chance to fully understand maths, to be
                supported by a mentor who believes in them, and a space that reminds them that their mind is
                their greatest asset. We don't just fill gaps in knowledge; we bridge the gap in confidence.
                We cultivate a space where it is safe to be curious, safe to fail, and exhilarating to succeed.
              </p>
            </div>
          </div>
        </section>

        {/* Tutors */}
        <section id="tutors" className="mx-auto w-full max-w-6xl px-5 md:px-16 py-16 md:py-20">
          <h2 className="insight-heading text-center text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">Meet Your Tutors</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-xl leading-relaxed text-[#6B6867]">
            Our tutors are top academic achievers with ATARs of 96+ and subject scores in the top 2%. Scientists, engineers, and specialists — each an expert in what they teach.
          </p>

          {/* Math / English toggle */}
          <div className="mt-8 flex justify-center">
            <div className="liquid-glass-light relative flex items-center rounded-full p-1 ring-2 ring-black/35" style={{ background: "rgba(255,255,255,0.70)", boxShadow: "none" }}>
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

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {TUTORS.filter((t) => t.category === activeCategory).map((tutor, i) => (
              <TutorCard key={tutor.name} tutor={tutor} index={i} />
            ))}
          </div>

        </section>

        {/* Services */}
        <section id="services" className="border-y border-[#E2DFDB] bg-[#F4F4F2]">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 md:py-20">
            <h2 className="insight-heading text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">What We Offer</h2>
            <div className="mt-8">
              <ServicesSelector />
            </div>
          </div>
        </section>

        {/* Our Difference */}
        <section id="difference" className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
          <h2 className="insight-heading text-center text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">Our Difference</h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-xl leading-relaxed text-[#6B6867]">
            For Year 11 and 12 Maths, we teach differently.
          </p>

          {/* Row 1: writing left, landing screenshot right */}
          <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-center md:gap-8">
            <div className="shrink-0 md:w-[35%]">
              <ul className="space-y-4">
                {DIFFERENCE_POINTS_1.map((point, i) => (
                  <li key={i} className="flex gap-2.5">
                    <Star
                      size={16}
                      className="mt-1 shrink-0 text-[#F0744A]"
                      strokeWidth={1.5}
                      fill="#F0744A"
                      aria-hidden="true"
                    />
                    <p className="text-base leading-relaxed text-[#555551]">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div
              ref={examVaultRef}
              className={`min-w-0 flex-1 ${examVaultDone ? "exam-vault-done" : examVaultVisible ? "exam-vault-visible" : "exam-vault-hidden"}`}
            >
              <div className="rounded-xl border border-black/8 shadow-[0_24px_80px_rgba(26,22,21,0.14)]" style={{ isolation: "isolate" }}>
                <div className="flex h-6 shrink-0 items-center gap-1.5 rounded-t-xl bg-[#E4E2DF] px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <img
                  src="/insight-tutors/example-images/exam-vault-landing.png"
                  alt="Exam Vault — organised by topic, subtopic and difficulty level"
                  className="block w-full rounded-b-xl"
                  style={{ transform: "translateZ(0.1px)" }}
                />
              </div>
            </div>
          </div>

          {/* Row 2: questions screenshot left, writing right
              DOM order is text-first so on mobile the text sits between the two images.
              lg:flex-row-reverse flips to image-left / text-right on desktop. */}
          <div className="mt-16 flex flex-col gap-10 md:flex-row-reverse md:items-center md:gap-8">
            <div className="shrink-0 md:w-[35%]">
              <ul className="space-y-4">
                {DIFFERENCE_POINTS_2.map((point, i) => (
                  <li key={i} className="flex gap-2.5">
                    <Star
                      size={16}
                      className="mt-1 shrink-0 text-[#F0744A]"
                      strokeWidth={1.5}
                      fill="#F0744A"
                      aria-hidden="true"
                    />
                    <p className="text-base leading-relaxed text-[#555551]">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div
              ref={examVaultRef2}
              className={`min-w-0 flex-1 ${examVaultDone2 ? "exam-vault-done" : examVaultVisible2 ? "exam-vault-visible" : "exam-vault-hidden"}`}
            >
              <div className="rounded-xl border border-black/8 shadow-[0_24px_80px_rgba(26,22,21,0.14)]" style={{ isolation: "isolate" }}>
                <div className="flex h-6 shrink-0 items-center gap-1.5 rounded-t-xl bg-[#E4E2DF] px-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <img
                  src="/insight-tutors/example-images/exam-vault-questions.png"
                  alt="Exam Vault — past exam questions organised by topic and difficulty"
                  className="block w-full rounded-b-xl"
                  style={{ transform: "translateZ(0.1px)" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mx-auto w-full max-w-6xl px-5 md:px-16 py-16 md:py-20">
          <h2 className="insight-heading text-center text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">What Students Say</h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-xl leading-relaxed text-[#6B6867]">
            Real experiences from students who've grown through one-on-one support.
          </p>
          <div className="mt-10 -mx-5 md:-mx-16">
            <ReviewsMarquee />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-[#E2DFDB] bg-[#F4F4F2]">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-16 md:py-20">

            {/* Step indicator */}
            {formStep === "q2" && (
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#888884]">Step 2 of 2</p>
            )}

            {/* Persistent heading */}
            {formStep !== "done" && (
              <h2 className="insight-heading mb-8 text-center text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">
                Request your free tutoring session
              </h2>
            )}

            {/* Step 1 — Contact */}
            {formStep === "contact" && (
              <form
                className="animate-form-step w-full rounded-2xl border border-[#DCDCDA] bg-white/70 p-6"
                onSubmit={(e) => { e.preventDefault(); void handleContinue(); }}
              >
                <div className="grid gap-4">
                  <label className="text-sm font-medium text-[#1A1615]">
                    Your name*
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                    />
                  </label>
                  <label className="text-sm font-medium text-[#1A1615]">
                    Name of student*
                    <input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                    />
                  </label>
                  <label className="text-sm font-medium text-[#1A1615]">
                    Mobile*
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                    />
                  </label>
                  <label className="text-sm font-medium text-[#1A1615]">
                    Email <span className="font-normal text-[#888884]">(optional)</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                    />
                  </label>
                  {step1Error && <p className="text-sm text-red-500">{step1Error}</p>}
                  {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 rounded-full bg-[#1A1615] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? "Sending…" : "Continue"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 — Questionnaire */}
            {formStep === "q2" && (
              <div className="animate-form-step w-full rounded-2xl border border-[#DCDCDA] bg-white/70 p-6">
                <div className="grid gap-6">
                  <label className="text-sm font-medium text-[#1A1615]">
                    Which year level are you in / is your child in?*
                    <div className="relative mt-2">
                      <select
                        value={grade}
                        onChange={(e) => { setGrade(e.target.value); setSelectedSubjects(new Set()); }}
                        className="w-full appearance-none rounded-xl border border-[#D4D0CB] bg-white py-2.5 pl-3 pr-8 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                      >
                        <option value="">Select year level…</option>
                        {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#888884]" />
                    </div>
                  </label>

                  {grade && (
                    <div>
                      <p className="text-sm font-medium text-[#1A1615]">What subject would you like tutoring in?</p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {getSubjectsForGrade(grade).map((subject) => (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => toggleSubject(subject)}
                            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                              selectedSubjects.has(subject)
                                ? "border-[#8EAF8A] bg-[#8EAF8A] text-white"
                                : "border-[#D4D0CB] bg-white text-[#555551] hover:border-[#8EAF8A]"
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-[#1A1615]">Do you have a tutor gender preference?</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {TUTOR_PREFERENCE_OPTIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setTutorPreference(tutorPreference === value ? null : value)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            tutorPreference === value
                              ? "border-[#8EAF8A] bg-[#8EAF8A] text-white"
                              : "border-[#D4D0CB] bg-white text-[#555551] hover:border-[#8EAF8A]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#1A1615]">
                      What day and time would suit you for a regular weekly lesson?{" "}
                      <span className="font-normal text-[#888884]">(optional)</span>
                    </p>
                    <p className="mt-1 text-xs text-[#888884]">
                      Try to pick at least 3 — don't worry if you don't know yet, we can figure it out together.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-8">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#888884]">Weekdays</p>
                        <div className="overflow-x-auto">
                          <SlotGrid days={WEEKDAYS} times={WEEKDAY_TIMES} selectedSlots={selectedSlots} onToggle={toggleSlot} />
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#888884]">Weekends</p>
                        <div className="overflow-x-auto">
                          <SlotGrid days={WEEKEND_DAYS} times={WEEKEND_TIMES} selectedSlots={selectedSlots} onToggle={toggleSlot} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="text-sm font-medium text-[#1A1615]">
                    Where did you find us?
                    <div className="relative mt-2">
                      <select
                        value={referralSource}
                        onChange={(e) => { setReferralSource(e.target.value); setReferralOther(""); }}
                        className="w-full appearance-none rounded-xl border border-[#D4D0CB] bg-white py-2.5 pl-3 pr-8 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                      >
                        <option value="">Select…</option>
                        {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#888884]" />
                    </div>
                    {referralSource === "Other" && (
                      <input
                        type="text"
                        value={referralOther}
                        onChange={(e) => setReferralOther(e.target.value)}
                        placeholder="Please tell us where you found us"
                        className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                      />
                    )}
                  </label>

                  {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                  <button
                    type="button"
                    disabled={isSubmitting || (referralSource === "Other" && referralOther.trim() === "")}
                    onClick={() => { void handleSubmit(); }}
                    className="mt-2 w-full rounded-full bg-[#1A1615] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? "Sending…" : "Submit"}
                  </button>
                </div>
              </div>
            )}

            {/* Done */}
            {formStep === "done" && (
              <div className="animate-form-step w-full rounded-2xl border border-[#DCDCDA] bg-white/70 px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#8EAF8A]/15 text-[#8EAF8A]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="insight-heading mt-5 text-xl font-medium text-[#1A1615]">We'll be in touch soon</h3>
                <p className="mt-2 text-sm text-[#888884]">Thanks for reaching out. Expect a reply within 24 hours.</p>
              </div>
            )}

          </div>
        </section>
      </main>

      <footer className="bg-[#1A1615]">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-16 py-8">
          <p className="text-base font-semibold text-white">Insight Tutors</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/60">
            <li><a href="#about" className="transition-colors hover:text-white">About Us</a></li>
            <li><a href="#tutors" className="transition-colors hover:text-white">Our Tutors</a></li>
            <li><a href="#services" className="transition-colors hover:text-white">Our Services</a></li>
            <li><a href="#reviews" className="transition-colors hover:text-white">Student Reviews</a></li>
            <li><a href="#contact" className="transition-colors hover:text-white">Contact Us</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
