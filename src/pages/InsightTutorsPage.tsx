import { ChevronLeft, ChevronRight, Mail, MapPin, Menu, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Tutor = {
  name: string;
  summary: string;
  expertise: string;
  superPower: string;
  bio: string;
  atar: string;
  scores: string;
  image: string;
};

type Service = {
  title: string;
  description: string;
};

type Review = {
  quote: string;
  author: string;
};

const TUTOR_IMAGES = [
  "/tutors/samantha.png",
  "/tutors/georgia.png",
  "/tutors/sophie.png",
];

const TUTORS: Tutor[] = [
  {
    name: "Samantha",
    summary: "99.05 ATAR · 9+ years experience · 100+ students tutored",
    expertise: "VCE Math Methods, VCE General Maths, Year 7–10 Maths, HSC Standard 2, HSC Advanced Maths",
    superPower: "I help students climb 20%+ in their marks",
    bio: "Hi, I'm Sam — a qualified Software Engineer with a strong passion for education and mentoring. Outside of my engineering work, I dedicate my time to private tutoring, where I support students not only in improving their academic performance, but also in building confidence and motivation. I take a holistic approach to tutoring: for me, it's not just about solving problems on a page — it's about helping students understand why things work, develop a genuine interest in the subject, and feel capable in their abilities.\n\nI create engaging lessons filled with analogies and real-world examples, making concepts easier to understand and apply. Each lesson is tailored to the student's individual needs, and I strongly believe in fostering a growth mindset — letting go of the idea of being 'bad at math' and instead focusing on small wins that build confidence over time.",
    atar: "99.05 · DUX of the year level · Graduated 2016",
    scores: "General Maths: 46 · Methods: 44 · Specialist: 48 · English: 43 · French: 49 · Chemistry: 39",
    image: TUTOR_IMAGES[0],
  },
  {
    name: "Georgia",
    summary: "99.25 ATAR · 3+ years tutoring experience",
    expertise: "VCE Math Methods, VCE General Maths, Year 7–10 Maths",
    superPower: "Strong interpersonal skills",
    bio: "Hi, I'm Georgia. I have over two years of tutoring experience in all of the below listed subjects, graduating Year 12 VCE in 2022. I am currently studying a Bachelor of Commerce at Melbourne University, followed by a Masters of Engineering.\n\nMy strong interpersonal skills allow me to best meet an individual student's needs by tailoring explanations to suit their natural way of thinking. In doing this, I am able to break down complex concepts in a way that makes sense to the individual. I believe everyone responds best to different teaching styles and I aim to cater for this in tutoring sessions.",
    atar: "99.25 · Graduated 2022",
    scores: "Methods: 40 · English Language: 47 · Physics: 44 · Specialist: 47 · Chemistry: 41",
    image: TUTOR_IMAGES[1],
  },
  {
    name: "Sophie",
    summary: "3+ years tutoring experience",
    expertise: "VCE Math Methods, VCE General Maths, Year 7–10 Maths",
    superPower: "Adapts explanations to every student's way of thinking",
    bio: "Hi, I'm Sophie! I'm a medical student with a strong passion for tutoring and mentoring students. I tutor Maths for Years 7 to 12, including all three senior subjects (General, Methods, and Specialist Maths). I hold a First Class Honours degree in Science, with a major in Biomedical Science and a minor in Mathematics.\n\nI like to understand each student's current learning strategies so I can build on their strengths and effectively address any weaknesses. My goal is not only to help students build confidence and achieve academic success, but also to be a supportive role model along the way.",
    atar: "98.35",
    scores: "Specialist Maths: 46 · Methods: 47",
    image: TUTOR_IMAGES[2],
  },
  {
    name: "Stephanie",
    summary: "98.05 ATAR · 8+ years tutoring experience",
    expertise: "VCE English, VCE English Literature, VCE Biology, Year 7–10 English",
    superPower: "I help students turn their thoughts into powerful, well-structured writing",
    bio: "Hi, I'm Stephanie — a passionate and experienced tutor specialising in English, English Literature, and Biology. I graduated with an ATAR of 98.05 and now help students build the skills and confidence they need to succeed, particularly in written expression.\n\nMy tutoring style is positive, flexible, and tailored to each student. In English, I focus on breaking down complex texts, strengthening sentence structure, and helping students write clear, compelling essays. I work closely with students to develop their own voice, sharpen their arguments, and understand how to meet assessment criteria without losing creativity.",
    atar: "98.05",
    scores: "English: 48 · English Literature: 46 · Biology: 43",
    image: TUTOR_IMAGES[0],
  },
  {
    name: "Alex",
    summary: "96.8 ATAR · 3+ years tutoring experience",
    expertise: "VCE Math Methods, Specialist Maths, General Maths Units 1/2, Primary and Secondary Maths",
    superPower: "High-engagement lessons that build real understanding",
    bio: "Hi there, I'm Alex, a third-year student at Monash University studying a Bachelor of Mechatronics Engineering and a Bachelor of Commerce. I have been a tutor for 3 years since graduating back in 2022, teaching a wide variety of students, including some with learning difficulties.\n\nAs a tutor, I seek to not only improve my students' academic performance, but also their engagement with the content they learn. Learning is an active process, and that concept shapes the way I tutor. With enough support, I believe that any student can thrive beyond expectations, gaining confidence not only in math, but across school and life in general.",
    atar: "96.8",
    scores: "Methods: 47.5 · Specialist: 46.4 · English: 39.3 · Chemistry: 37.1 · Physics: 35.3",
    image: TUTOR_IMAGES[1],
  },
];

const SERVICES: Service[] = [
  {
    title: "Our Subjects",
    description:
      "We specialise in VCE Mathematics and English, while also supporting students across Years 7–10 to build strong foundations.",
  },
  {
    title: "Where are we located?",
    description:
      "Online and in the inner north of Melbourne: Alphington, Ivanhoe, Northcote, Fairfield, Richmond, Collingwood, Carlton, Thornbury.",
  },
  {
    title: "Our Prices",
    description: "Sessions priced between $75 – $95.",
  },
  {
    title: "Our Difference",
    description:
      "We're a team of tutors with strong backgrounds in STEM. We inspire students to explore STEM careers and promote gender equality in these fields.",
  },
  {
    title: "Our Experience",
    description:
      "300+ students tutored over 8 years combined. All our tutors are in the top 2% of Australia (98+ ATAR).",
  },
  {
    title: "In person, online and hybrid",
    description:
      "We believe in-person works best, but know it can be hard to do every week, which is why we offer a mix of the two, or completely remote.",
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
      "Having a female tutor who's also an engineer made me feel like I could actually do STEM too. Rather than just memorising steps, my tutor helped with my understanding.",
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
      "Georgia is incredibly patient. She never rushes through a concept and always checks I actually understand before moving on. I finally feel confident going into exams.",
    author: "Priya",
  },
  {
    quote:
      "I'd failed the same topic three times in class. One session with Sophie and it clicked. She explained it in a completely different way that just made sense to my brain.",
    author: "Ethan",
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

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="liquid-glass-pink w-72 shrink-0 rounded-2xl p-6 ring-1 ring-[#DDB2A3]/30">
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="text-[#DDB2A3]" strokeWidth={1.5} fill="#DDB2A3" />
        ))}
      </div>
      <p className="text-[13.5px] leading-relaxed text-[#1A1615]/80">"{review.quote}"</p>
      <p className="mt-4 text-[13px] font-semibold text-[#1A1615]">{review.author}</p>
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
  { label: "Reviews", href: "#reviews" },
  { label: "Contact Us", href: "#contact" },
];

