import { Schema, model, models } from "mongoose";

/**
 * Tracks each GATE question solve event per user.
 * One document = one question solved at a point in time.
 * Used to power the monthly heatmap.
 */
const GateActivitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    streamId: {
      type: String,
      required: true,
      enum: ["cs", "ece", "ee", "me", "ce", "in"],
      default: "cs",
      index: true,
    },
    subjectId: {
      type: String,
      default: "",
    },
    correct: {
      type: Boolean,
      default: true,
    },
    solvedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // No timestamps: we use solvedAt explicitly
    versionKey: false,
  },
);

// Compound index: fast per-user per-stream range queries for heatmap
GateActivitySchema.index({ userId: 1, streamId: 1, solvedAt: -1 });

// Prevent duplicate submissions for same question in same day
GateActivitySchema.index(
  { userId: 1, questionId: 1 },
  { unique: false }, // allow re-practice; counting is intentional
);

const GateActivity = models.GateActivity || model("GateActivity", GateActivitySchema);

export default GateActivity;
