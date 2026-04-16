import { db } from "./client";

// User queries
export async function getUserById(id: string) {
  const result = await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function createUser(user: {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}) {
  const result = await db.query(
    `INSERT INTO users (id, email, first_name, last_name, subscription_tier)
     VALUES ($1, $2, $3, $4, 'free')
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       first_name = EXCLUDED.first_name,
       last_name = EXCLUDED.last_name,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [user.id, user.email, user.first_name || null, user.last_name || null]
  );
  return result.rows[0];
}

export async function updateUserSubscription(
  userId: string,
  tier: "free" | "premium"
) {
  const result = await db.query(
    "UPDATE users SET subscription_tier = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [tier, userId]
  );
  return result.rows[0];
}

export async function getUserUsage(userId: string) {
  // Reset daily checks if needed and return current usage
  const result = await db.query(
    `
    UPDATE users
    SET
      daily_checks_used = CASE
        WHEN subscription_tier = 'free' AND (last_check_date IS NULL OR last_check_date < CURRENT_DATE)
        THEN 0
        ELSE daily_checks_used
      END,
      last_check_date = CASE
        WHEN subscription_tier = 'free' AND (last_check_date IS NULL OR last_check_date < CURRENT_DATE)
        THEN CURRENT_DATE
        ELSE last_check_date
      END
    WHERE id = $1
    RETURNING subscription_tier, daily_checks_used, last_check_date
    `,
    [userId]
  );

  const user = result.rows[0];
  if (!user) return null;

  const remaining =
    user.subscription_tier === "premium"
      ? -1
      : 3 - (user.daily_checks_used || 0);

  return {
    subscription_tier: user.subscription_tier,
    daily_checks_used: user.daily_checks_used,
    last_check_date: user.last_check_date,
    remaining_checks: remaining,
  };
}

export async function incrementDailyCheck(userId: string) {
  const result = await db.query(
    `UPDATE users
     SET daily_checks_used = daily_checks_used + 1,
         last_check_date = COALESCE(last_check_date, CURRENT_DATE)
     WHERE id = $1
     AND (subscription_tier = 'free' AND
          (last_check_date IS NULL OR last_check_date < CURRENT_DATE OR daily_checks_used < 3))
     RETURNING daily_checks_used, last_check_date`,
    [userId]
  );
  return result.rows[0] || null;
}

// Symptom check queries
export async function createSymptomCheck(data: {
  user_id: string;
  symptoms: string;
  conditions: any[];
  severity: "mild" | "moderate" | "urgent";
  recommendations: string[];
  confidence_score: number;
}) {
  const result = await db.query(
    `INSERT INTO symptom_checks (user_id, symptoms, conditions, severity, recommendations, confidence_score)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.user_id, data.symptoms, JSON.stringify(data.conditions), data.severity, data.recommendations, data.confidence_score]
  );
  return result.rows[0];
}

export async function getSymptomHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
) {
  const result = await db.query(
    `SELECT * FROM symptom_checks
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
}

export async function getSymptomCheckById(
  userId: string,
  checkId: string
) {
  const result = await db.query(
    `SELECT * FROM symptom_checks
     WHERE id = $1 AND user_id = $2`,
    [checkId, userId]
  );
  return result.rows[0] || null;
}

export async function countSymptomChecks(userId: string) {
  const result = await db.query(
    "SELECT COUNT(*) as total FROM symptom_checks WHERE user_id = $1",
    [userId]
  );
  return parseInt(result.rows[0]?.total || "0");
}