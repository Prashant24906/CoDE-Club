import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    questions: [
      {
        question: String,
        options: [String], // ["A", "B", "C", "D"]
        answer: String, // "A"
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
