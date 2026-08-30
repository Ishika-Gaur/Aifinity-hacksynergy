import { useState } from "react";
import Container from "../components/Container";
import CtaBanner from "../components/CtaBanner";

const FAQ_DATA = [
  {
    category: "Overview",
    items: [
      {
        q: "What is AIFinity?",
        a: "AIFinity is a learning intelligence platform that helps students understand why they keep making mistakes, which concepts they are missing, and what to learn next to become career-ready.",
      },
      {
        q: "Who is AIFinity for?",
        a: "It is built for students, early-career learners, and anyone preparing for a job where they need to improve core skills, identify gaps, and turn weak areas into a structured learning plan.",
      },
      {
        q: "What problem does it solve?",
        a: "Most learning platforms show scores. AIFinity explains the underlying concept gap, highlights recurring mistakes, and turns those insights into personalized next steps.",
      },
      {
        q: "What makes AIFinity different from other ed-tech platforms?",
        a: "Instead of stopping at a right-or-wrong result, it traces every mistake back to its root cause and connects that insight to a career-readiness roadmap, not just a study plan.",
      },
    ],
  },
  {
    category: "How It Works",
    items: [
      {
        q: "How does the learning flow work?",
        a: "Students begin by attempting assessments, quizzes, or coding tasks. The platform analyzes the mistakes, identifies the missing concept, and builds a personalized roadmap for improvement.",
      },
      {
        q: "What does the platform actually analyze?",
        a: "It studies answer patterns, repeated mistakes, concept gaps, career fit, and readiness trends to recommend the right study path instead of generic practice.",
      },
      {
        q: "Does it only help with test scores?",
        a: "No. It is designed to turn mistakes into understanding, so learners improve the reason behind the error and the underlying skill behind the answer.",
      },
      {
        q: "How often is my roadmap updated?",
        a: "Every new attempt feeds back into the system, so your concept map, mistake patterns, and roadmap refine themselves as you keep practicing.",
      },
    ],
  },
  {
    category: "ConceptRoot AI",
    items: [
      {
        q: "What does ConceptRoot AI do?",
        a: "ConceptRoot AI looks at a wrong answer and traces it back to the missing concept or prerequisite understanding instead of simply marking it incorrect.",
      },
      {
        q: "Why is concept-root analysis important?",
        a: "A learner can get many questions wrong for the same reason. ConceptRoot AI finds that shared cause so the learner can fix the real learning gap instead of memorizing isolated answers.",
      },
      {
        q: "Can it help with repeated mistakes?",
        a: "Yes. The system identifies repeated error patterns and exposes the underlying concept weakness behind those repeated failures.",
      },
      {
        q: "Does ConceptRoot AI suggest what to study next?",
        a: "Yes. Once the missing concept is identified, it recommends targeted practice and adaptive next steps built around that specific gap.",
      },
    ],
  },
  {
    category: "MistakeMap AI",
    items: [
      {
        q: "What is MistakeMap AI?",
        a: "MistakeMap AI tracks learning attempts over time and groups repeated mistakes into patterns so students can see how their errors evolve and what they need to fix.",
      },
      {
        q: "How does it detect patterns?",
        a: "It compares multiple attempts across tests and tasks, then identifies recurring weaknesses such as conceptual misunderstanding, timing issues, or accuracy problems.",
      },
      {
        q: "Is this helpful for long-term learning?",
        a: "Absolutely. Instead of tracking only one quiz, it creates a longer-term view of improvement so students can measure progress across different learning stages.",
      },
      {
        q: "Can MistakeMap AI tell the difference between a knowledge gap and a speed issue?",
        a: "Yes. It classifies mistakes into categories like knowledge gaps, speed issues, and accuracy problems, so the fix matches the actual cause.",
      },
    ],
  },
  {
    category: "SkillGap AI",
    items: [
      {
        q: "What does SkillGap AI measure?",
        a: "It compares a learner's current skills and performance against the skills required for a chosen career path, then highlights what is missing.",
      },
      {
        q: "Can it recommend a roadmap?",
        a: "Yes. It uses the identified gaps to generate targeted steps, study priorities, and learning milestones tailored to the learner's career goal.",
      },
      {
        q: "Does it consider career goals?",
        a: "Yes. Learners can target a profession, and the platform aligns their learning path to the actual competencies relevant to that role.",
      },
      {
        q: "Can SkillGap AI use my resume and projects?",
        a: "Yes. It factors in your resume and existing projects alongside your quiz performance to build a more accurate picture of your current skill level.",
      },
    ],
  },
  {
    category: "Getting Started",
    items: [
      {
        q: "Do I need to create an account first?",
        a: "Yes. You sign up, choose a learning path or assessment, and then the platform begins analyzing your performance to personalize the experience.",
      },
      {
        q: "Is AIFinity suitable for beginners?",
        a: "Yes. It adapts recommendations to the learner's current level, so both beginners and more advanced students can improve with relevant guidance.",
      },
      {
        q: "Can I use it for career preparation?",
        a: "Yes. The platform is designed to help learners bridge skill gaps, improve confidence, and build a clearer path toward job-ready readiness.",
      },
      {
        q: "Is there a cost to get started?",
        a: "You can sign up and start attempting assessments right away — check the pricing or plans section for details on what's included at each tier.",
      },
    ],
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
        open ? "rotate-180" : "rotate-0"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#2E4F42]/12 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer group"
      >
        <span
          className={`font-sans text-sm sm:text-base font-semibold transition-colors ${
            isOpen ? "text-[#1B332C]" : "text-[#24413A] group-hover:text-[#1B332C]"
          }`}
        >
          {item.q}
        </span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 ${
            isOpen
              ? "bg-[#1B332C] text-[#E8C547] border-[#1B332C]"
              : "border-[#2E4F42]/25 text-[#24413A] group-hover:border-[#C4952A]"
          }`}
        >
          <ChevronIcon open={isOpen} />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 text-sm leading-6 text-[#4A5A52] font-sans">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].category);
  const [openIndex, setOpenIndex] = useState(0);

  const activeItems =
    activeCategory === "Overview"
      ? FAQ_DATA.flatMap((c) => c.items)
      : FAQ_DATA.find((c) => c.category === activeCategory)?.items ?? [];

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setOpenIndex(0);
  };

  return (
    <section className="bg-grid py-20 sm:py-28">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#1B332C]/5 px-4 py-1.5 font-['Space_Mono'] text-[10px] font-bold uppercase tracking-widest text-[#C4952A] border border-[#C4952A]/30">
            FAQ
          </span>
          <h1 className="mt-5 font-sans text-3xl sm:text-4xl font-extrabold text-[#1B332C] leading-tight tracking-tight">
            AI That Turns Struggles into Strengths
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-6 text-[#4A5A52] font-sans">
            Everything you need to know about how AIFinity helps you
            discover, analyze, improve, and prepare — from your first mistake
            to your next career move.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="relative z-10 mt-12 flex flex-wrap justify-center gap-3">
          {FAQ_DATA.map((cat) => {
            const isActive = activeCategory === cat.category;

            return (
              <button
                key={cat.category}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleCategoryClick(cat.category)}
                className={`rounded-full px-4 py-2.5 font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-[#1B332C] text-[#E8C547] border-[#1B332C] shadow-sm"
                    : "bg-white/70 text-[#24413A] border-[#2E4F42]/20 hover:bg-[#EDE6D3] hover:border-[#C4952A]/50 hover:text-[#1B332C] hover:-translate-y-0.5"
                }`}
              >
                {cat.category}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="relative z-10 mx-auto mt-10 max-w-3xl rounded-2xl border border-[#2E4F42]/10 bg-white/60 px-6 shadow-sm sm:px-8">
          {activeItems.map((item, idx) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mx-auto mt-14 max-w-4xl">
          <CtaBanner
            eyebrow="Need more help?"
            title="Still figuring out the best next step?"
            buttonLabel="Contact Us"
            href="/contact"
            className="!rounded-2xl"
          />
        </div>
      </Container>
    </section>
  );
}
