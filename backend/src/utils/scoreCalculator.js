/**
 * Calculate lead score based on deal value, status, source, and recency.
 * Score is capped at 100.
 */
const calculateLeadScore = (lead) => {
  let score = 0;

  // Deal value scoring
  const dealValue = lead.dealValue || 0;
  if (dealValue >= 100000) {
    score += 40;
  } else if (dealValue >= 50000) {
    score += 30;
  } else if (dealValue >= 10000) {
    score += 20;
  } else {
    score += 10;
  }

  // Status scoring
  const statusScores = {
    'New': 5,
    'Contacted': 10,
    'Qualified': 20,
    'Proposal Sent': 30,
    'Won': 40,
    'Lost': 0,
  };
  score += statusScores[lead.status] || 0;

  // Lead source scoring
  const sourceScores = {
    'Referral': 15,
    'LinkedIn': 10,
    'Website': 8,
    'Event': 7,
    'Cold Email': 5,
    'Other': 3,
  };
  score += sourceScores[lead.leadSource] || 3;

  // Recency scoring (based on updatedAt)
  const now = new Date();
  const updatedAt = lead.updatedAt ? new Date(lead.updatedAt) : now;
  const daysSinceUpdate = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));

  if (daysSinceUpdate <= 7) {
    score += 10;
  } else if (daysSinceUpdate <= 14) {
    score += 5;
  }
  // 15+ days = 0 points

  // Cap at 100
  return Math.min(score, 100);
};

module.exports = { calculateLeadScore };
