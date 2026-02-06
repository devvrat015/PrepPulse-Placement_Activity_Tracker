const Activity = require('../models/Activity');

/**
 * Calculate analytics summary for a user
 * - Streak: consecutive days with >= 1 activity
 * - Weekly effort: total hours in last 7 days
 * - Activity distribution: % per type
 * - Readiness Score: 0-100 based on streak, effort, balance, interviews
 * - Weak area: least performed activity + suggestion
 */
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId }).sort({ date: 1 });

    if (activities.length === 0) {
      return res.json({
        streak: 0,
        weeklyEffort: 0,
        distribution: { DSA: 0, RESUME: 0, INTERVIEW: 0, APPLICATION: 0 },
        readinessScore: 0,
        weakArea: { type: 'ALL', suggestion: 'Start by logging any activity!' },
        totalActivities: 0,
      });
    }

    // Calculate streak
    const streak = calculateStreak(activities);

    // Calculate weekly effort (last 7 days, in hours)
    const weeklyEffort = calculateWeeklyEffort(activities);

    // Calculate distribution
    const distribution = calculateDistribution(activities);

    // Calculate readiness score
    const readinessScore = calculateReadinessScore(streak, weeklyEffort, distribution, activities);

    // Get weak area
    const weakArea = getWeakArea(distribution);

    res.json({
      streak,
      weeklyEffort: Math.round(weeklyEffort * 10) / 10,
      distribution,
      readinessScore,
      weakArea,
      totalActivities: activities.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Calculate consecutive days streak
 */
function calculateStreak(activities) {
  if (activities.length === 0) return 0;

  const dateMap = {};
  activities.forEach((activity) => {
    const dateKey = new Date(activity.date).toISOString().split('T')[0];
    dateMap[dateKey] = true;
  });

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  while (true) {
    const dateKey = currentDate.toISOString().split('T')[0];
    if (dateMap[dateKey]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate total hours in last 7 days
 */
function calculateWeeklyEffort(activities) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return activities
    .filter((activity) => new Date(activity.date) >= sevenDaysAgo)
    .reduce((sum, activity) => sum + activity.duration, 0) / 60; // Convert minutes to hours
}

/**
 * Calculate percentage distribution per activity type
 */
function calculateDistribution(activities) {
  const distribution = { DSA: 0, RESUME: 0, INTERVIEW: 0, APPLICATION: 0 };

  const typeCounts = {};
  activities.forEach((activity) => {
    typeCounts[activity.type] = (typeCounts[activity.type] || 0) + 1;
  });

  const total = activities.length;
  Object.keys(distribution).forEach((type) => {
    distribution[type] = Math.round(((typeCounts[type] || 0) / total) * 100);
  });

  return distribution;
}

/**
 * Calculate Readiness Score (0-100)
 * Based on: streak (30%), weekly effort (30%), balanced mix (20%), interview activities (20%)
 */
function calculateReadinessScore(streak, weeklyEffort, distribution, activities) {
  let score = 0;

  // Streak component (max 30 points)
  const streakScore = Math.min(30, (streak / 14) * 30);
  score += streakScore;

  // Weekly effort component (max 30 points) - target 10 hours/week
  const effortScore = Math.min(30, (weeklyEffort / 10) * 30);
  score += effortScore;

  // Balance component (max 20 points)
  // Check if all types are represented, penalize heavy skew
  let balanceScore = 0;
  if (distribution.DSA > 0) balanceScore += 5;
  if (distribution.RESUME > 0) balanceScore += 5;
  if (distribution.INTERVIEW > 0) balanceScore += 5;
  if (distribution.APPLICATION > 0) balanceScore += 5;

  // Penalize if one activity dominates (>70%)
  const max = Math.max(...Object.values(distribution));
  if (max > 70) {
    balanceScore -= (max - 70) / 10;
  }
  balanceScore = Math.max(0, Math.min(20, balanceScore));
  score += balanceScore;

  // Interview activities component (max 20 points)
  const interviewActivities = activities.filter((a) => a.type === 'INTERVIEW').length;
  const interviewScore = Math.min(20, (interviewActivities / 5) * 20);
  score += interviewScore;

  return Math.min(100, Math.round(score));
}

/**
 * Get weak area (least performed activity type)
 */
function getWeakArea(distribution) {
  const suggestions = {
    DSA: 'Focus on Data Structures & Algorithms - solve more LeetCode problems',
    RESUME: 'Improve your Resume - update with recent projects and achievements',
    INTERVIEW: 'Practice Mock Interviews - improve communication and technical explanations',
    APPLICATION: 'Apply to more companies - increase your placement chances',
  };

  const minType = Object.keys(distribution).reduce((a, b) =>
    distribution[a] < distribution[b] ? a : b
  );

  return {
    type: minType,
    suggestion: suggestions[minType],
  };
}
