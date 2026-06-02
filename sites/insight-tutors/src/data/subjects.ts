export type SubjectSlug = "maths" | "english";

export type SubjectCoverItem = {
  title: string;
  description: string;
  gradient: string;
  topics?: string[];
};

export type SubjectPage = {
  slug: SubjectSlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  tutorCategory: "math" | "english";
  coverItems: SubjectCoverItem[];
  showExamVaultDifference?: boolean;
};

export const DIFFERENCE_POINTS_1 = [
  "In every lesson, students work through VCAA exam-style questions throughout the entire year.",
  "This helps them learn how to connect multiple concepts rather than practising topics in isolation.",
];

export const DIFFERENCE_POINTS_2 = [
  "Exam Vault is our own proprietary platform which contains 26 years of past exam questions organised by topic, subtopic, and varying levels of difficulty.",
  "This allows students to target weak areas while practising questions at the same difficulty as the final exam. With the support of our tutors, our approach ensures students are fully prepared for real exam conditions.",
];

const MATHS_GRADIENTS = {
  years110:
    "radial-gradient(ellipse at 18% 38%, rgba(215,108,82,0.90) 0%, transparent 48%), radial-gradient(ellipse at 76% 60%, rgba(72,162,152,0.85) 0%, transparent 48%), radial-gradient(ellipse at 52% 14%, rgba(238,188,148,0.68) 0%, transparent 44%), radial-gradient(ellipse at 22% 80%, rgba(105,185,172,0.52) 0%, transparent 42%), #F2E8E2",
  general:
    "radial-gradient(ellipse at 24% 58%, rgba(108,158,102,0.92) 0%, transparent 48%), radial-gradient(ellipse at 74% 26%, rgba(215,138,82,0.85) 0%, transparent 48%), radial-gradient(ellipse at 62% 80%, rgba(145,195,135,0.65) 0%, transparent 44%), radial-gradient(ellipse at 14% 16%, rgba(242,185,118,0.52) 0%, transparent 42%), #E2EEDC",
  methods:
    "radial-gradient(ellipse at 22% 44%, rgba(218,168,82,0.92) 0%, transparent 48%), radial-gradient(ellipse at 72% 56%, rgba(145,112,202,0.82) 0%, transparent 48%), radial-gradient(ellipse at 56% 12%, rgba(245,218,128,0.68) 0%, transparent 44%), radial-gradient(ellipse at 16% 80%, rgba(172,145,222,0.52) 0%, transparent 42%), #F0E8D2",
  specialist:
    "radial-gradient(ellipse at 35% 52%, rgba(82,145,92,0.92) 0%, transparent 48%), radial-gradient(ellipse at 74% 30%, rgba(218,132,102,0.85) 0%, transparent 48%), radial-gradient(ellipse at 18% 20%, rgba(128,188,128,0.68) 0%, transparent 44%), radial-gradient(ellipse at 70% 78%, rgba(242,172,142,0.55) 0%, transparent 42%), #D8ECD2",
} as const;

const ENGLISH_GRADIENTS = {
  years710:
    "radial-gradient(ellipse at 28% 28%, rgba(218,92,138,0.90) 0%, transparent 48%), radial-gradient(ellipse at 72% 68%, rgba(108,175,135,0.85) 0%, transparent 48%), radial-gradient(ellipse at 66% 14%, rgba(245,162,185,0.68) 0%, transparent 44%), radial-gradient(ellipse at 14% 76%, rgba(142,205,162,0.52) 0%, transparent 42%), #F5E5EE",
  english:
    "radial-gradient(ellipse at 18% 38%, rgba(215,108,82,0.90) 0%, transparent 48%), radial-gradient(ellipse at 76% 60%, rgba(72,162,152,0.85) 0%, transparent 48%), radial-gradient(ellipse at 52% 14%, rgba(238,188,148,0.68) 0%, transparent 44%), radial-gradient(ellipse at 22% 80%, rgba(105,185,172,0.52) 0%, transparent 42%), #F2E8E2",
  literature:
    "radial-gradient(ellipse at 52% 30%, rgba(152,118,215,0.92) 0%, transparent 48%), radial-gradient(ellipse at 20% 68%, rgba(222,165,88,0.85) 0%, transparent 48%), radial-gradient(ellipse at 78% 66%, rgba(192,152,235,0.68) 0%, transparent 44%), radial-gradient(ellipse at 65% 10%, rgba(245,198,122,0.55) 0%, transparent 42%), #E8E0F5",
  language:
    "radial-gradient(ellipse at 24% 58%, rgba(108,158,102,0.92) 0%, transparent 48%), radial-gradient(ellipse at 74% 26%, rgba(215,138,82,0.85) 0%, transparent 48%), radial-gradient(ellipse at 62% 80%, rgba(145,195,135,0.65) 0%, transparent 44%), radial-gradient(ellipse at 14% 16%, rgba(242,185,118,0.52) 0%, transparent 42%), #E2EEDC",
} as const;

