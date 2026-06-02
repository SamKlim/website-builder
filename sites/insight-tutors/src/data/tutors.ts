export type TutorCategory = "math" | "english";

export type Tutor = {
  name: string;
  expertise: string;
  bio: string;
  atar: string;
  scores: string;
  image: string;
  category: TutorCategory;
};

export const TUTORS: Tutor[] = [
  {
    name: "Samantha",
    expertise: "VCE Math Methods, VCE General Maths, Year 1-10 Maths",
    bio: "Hi, I'm Sam, a qualified Software Engineer with a strong passion for education and mentoring. Outside of my engineering work, I dedicate my time to private tutoring, where I support students not only in improving their academic performance, but also in building confidence and motivation. I take a holistic approach to tutoring: for me, it's not just about solving problems on a page. It's about helping students understand why things work, develop a genuine interest in the subject, and feel capable in their abilities.\n\nI create engaging lessons filled with analogies and real-world examples, making concepts easier to understand and apply. Each lesson is tailored to the student's individual needs, and I strongly believe in fostering a growth mindset, letting go of the idea of being 'bad at math' and instead focusing on small wins that build confidence over time.",
    atar: "99.05 · DUX of the year level",
    scores: "General Maths: 46 · Methods: 44 · Specialist Maths: 49",
    image: "/tutors/samantha.png",
    category: "math",
  },
  {
    name: "Georgia",
    expertise: "VCE Math Methods, Year 1-10 Maths",
    bio: "Hi, I'm Georgia. I have over two years of tutoring experience in all of the below listed subjects. I am currently studying a Bachelor of Commerce at Melbourne University, followed by a Masters of Engineering.\n\nMy strong interpersonal skills allow me to best meet an individual student's needs by tailoring explanations to suit their natural way of thinking. In doing this, I am able to break down complex concepts in a way that makes sense to the individual. I believe everyone responds best to different teaching styles and I aim to cater for this in tutoring sessions.",
    atar: "99.25",
    scores: "Methods: 40",
    image: "/tutors/georgia.png",
    category: "math",
  },
  {
    name: "Sophie",
    expertise: "VCE Math Methods, Year 1-10 Maths",
    bio: "Hi, I'm Sophie! I'm a medical student with a strong passion for tutoring and mentoring students. I tutor Maths for Years 7 to 12, including all three senior subjects (General, Methods, and Specialist Maths). I hold a First Class Honours degree in Science, with a major in Biomedical Science and a minor in Mathematics.\n\nI like to understand each student's current learning strategies so I can build on their strengths and effectively address any weaknesses. My goal is not only to help students build confidence and achieve academic success, but also to be a supportive role model along the way.",
    atar: "98.35",
    scores: "Specialist Maths: 46 · Methods: 47",
    image: "/tutors/sophie.png",
    category: "math",
  },
  {
    name: "Stephanie",
    expertise: "VCE English, VCE English Literature, VCE Biology, Year 7-10 English",
    bio: "Hi, I'm Stephanie, a passionate and experienced tutor specialising in English, English Literature, and Biology. I now help students build the skills and confidence they need to succeed, particularly in written expression.\n\nMy tutoring style is positive, flexible, and tailored to each student. In English, I focus on breaking down complex texts, strengthening sentence structure, and helping students write clear, compelling essays. I work closely with students to develop their own voice, sharpen their arguments, and understand how to meet assessment criteria without losing creativity.",
    atar: "98.05",
    scores: "English: 48 · English Literature: 46 · Biology: 43",
    image: "/tutors/stephanie.png",
    category: "english",
  },
  {
    name: "Alyssa",
    expertise: "VCE Math Methods, Year 1-10 Maths",
    bio: "Hi, I'm Alyssa, a passionate tutor with a genuine love for helping students grow in confidence and ability. I believe that with the right explanation and a supportive environment, every student can develop a strong grasp of the subject.\n\nI tailor each session to the individual, focusing on the areas where they need the most support while building on their existing strengths. My aim is always for students to leave each lesson feeling more capable and prepared than when they arrived.",
    atar: "99.6",
    scores: "Specialist Maths: 51 · Methods: 44",
    image: "/tutors/alyssa.png",
    category: "math",
  },
  {
    name: "Alex",
    expertise: "VCE Math Methods, VCE Specialist Maths, Year 1-10 Maths",
    bio: "Hi there, I'm Alex, a third-year student at Monash University studying a Bachelor of Mechatronics Engineering and a Bachelor of Commerce. I have been a tutor for 3 years since graduating back in 2022, teaching a wide variety of students, including some with learning difficulties.\n\nAs a tutor, I seek to not only improve my students' academic performance, but also their engagement with the content they learn. Learning is an active process, and that concept shapes the way I tutor. With enough support, I believe that any student can thrive beyond expectations, gaining confidence not only in math, but across school and life in general.",
    atar: "96.8",
    scores: "Methods: 47.5 · Specialist: 46.4",
    image: "/tutors/alex.png",
    category: "math",
  },
  {
    name: "Michaela",
    expertise: "VCE English, VCE English Literature, Year 7-10 English",
    bio: "Hi, I'm Michaela, a passionate English tutor who loves helping students find their voice on the page. Whether it's unpacking a complex text, crafting a persuasive argument, or polishing an essay, I tailor every session to what each student actually needs.\n\nI believe strong writing starts with strong thinking. My focus is on helping students understand how language works and why it matters, so they can approach any task with confidence, not just follow a formula.",
    atar: "TBC",
    scores: "English: TBC · English Literature: TBC",
    image: "/tutors/michaela.png",
    category: "english",
  },
  {
    name: "Zara",
    expertise: "VCE General Maths, Year 1-10 Maths",
    bio: "Hi, I'm Zara. I'm studying a Bachelor of Commerce at Monash University, and graduated with an ATAR of 94.50 and achieved a 49 study score in General Maths. I find it incredibly rewarding to help others understand maths, whether that's classmates at university or students I tutor.\n\nMy tutoring style is flexible and tailored to each student's needs. I meet students at whatever level they are at when they start with me. That might mean covering content from the very beginning, addressing specific gaps, working through exercise questions and practice tests, or reviewing past assessments.",
    atar: "94.50",
    scores: "General Maths: 49",
    image: "/tutors/zara.png",
    category: "math",
  },
];
