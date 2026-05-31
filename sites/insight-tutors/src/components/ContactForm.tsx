import { ChevronDown } from "lucide-react";
import { useState } from "react";

type TutorPreference = "male" | "female" | "both";
type FormStep = "contact" | "q2" | "done";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const WEEKEND_DAYS = ["Sat", "Sun"] as const;
const WEEKDAY_TIMES = ["4:00–5:00", "5:00–6:00", "6:00–7:00", "7:00–8:00"] as const;
const WEEKEND_TIMES = ["9:00–10:00", "10:00–11:00", "11:00–12:00"] as const;

const GRADES = [
  "Year 1","Year 2","Year 3","Year 4","Year 5","Year 6",
  "Year 7","Year 8","Year 9","Year 10","Year 11","Year 12",
] as const;

const REFERRAL_SOURCES = ["Google search", "Google Maps", "Word of mouth", "Other"] as const;
const SUBJECTS_YEARS_1_10 = ["Mathematics", "English"] as const;
const SUBJECTS_YEARS_11_12 = [
  "English","English Literature","English Language",
  "General Mathematics","Mathematical Methods","Specialist Mathematics",
] as const;

const TUTOR_PREFERENCE_OPTIONS: { value: TutorPreference; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "both", label: "No preference" },
];

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function getSubjectsForGrade(grade: string): readonly string[] {
  const yearNum = parseInt(grade.replace("Year ", ""), 10);
  return yearNum >= 11 ? SUBJECTS_YEARS_11_12 : SUBJECTS_YEARS_1_10;
}

function slotKey(day: string, time: string) {
  return `${day}-${time}`;
}

function SlotGrid({
  days, times, selectedSlots, onToggle,
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
            <th key={day} className="pb-2 px-1 text-center font-medium text-[#888884]">{day}</th>
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
                  >✓</button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ContactForm() {
  const [formStep, setFormStep] = useState<FormStep>("contact");
  const [name, setName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [referralOther, setReferralOther] = useState("");
  const [tutorPreference, setTutorPreference] = useState<TutorPreference | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
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
          access_key: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY as string,
          subject: "New enquiry: contact details only",
          from_name: name, name, student_name: studentName,
          mobile, email: email || "(not provided)",
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
          access_key: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY as string,
          subject: "Complete enquiry: all details",
          from_name: name, name, student_name: studentName, mobile,
          email: email || "(not provided)", grade,
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

  return (
    <div className="w-full">
      {formStep === "q2" && (
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#888884]">Step 2 of 2</p>
      )}

      {formStep !== "done" && (
        <h2 className="insight-heading mb-8 text-center text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl">
          Request your free tutoring session
        </h2>
      )}

      {formStep === "contact" && (
        <form
          className="animate-form-step w-full rounded-2xl border border-[#DCDCDA] bg-white/70 p-6"
          onSubmit={(e) => { e.preventDefault(); void handleContinue(); }}
        >
          <div className="grid gap-4">
            <label className="text-sm font-medium text-[#1A1615]">
              Your name*
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
            </label>
            <label className="text-sm font-medium text-[#1A1615]">
              Name of student*
              <input value={studentName} onChange={(e) => setStudentName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
            </label>
            <label className="text-sm font-medium text-[#1A1615]">
              Mobile*
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
            </label>
            <label className="text-sm font-medium text-[#1A1615]">
              Email <span className="font-normal text-[#888884]">(optional)</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
            </label>
            {step1Error && <p className="text-sm text-red-500">{step1Error}</p>}
            {submitError && <p className="text-sm text-red-500">{submitError}</p>}
            <button type="submit" disabled={isSubmitting}
              className="mt-2 rounded-full bg-[#1A1615] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
              {isSubmitting ? "Sending…" : "Continue"}
            </button>
          </div>
        </form>
      )}

      {formStep === "q2" && (
        <div className="animate-form-step w-full rounded-2xl border border-[#DCDCDA] bg-white/70 p-6">
          <div className="grid gap-6">
            <label className="text-sm font-medium text-[#1A1615]">
              Which year level are you in / is your child in?*
              <div className="relative mt-2">
                <select value={grade}
                  onChange={(e) => { setGrade(e.target.value); setSelectedSubjects(new Set()); }}
                  className="w-full appearance-none rounded-xl border border-[#D4D0CB] bg-white py-2.5 pl-3 pr-8 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]">
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
                    <button key={subject} type="button" onClick={() => toggleSubject(subject)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selectedSubjects.has(subject)
                          ? "border-[#8EAF8A] bg-[#8EAF8A] text-white"
                          : "border-[#D4D0CB] bg-white text-[#555551] hover:border-[#8EAF8A]"
                      }`}>
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
                  <button key={value} type="button"
                    onClick={() => setTutorPreference(tutorPreference === value ? null : value)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      tutorPreference === value
                        ? "border-[#8EAF8A] bg-[#8EAF8A] text-white"
                        : "border-[#D4D0CB] bg-white text-[#555551] hover:border-[#8EAF8A]"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[#1A1615]">
                What day and time would suit you?{" "}
                <span className="font-normal text-[#888884]">(optional)</span>
              </p>
              <p className="mt-1 text-xs text-[#888884]">Try to pick at least 3. We can figure it out together.</p>
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
                <select value={referralSource}
                  onChange={(e) => { setReferralSource(e.target.value); setReferralOther(""); }}
                  className="w-full appearance-none rounded-xl border border-[#D4D0CB] bg-white py-2.5 pl-3 pr-8 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]">
                  <option value="">Select…</option>
                  {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#888884]" />
              </div>
              {referralSource === "Other" && (
                <input type="text" value={referralOther} onChange={(e) => setReferralOther(e.target.value)}
                  placeholder="Please tell us where you found us"
                  className="mt-2 w-full rounded-xl border border-[#D4D0CB] bg-white px-3 py-2.5 text-sm text-[#1A1615] outline-none transition-colors focus:border-[#8EAF8A]" />
              )}
            </label>

            {submitError && <p className="text-sm text-red-500">{submitError}</p>}
            <button type="button"
              disabled={isSubmitting || (referralSource === "Other" && referralOther.trim() === "")}
              onClick={() => { void handleSubmit(); }}
              className="mt-2 w-full rounded-full bg-[#1A1615] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
              {isSubmitting ? "Sending…" : "Submit"}
            </button>
          </div>
        </div>
      )}

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
  );
}