export function InsightTutorsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);

  const closeMenu = () => setMenuOpen(false);

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

  return (
    <div className="bg-[#EEECEA] text-[#1A1615]">
      {/* Nav — sticky, pill, liquid glass, 24px outer margin each side */}
      <header className="sticky top-6 z-30 bg-transparent">
        <div
          style={{
            marginLeft: scrolled ? "74px" : "44px",
            marginRight: scrolled ? "74px" : "44px",
          }}
        >
          {/* Nav pill */}
          <div
            className="insight-nav-glass relative flex items-center transition-all duration-500 ease-out"
            style={{ height: "63px", borderRadius: "100px" }}
          >
            {/* Logo */}
            <div className="flex items-center gap-1 shrink-0 pl-1">
              <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M14 23 L4 17 L4 5 L14 11 Z" fill="#DDB2A3" />
                <path d="M14 23 L24 17 L24 5 L14 11 Z" fill="#DDB2A3" fillOpacity="0.55" />
                <line x1="14" y1="23" x2="14" y2="11" stroke="white" strokeOpacity="0.5" strokeWidth="1.4" />
                <circle cx="14" cy="11" r="1.2" fill="white" fillOpacity="0.4" />
              </svg>
              <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
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
            <div className="ml-auto shrink-0 pr-1">
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
                className="lg:hidden flex h-[55px] w-[36px] items-center justify-center rounded-full text-[#1A1615] transition-colors hover:bg-black/5 active:scale-[0.97]"
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
          {/* Centered text stack */}
          <div className="mx-auto max-w-3xl px-5 text-center">
            <p className="mx-auto max-w-lg text-xl leading-relaxed text-[#453F3D]">At Insight Tutors, meet</p>
            <h1 className="mt-2 text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              The math tutor who builds your confidence
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-xl leading-relaxed text-[#453F3D]">
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
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-8">
                    <p className="text-[13px] font-semibold text-white">{tutor.name}</p>
                    <p className="text-[11px] text-white/70">{tutor.atar.split("·")[0].trim()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-y border-[#E2DFDB] bg-[#EEECEA]">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
            <h2 className="text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">Our Story</h2>
            <p className="mt-6 max-w-4xl text-lg leading-relaxed text-[#555551]">
              We're a female-led tutoring company dedicated to helping students excel in maths and STEM.
              We're interested in inspiring young students, growing their confidence and also showing them
              what a career in STEM looks like. Our tutors are not only top academic achievers — with ATARs
              of 98+ or subject ranks in the top 2%. Our team includes scientists, lecturers and software
              engineers — each an expert in their subject area with years of experience to tailor their
              tutoring style to the student's needs.
            </p>
          </div>
        </section>

        {/* Tutors */}
        <section id="tutors" className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">Meet Your Tutors</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#555551]">
            We're a team of tutors with strong backgrounds in STEM — software engineering, medical science,
            medicine, and biomedical engineering.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {TUTORS.map((tutor, i) => (
              <article
                key={tutor.name}
                className="insight-tutor-card rounded-2xl border border-[#E2DFDB] bg-[#F3F1EF] p-5"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <img
                  src={tutor.image}
                  alt={`${tutor.name} portrait`}
                  className="h-48 w-full rounded-xl object-cover object-top"
                />
                <h3 className="mt-5 text-2xl font-bold text-[#1A1615]">{tutor.name}</h3>
                <p className="mt-1.5 text-sm font-medium text-[#555551]">{tutor.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#8EAF8A]">{tutor.expertise}</p>
                <p className="mt-2 text-sm font-semibold text-[#555551]">
                  Super power: {tutor.superPower}
                </p>
                <div className="mt-4 space-y-2">
                  {tutor.bio.split("\n\n").map((para, j) => (
                    <p key={j} className="text-sm leading-relaxed text-[#555551]">{para}</p>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-[#E2DFDB] bg-[#F8F6F4] px-4 py-3">
                  <p className="text-xs font-semibold text-[#1A1615]">ATAR: {tutor.atar}</p>
                  <p className="mt-1 text-xs text-[#888884]">{tutor.scores}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="border-y border-[#E2DFDB] bg-[#EEECEA]">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
            <h2 className="text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">What We Offer</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <article
                  key={service.title}
                  className="rounded-2xl border border-[#E2DFDB] bg-[#F8F6F4] p-5"
                >
                  <h3 className="text-base font-semibold text-[#1A1615]">{service.title}</h3>
                  <div className="mt-1.5 h-px w-8 bg-[#8EAF8A]" />
                  <p className="mt-3 text-sm leading-relaxed text-[#555551]">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">What Students Say</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#555551]">
            Real experiences from students who've grown through one-on-one support.
          </p>
          <div className="mt-10 -mx-5">
            <ReviewsMarquee />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-[#E2DFDB] bg-[#F3F1EF]">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
            <div>
              <h2 className="text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">Request your free trial</h2>
              <p className="mt-4 text-base leading-relaxed text-[#555551]">
                Reach out with any questions — we'll respond within 24 hours.
              </p>
              <div className="mt-8 space-y-3 text-sm text-[#555551]">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-[#8EAF8A]" />
                  insighttutorstutoring@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#8EAF8A]" />
                  Inner north Melbourne + online
                </p>
              </div>
            </div>

            <form className="rounded-2xl border border-[#E2DFDB] bg-[#F8F6F4] p-6">
              <div className="grid gap-4">
                <label className="text-sm font-medium text-[#1A1615]">
                  Name*
                  <input className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
                </label>
                <label className="text-sm font-medium text-[#1A1615]">
                  Email*
                  <input className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
                </label>
                <label className="text-sm font-medium text-[#1A1615]">
                  Mobile
                  <input className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
                </label>
                <label className="text-sm font-medium text-[#1A1615]">
                  Year level and subject for tutoring
                  <input className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
                </label>
                <label className="text-sm font-medium text-[#1A1615]">
                  Request details*
                  <textarea
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]"
                  />
                </label>
                <button
                  type="button"
                  className="liquid-glass-light mt-2 rounded-full px-6 py-3 text-sm ring-1 ring-black/20 transition-opacity hover:opacity-75 active:scale-[0.98]"
                >
                  Send a message
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2DFDB] bg-[#EEECEA]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[#888884] md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-[#1A1615]">Insight Tutors</p>
          <ul className="flex flex-wrap gap-4">
            <li><a href="#about" className="transition-colors hover:text-[#1A1615]">About Us</a></li>
            <li><a href="#tutors" className="transition-colors hover:text-[#1A1615]">Our Tutors</a></li>
            <li><a href="#services" className="transition-colors hover:text-[#1A1615]">Our Services</a></li>
            <li><a href="#reviews" className="transition-colors hover:text-[#1A1615]">Student Reviews</a></li>
            <li><a href="#contact" className="transition-colors hover:text-[#1A1615]">Contact Us</a></li>
          </ul>
          <div className="space-y-0.5">
            <p>ABN: 26 828 861 872</p>
            <p>insighttutorstutoring@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
