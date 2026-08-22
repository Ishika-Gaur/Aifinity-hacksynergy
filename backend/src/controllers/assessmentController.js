import Assessment from "../models/Assessment.js";

const serialize = (assessment, includeAnswers = false) => {
  const data = assessment.toObject ? assessment.toObject() : assessment;
  const questions = data.questions.map((question) => {
    const item = { ...question, id: String(question._id) };
    delete item._id;
    if (!includeAnswers) delete item.answer;
    return item;
  });
  return { ...data, id: String(data._id), _id: undefined, questions };
};

export async function listPublished(req, res) {
  const assessments = await Assessment.find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 });
  res.json({ success: true, assessments: assessments.map((a) => serialize(a)) });
}

export async function getPublished(req, res) {
  const assessment = await Assessment.findOne({ _id: req.params.id, status: "published" });
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
  res.json({ success: true, assessment: serialize(assessment, true) });
}

export async function listAdmin(req, res) {
  const assessments = await Assessment.find().sort({ createdAt: -1 });
  res.json({ success: true, assessments: assessments.map((a) => serialize(a, true)) });
}

// Helper validation function
function validateAssessment(data) {
  const errors = [];
  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.push("Title is required and must be a non‑empty string.");
  }
  if (!data.category || typeof data.category !== "string" || !data.category.trim()) {
    errors.push("Category is required and must be a non‑empty string.");
  }
  if (data.duration == null || typeof data.duration !== "number" || data.duration < 1) {
    errors.push("Duration is required and must be a positive number (minutes).");
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    errors.push("At least one question is required.");
  } else {
    data.questions.forEach((q, idx) => {
      if (!q.question || typeof q.question !== "string" || !q.question.trim()) {
        errors.push(`Question ${idx + 1}: text is required.`);
      }
      if (Array.isArray(q.options) && q.options.length > 0) {
        const hasValidAnswer = q.answer !== undefined && q.answer !== null;
        if (!hasValidAnswer) {
          errors.push(`Question ${idx + 1}: answer is required when options are provided.`);
        }
      }
    });
  }
  return errors;
}

export async function createAssessment(req, res) {
  try {
    const validationErrors = validateAssessment(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }
    const assessment = await Assessment.create({
      ...req.body,
      createdBy: req.user._id,
      publishedAt: req.body.status === "published" ? new Date() : undefined,
    });
    res.status(201).json({ success: true, assessment: serialize(assessment, true) });
  } catch (err) {
    console.error("Error creating assessment:", err);
    res.status(500).json({ success: false, message: "Server error while creating assessment." });
  }
}

export async function updateAssessment(req, res) {
  try {
    const validationErrors = validateAssessment(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }
    const update = { ...req.body };
    if (update.status === "published" && !update.publishedAt) update.publishedAt = new Date();
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
    res.json({ success: true, assessment: serialize(assessment, true) });
  } catch (err) {
    console.error("Error updating assessment:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid assessment ID format." });
    }
    res.status(500).json({ success: false, message: "Server error while updating assessment." });
  }
}

export async function removeAssessment(req, res) {
  const assessment = await Assessment.findByIdAndDelete(req.params.id);
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
  res.json({ success: true, message: "Assessment deleted." });
}
