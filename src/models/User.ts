import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 40,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    supabaseId: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["password", "google", "supabase"],
      default: "password",
    },
    referralCode: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    referredBy: {
      type: String,
      default: "",
      trim: true,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    problemsSolved: {
      type: Number,
      default: 0,
    },
    solvedProblems: {
      type: [String],
      default: [],
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ referralCode: 1 }, { unique: true, sparse: true });

const User = models.User || model("User", UserSchema);

export default User;
