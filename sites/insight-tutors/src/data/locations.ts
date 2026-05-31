/** Suburbs within ~15 minutes of Ivanhoe Library (in-person tutoring area) */
export const TUTORING_SUBURBS = [
  "Alphington",
  "Bellfield",
  "Brunswick",
  "Bundoora",
  "Carlton",
  "Clifton Hill",
  "Collingwood",
  "Eaglemont",
  "Fairfield",
  "Fitzroy",
  "Hawthorn",
  "Heidelberg",
  "Heidelberg Heights",
  "Heidelberg West",
  "Ivanhoe",
  "Kingsbury",
  "Macleod",
  "Northcote",
  "Preston",
  "Reservoir",
  "Richmond",
  "Rosanna",
  "Thornbury",
  "Viewbank",
  "Watsonia",
] as const;

export function formatSuburbList(suburbs: readonly string[]): string {
  if (suburbs.length === 0) return "";
  if (suburbs.length === 1) return suburbs[0] ?? "";
  const last = suburbs[suburbs.length - 1];
  const rest = suburbs.slice(0, -1).join(", ");
  return `${rest}, and ${last}`;
}

export type TutorLocationLabel = "maths tutor" | "english tutor";

export function getWhereWeTutorCopy(tutorLabel: TutorLocationLabel): {
  heading: string;
  intro: string;
  suburbsLine: string;
} {
  const all = formatSuburbList([...TUTORING_SUBURBS]);

  return {
    heading: "Where We Tutor",
    intro: `We offer in-person ${tutorLabel} sessions across Melbourne's inner north and east, plus online tutoring anywhere in Victoria.`,
    suburbsLine: `We tutor in ${all}.`,
  };
}

/** Shorter suburb list for meta descriptions (Google truncates ~155 characters) */
const META_HIGHLIGHT_SUBURBS = [
  "Ivanhoe",
  "Heidelberg",
  "Northcote",
  "Bundoora",
  "Viewbank",
  "Fairfield",
  "Preston",
  "Rosanna",
  "Hawthorn",
] as const;

export function buildSubjectMetaDescription(
  tutorLabel: TutorLocationLabel,
  subjectDetail: string,
): string {
  const highlights = formatSuburbList([...META_HIGHLIGHT_SUBURBS]);
  const label = tutorLabel.charAt(0).toUpperCase() + tutorLabel.slice(1);
  return `${label} in ${highlights}, and surrounding suburbs. ${subjectDetail} In-person and online.`;
}

export function buildLocalBusinessSchema(
  siteUrl: string,
  pageUrl: string,
  tutorLabel: TutorLocationLabel,
): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Insight Tutors",
    url: siteUrl,
    "@id": pageUrl,
    description: buildSubjectMetaDescription(tutorLabel, "VCE tutoring."),
    areaServed: TUTORING_SUBURBS.map((suburb) => ({
      "@type": "City",
      name: suburb,
      containedInPlace: {
        "@type": "State",
        name: "Victoria",
      },
    })),
    priceRange: "$75–$95",
  };
}
