/**
 * SchemeSathi AI – Matching Engine
 * Rule-based eligibility filtering + weighted scoring for scheme recommendations.
 */

function checkEligibility(scheme, profile) {
  const reasons = [];
  const failures = [];

  // Age check
  if (profile.age >= scheme.eligibility.minAge && profile.age <= scheme.eligibility.maxAge) {
    reasons.push('Your age meets the eligibility requirement');
  } else {
    failures.push(`Age must be between ${scheme.eligibility.minAge} and ${scheme.eligibility.maxAge}`);
  }

  // User type check
  if (scheme.beneficiaryType === profile.userType) {
    reasons.push(`Scheme is designed for ${profile.userType === 'entrepreneur' ? 'entrepreneurs' : 'students'}`);
  } else {
    failures.push(`This scheme is for ${scheme.beneficiaryType === 'entrepreneur' ? 'entrepreneurs' : 'students'} only`);
  }

  // Income check
  if (profile.annualIncome <= scheme.eligibility.maxIncome) {
    reasons.push('Your income falls within the eligibility limit');
  } else {
    failures.push(`Annual income must be below ₹${(scheme.eligibility.maxIncome / 100000).toFixed(1)} Lakh`);
  }

  // Project cost / course fee check
  const projectCost = profile.userType === 'student' ? (profile.courseFee || 0) : (profile.projectCost || 0);

  if (projectCost >= scheme.eligibility.minProjectCost && projectCost <= scheme.eligibility.maxProjectCost) {
    reasons.push('Your project cost matches the scheme range');
  } else if (projectCost > 0) {
    if (projectCost < scheme.eligibility.minProjectCost) {
      failures.push(`Project cost must be at least ₹${formatAmount(scheme.eligibility.minProjectCost)}`);
    } else {
      failures.push(`Project cost must not exceed ₹${formatAmount(scheme.eligibility.maxProjectCost)}`);
    }
  }

  // Loan amount check
  const requestedLoan = profile.userType === 'student' ? (profile.requiredEducationLoan || 0) : (profile.requiredLoan || 0);

  if (requestedLoan <= scheme.eligibility.maxLoan) {
    reasons.push('Your requested loan amount is within the maximum limit');
  } else {
    failures.push(`Maximum loan available is ₹${formatAmount(scheme.eligibility.maxLoan)}`);
  }

  // Business category check (for entrepreneurs)
  if (profile.userType === 'entrepreneur' && profile.businessCategory) {
    if (scheme.category.includes(profile.businessCategory)) {
      reasons.push('Your business category is supported');
    } else {
      failures.push('Business category is not supported by this scheme');
    }
  }

  // Course type check (for students)
  if (profile.userType === 'student' && scheme.eligibility.courseTypes && profile.courseType) {
    if (scheme.eligibility.courseTypes.includes(profile.courseType)) {
      reasons.push('Your course type is eligible');
    } else {
      failures.push('Course type is not covered by this scheme');
    }
  }

  // State check (if scheme has state restrictions)
  if (scheme.eligibility.states && scheme.eligibility.states.length > 0) {
    if (scheme.eligibility.states.includes(profile.state)) {
      reasons.push('Scheme is available in your state');
    } else {
      failures.push('Scheme is not available in your state');
    }
  }

  const isEligible = failures.length === 0;
  return { isEligible, reasons, failures };
}

