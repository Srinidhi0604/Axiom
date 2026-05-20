import mongoose, { Schema, model, models } from "mongoose";

const PlacementProgressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  solvedProblems: {
    type: [String],
    default: [],
  },
  notesMap: {
    type: Map,
    of: String,
    default: {},
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

PlacementProgressSchema.index({ userId: 1 });

const PlacementProgress = models.PlacementProgress || model("PlacementProgress", PlacementProgressSchema);

export default PlacementProgress;
