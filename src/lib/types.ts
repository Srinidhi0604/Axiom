/**
 * Shared TypeScript types and interfaces for Axiom application
 */

// Domain Enums
export enum Domain {
  ML = "machine-learning",
  BIOLOGY = "biology",
  CHEMISTRY = "chemistry",
  EE = "electrical-engineering",
}

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}

// Paper Types
export interface Paper {
  _id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  domain: string;
  difficulty: string;
  url?: string;
  pdfUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Problem Types
export interface Problem {
  _id: string;
  title: string;
  description: string;
  paperId?: string;
  difficulty: string;
  tags: string[];
  initialCode: string;
  testCases: TestCase[];
  solution: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

// Submission Types
export interface Submission {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  passed: boolean;
  output?: string;
  executionTime: number;
  createdAt: Date;
}

// Review Types
export interface Review {
  _id: string;
  userId: string;
  paperId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  userId: string;
  username: string;
  problemsSolved: number;
  score: number;
  rank: number;
}

// API Request/Response Types
export interface ApiErrorResponse {
  success: false;
  error: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}