function calculateMatchScore(scheme, profile) {
  let score = 0;
  const maxScore = 100;
  const weights = {
    userTypeMatch: 20,
    projectCostFit: 25,
    loanAmountFit: 20,
    incomeEligibility: 15,
    categoryMatch: 20
  };

  // User type match (20 points)
  if (scheme.beneficiaryType === profile.userType) {
    score += weights.userTypeMatch;
  }

  // Project cost fit (25 points) — how well the project cost fits the scheme range
  const projectCost = profile.userType === 'student' ? (profile.courseFee || 0) : (profile.projectCost || 0);
  if (projectCost > 0) {
    const range = scheme.eligibility.maxProjectCost - scheme.eligibility.minProjectCost;
    if (range > 0 && projectCost >= scheme.eligibility.minProjectCost && projectCost <= scheme.eligibility.maxProjectCost) {
      // Better score if project cost is well within range (not at extremes)
      const positionInRange = (projectCost - scheme.eligibility.minProjectCost) / range;
      // Sweet spot is 30-80% of range
      const fitScore = positionInRange >= 0.1 && positionInRange <= 0.9 ? 1.0 :
        positionInRange < 0.1 ? positionInRange / 0.1 * 0.8 :
          (1 - positionInRange) / 0.1 * 0.8;
      score += Math.round(weights.projectCostFit * fitScore);
    } else if (projectCost >= scheme.eligibility.minProjectCost && projectCost <= scheme.eligibility.maxProjectCost) {
      score += weights.projectCostFit;
    }
  }

  // Loan amount fit (20 points) — how reasonable the requested loan is
  const requestedLoan = profile.userType === 'student' ? (profile.requiredEducationLoan || 0) : (profile.requiredLoan || 0);
  if (requestedLoan > 0 && requestedLoan <= scheme.eligibility.maxLoan) {
    const loanUtilization = requestedLoan / scheme.eligibility.maxLoan;
    if (loanUtilization >= 0.3 && loanUtilization <= 0.95) {
      score += weights.loanAmountFit;
    } else if (loanUtilization < 0.3) {
      score += Math.round(weights.loanAmountFit * 0.7);
    } else {
      score += Math.round(weights.loanAmountFit * 0.85);
    }
  }

  // Income eligibility margin (15 points) — how comfortably within income limit
  if (profile.annualIncome <= scheme.eligibility.maxIncome) {
    const incomeRatio = profile.annualIncome / scheme.eligibility.maxIncome;
    if (incomeRatio <= 0.7) {
      score += weights.incomeEligibility;
    } else if (incomeRatio <= 0.9) {
      score += Math.round(weights.incomeEligibility * 0.85);
    } else {
      score += Math.round(weights.incomeEligibility * 0.65);
    }
  }

  // Category match (20 points)
  if (profile.userType === 'entrepreneur' && profile.businessCategory) {
    if (scheme.category.includes(profile.businessCategory)) {
      score += weights.categoryMatch;
    }
  } else if (profile.userType === 'student') {
    if (scheme.eligibility.courseTypes && profile.courseType && scheme.eligibility.courseTypes.includes(profile.courseType)) {
      score += weights.categoryMatch;
    } else if (!scheme.eligibility.courseTypes) {
      score += Math.round(weights.categoryMatch * 0.5);
    }
  }

  return Math.min(score, maxScore);
}

function generateRankingExplanation(score, scheme, profile) {
  const parts = [];

  if (score >= 90) {
    parts.push(`Based on your project cost, income, ${profile.userType === 'entrepreneur' ? 'business category' : 'course type'} and requested loan amount, this scheme provides the closest financial match.`);
  } else if (score >= 75) {
    parts.push(`This scheme is a strong match for your financial profile and requirements.`);
  } else if (score >= 50) {
    parts.push(`This scheme partially matches your requirements. Some parameters could be a better fit.`);
  } else {
    parts.push(`This scheme has limited alignment with your specific requirements, but you are still eligible.`);
  }

  // Add interest rate context
  if (scheme.financials.interestRate <= 8) {
    parts.push(`It offers a competitive interest rate of ${scheme.financials.interestRateDisplay}.`);
  }

  return parts.join(' ');
}

function matchSchemes(schemes, profile) {
  const results = [];

  for (const scheme of schemes) {
    const { isEligible, reasons, failures } = checkEligibility(scheme, profile);

    if (isEligible) {
      const matchScore = calculateMatchScore(scheme, profile);
      const rankingExplanation = generateRankingExplanation(matchScore, scheme, profile);

      results.push({
        scheme,
        matchScore,
        eligibilityReasons: reasons,
        rankingExplanation,
        isEligible: true
      });
    }
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  // Assign rank
  results.forEach((r, i) => {
    r.rank = i + 1;
    if (r.rank === 1) {
      r.rankingExplanation = r.rankingExplanation.replace(
        'This scheme',
        'Ranked #1 because this scheme'
      );
    }
  });

  return results;
}

function formatAmount(amount) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)} Lakh`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toString();
}

module.exports = { matchSchemes, checkEligibility, calculateMatchScore };
