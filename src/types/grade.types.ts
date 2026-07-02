export interface GradeCriterionScore {
  criterion: string;
  score: number;
  max: number;
  justification: string;
}

export interface GradingResult {
  criterion_scores: GradeCriterionScore[];
  total_score: number;
  strengths: string;
  areas_to_improve: string;
  suggested_comment: string;
  confidence: "high" | "medium" | "low";
}

