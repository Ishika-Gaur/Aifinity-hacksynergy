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

export async function createAssessment(req, res) {
  const assessment = await Assessment.create({ ...req.body, createdBy: req.user._id, publishedAt: req.body.status === "published" ? new Date() : undefined });
  res.status(201).json({ success: true, assessment: serialize(assessment, true) });
}

export async function updateAssessment(req, res) {
  const update = { ...req.body };
  if (update.status === "published" && !update.publishedAt) update.publishedAt = new Date();
  const assessment = await Assessment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
  res.json({ success: true, assessment: serialize(assessment, true) });
}

export async function removeAssessment(req, res) {
  const assessment = await Assessment.findByIdAndDelete(req.params.id);
  if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found." });
  res.json({ success: true, message: "Assessment deleted." });
}
