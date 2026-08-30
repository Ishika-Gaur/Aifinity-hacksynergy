import React, { useState } from "react";
import { createPortal } from "react-dom";
import Button from "../Button";

const CAREER_PRESETS = [
  {
    role: "Machine Learning Engineer",
    tags: ["Python", "ML", "Deep Learning", "NLP", "GenAI"],
  },
  {
    role: "Full Stack AI Developer",
    tags: ["React", "Node.js", "Python", "LLMs", "Vector DBs"],
  },
  {
    role: "Data Scientist & AI Analyst",
    tags: ["Python", "SQL", "Statistics", "ML", "Visualization"],
  },
  {
    role: "AI Research Engineer",
    tags: ["PyTorch", "Algorithms", "Transformers", "RL", "Math"],
  },
  {
    role: "GenAI & Prompt Engineer",
    tags: ["Prompting", "Fine-Tuning", "RAG", "LangChain", "APIs"],
  },
];

export default function CareerGoalCard({ careerGoal, onUpdateGoal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState({
    title: careerGoal?.title || "YOUR CAREER GOAL",
    role: careerGoal?.role || "Machine Learning Engineer",
    tags: careerGoal?.tags || ["Python", "ML", "Deep Learning", "NLP", "GenAI"],
    cta: careerGoal?.cta || "Update Goal",
  });

  const [selectedRole, setSelectedRole] = useState(currentGoal.role);
  const [customTagsInput, setCustomTagsInput] = useState(
    currentGoal.tags.join(", ")
  );
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSelectPreset = (preset) => {
    setSelectedRole(preset.role);
    setCustomTagsInput(preset.tags.join(", "));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsedTags = customTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updated = {
      ...currentGoal,
      role: selectedRole.trim() || "Machine Learning Engineer",
      tags: parsedTags.length > 0 ? parsedTags : ["Python", "AI"],
    };

    setCurrentGoal(updated);
    if (onUpdateGoal) {
      onUpdateGoal(updated);
    }
    setIsOpen(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // Render modal safely via Portal to prevent any CSS transform glitches
  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B332C]/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#FBF8F0] border-2 border-[#C4952A] p-6 sm:p-7 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2E4F42]/15 pb-3">
          <div>
            <h3 className="font-sans text-xl font-bold text-[#1B332C]">
              Update Career Goal
            </h3>
            <p className="text-xs text-[#5B6B5F] font-sans mt-0.5">
              Select a target pathway to customize your entire learning analytics & roadmap.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg h-8 w-8 inline-flex items-center justify-center text-[#5B6B5F] hover:bg-[#EDE6D3] hover:text-[#1B332C] transition-colors font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets Selector */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#1B332C]">
            Popular Target Pathways
          </label>
          <div className="flex flex-wrap gap-2">
            {CAREER_PRESETS.map((preset, idx) => {
              const isSelected = selectedRole === preset.role;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-sans font-medium transition-all text-left border cursor-pointer ${
                    isSelected
                      ? "bg-[#1B332C] text-[#E8C547] border-[#1B332C] font-bold shadow-xs"
                      : "bg-[#EDE6D3]/60 text-[#24413A] border-[#2E4F42]/15 hover:bg-[#EDE6D3] hover:text-[#1B332C]"
                  }`}
                >
                  {preset.role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#1B332C]">
              Target Role Title
            </label>
            <input
              type="text"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              placeholder="e.g. Machine Learning Engineer"
              required
              className="w-full rounded-xl border border-[#2E4F42]/20 bg-white px-3.5 py-2 text-sm text-[#1B332C] focus:border-[#C4952A] focus:outline-none focus:ring-1 focus:ring-[#C4952A]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#1B332C]">
              Target Skill Competencies (Comma-separated)
            </label>
            <input
              type="text"
              value={customTagsInput}
              onChange={(e) => setCustomTagsInput(e.target.value)}
              placeholder="e.g. Python, ML, Deep Learning, NLP, GenAI"
              required
              className="w-full rounded-xl border border-[#2E4F42]/20 bg-white px-3.5 py-2 text-sm text-[#1B332C] focus:border-[#C4952A] focus:outline-none focus:ring-1 focus:ring-[#C4952A]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2E4F42]/15">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save & Recalculate Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative rounded-2xl bg-[#FBF8F0] p-6 border border-[#2E4F42]/12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4 group">
      {/* Toast Notification on Success */}
      {showSuccessToast && (
        <div className="absolute -top-3 inset-x-4 z-20 rounded-xl bg-[#1B332C] px-3.5 py-2 text-xs text-[#E8C547] border border-[#E8C547]/50 shadow-md flex items-center justify-between font-mono">
          <span>✓ Dashboard updated for {currentGoal.role}!</span>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-[#FBF8F0] hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5B6B5F] group-hover:text-[#1B332C] transition-colors">
            {currentGoal.title}
          </span>
          <span className="text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            🎯
          </span>
        </div>

        <div>
          <h4 className="font-sans text-xl font-bold text-[#1B332C]">
            {currentGoal.role}
          </h4>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentGoal.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-[#EDE6D3] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#1B332C] hover:bg-[#1B332C] hover:text-[#E8C547] transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#2E4F42]/10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="w-full justify-between group-hover:bg-[#1B332C] group-hover:text-[#E8C547] group-hover:border-[#1B332C] transition-all duration-200 cursor-pointer"
        >
          <span>{currentGoal.cta}</span>
          <span>⚙</span>
        </Button>
      </div>

      {/* Render Modal into Portal */}
      {typeof document !== "undefined" && modalContent
        ? createPortal(modalContent, document.body)
        : modalContent}
    </div>
  );
}
