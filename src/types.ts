export interface UserProgress {
  uid: string;
  email: string;
  points: number;
  stars: number;
  completedQuestions: string[];
  lastUpdate: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface JointInfo {
  id: string;
  name: string;
  type: string;
  movements: string[];
  fact: string;
  description: string;
  x: number; // percentage coordinate on skeleton SVG/canvas
  y: number; // percentage coordinate on skeleton SVG/canvas
}

export interface PlaneInfo {
  id: string;
  name: string;
  description: string;
  impact: string;
  anatomyTerm: string;
}