export const SUBJECT_PAGES: SubjectPage[] = [
  {
    slug: "maths",
    title: "Maths",
    metaTitle: "Maths Tutor Melbourne | Ivanhoe, Heidelberg, Northcote & Inner North",
    metaDescription:
      "Maths tutor in Ivanhoe, Heidelberg, Northcote, Bundoora, Viewbank, Fairfield, Preston, Rosanna, Hawthorn, and surrounding suburbs. VCE Methods, Specialist, and General Maths. In-person and online.",
    headline: "VCE Maths Tutoring in Melbourne",
    subheadline:
      "One-on-one support from tutors who are in the top 2% of the state, covering every VCE maths subject and Years 1-10.",
    tutorCategory: "math",
    showExamVaultDifference: true,
    coverItems: [
      {
        title: "Years 1-10 Mathematics",
        description:
          "Every year of maths builds on the last. It's the same topics, just harder and harder. When the basics aren't solid, students fall behind and the stress compounds year on year. We help Years 1-10 students master those foundations so they stay confident and keep up as school gets harder.",
        gradient: MATHS_GRADIENTS.years110,
        topics: ["Number & algebra", "Measurement & geometry", "Problem-solving strategies", "Building blocks for VCE"],
      },
      {
        title: "VCE General Mathematics",
        description:
          "General Maths is practical and fast-paced. Our tutors help students master data analysis, financial maths, and networks, with a focus on VCAA-style questions from day one.",
        gradient: MATHS_GRADIENTS.general,
        topics: ["Data analysis & statistics", "Recursion & financial modelling", "Networks & decision maths", "Matrices"],
      },
      {
        title: "VCE Mathematical Methods",
        description:
          "Methods is the core VCE maths subject. We help students connect calculus, functions, and probability, not just memorise steps, so they can tackle any exam question with confidence.",
        gradient: MATHS_GRADIENTS.methods,
        topics: ["Functions & graphs", "Calculus", "Probability & statistics", "VCAA exam-style questions"],
      },
      {
        title: "VCE Specialist Mathematics",
        description:
          "Specialist is the most demanding VCE maths subject. Our tutors scored 46+ and know exactly where students get stuck, from complex numbers to vectors and mechanics.",
        gradient: MATHS_GRADIENTS.specialist,
        topics: ["Complex numbers", "Vectors & mechanics", "Proof & advanced calculus", "Past exam question practice"],
      },
    ],
  },
  {
    slug: "english",
    title: "English",
    metaTitle: "English Tutor Melbourne | Ivanhoe, Heidelberg, Northcote & Inner North",
    metaDescription:
      "English tutor in Ivanhoe, Heidelberg, Northcote, Bundoora, Viewbank, Fairfield, Preston, Rosanna, Hawthorn, and surrounding suburbs. VCE English, Literature, and English Language. In-person and online.",
    headline: "VCE English Tutoring in Melbourne",
    subheadline:
      "One-on-one support from tutors who are in the top 2% of the state, covering every VCE English subject and Years 7-10.",
    tutorCategory: "english",
    coverItems: [
      {
        title: "Years 7-10 English",
        description:
          "Building strong reading comprehension and writing skills early makes senior English significantly more manageable. We work on the foundations that matter.",
        gradient: ENGLISH_GRADIENTS.years710,
        topics: ["Reading comprehension", "Paragraph & essay structure", "Creative writing", "Text analysis basics"],
      },
      {
        title: "VCE English",
        description:
          "We cover text response, comparative essays, and language analysis. Our tutors help students find their voice and meet the exact criteria assessors look for.",
        gradient: ENGLISH_GRADIENTS.english,
        topics: ["Text response", "Comparative essays", "Language analysis", "Creative & oral tasks"],
      },
      {
        title: "VCE English Literature",
        description:
          "Literature demands close reading and sophisticated argument. We help students unpack complex texts, sharpen their analysis, and write essays that stand out.",
        gradient: ENGLISH_GRADIENTS.literature,
        topics: ["Close reading", "Literary perspectives", "Passage analysis", "Comparative literary essays"],
      },
      {
        title: "VCE English Language",
        description:
          "English Language is analytical and precise. Our tutors break down metalanguage, discourse, and short answer structure so students know exactly what examiners expect.",
        gradient: ENGLISH_GRADIENTS.language,
        topics: ["Metalanguage & subsystems", "Short answer technique", "Analytical commentary", "Essay structure"],
      },
    ],
  },
];
