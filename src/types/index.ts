export type SubscriptionTier = "free" | "premium";

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  subscription_tier: SubscriptionTier;
  daily_checks_used: number;
  last_check_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Condition {
  name: string;
  confidence: number;
  description: string;
}

export interface SymptomCheck {
  id: string;
  user_id: string;
  symptoms: string;
  conditions: Condition[];
  severity: "mild" | "moderate" | "urgent";
  recommendations: string[];
  confidence_score: number;
  created_at: Date;
}

export interface SymptomCheckRequest {
  symptoms: string;
}

export interface UsageStats {
  tier: SubscriptionTier;
  dailyChecksUsed: number;
  dailyChecksLimit: number;
  remaining: number;
  lastCheckDate: Date | null;
}

export type StreamEvent =
  | { type: "token"; token: string }
  | { type: "condition"; condition: Condition }
  | { type: "severity"; severity: "mild" | "moderate" | "urgent" }
  | { type: "recommendations"; recommendations: string[] }
  | { type: "complete"; data: { conditions: Condition[]; severity: string; recommendations: string[]; confidence_score: number } }
  | { type: "error"; message: string };