export type MatchingInput = {
  applicant: { 
    skills: string[]; 
    experience: number; 
    location: string;
    education?: string;
    bio?: string;
    industry?: string;
  };
  job: { 
    requiredSkills: string[]; 
    minExperience: number; 
    location: string;
    requiredEducation?: string;
    title: string;
    description?: string;
    industry?: string;
  };
};

export type UserPreferences = {
  skills: Array<{ name: string; count: number }>;
  industries: Array<{ name: string; count: number }>;
  educationLevels: Array<{ name: string; count: number }>;
};

// Skill categories for better matching
const SKILL_CATEGORIES = {
  'programming': ['javascript', 'typescript', 'python', 'java', 'c#', 'php', 'go', 'rust', 'swift', 'kotlin'],
  'frontend': ['react', 'vue', 'angular', 'html', 'css', 'sass', 'tailwind', 'bootstrap'],
  'backend': ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net'],
  'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb'],
  'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'serverless'],
  'mobile': ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin'],
  'data': ['python', 'r', 'sql', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'machine learning', 'ai'],
  'design': ['figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'ui/ux', 'wireframing'],
  'management': ['agile', 'scrum', 'kanban', 'project management', 'leadership', 'team management'],
  'communication': ['english', 'german', 'presentation', 'writing', 'negotiation']
};

// Location proximity scoring
const LOCATION_PROXIMITY = {
  'berlin': ['brandenburg', 'potsdam'],
  'münchen': ['bayern', 'augsburg', 'nürnberg'],
  'hamburg': ['schleswig-holstein', 'bremen'],
  'köln': ['düsseldorf', 'essen', 'dortmund', 'nrw'],
  'frankfurt': ['wiesbaden', 'mainz', 'darmstadt'],
  'stuttgart': ['baden-württemberg', 'karlsruhe', 'freiburg'],
  'remote': ['berlin', 'münchen', 'hamburg', 'köln', 'frankfurt', 'stuttgart']
};

// Remote work flexibility scoring
const REMOTE_FLEXIBILITY = {
  'hybrid': 0.8,      // Hybrid work is flexible
  'flexible': 0.9,    // Flexible work arrangements
  'home office': 0.85, // Home office preference
  'teilzeit': 0.7     // Part-time can be remote-friendly
};

// Education hierarchy for matching
const EDUCATION_LEVELS: { [key: string]: number } = {
  'keine angabe': 0,
  'hauptschulabschluss': 1,
  'realschulabschluss': 2,
  'abitur': 3,
  'bachelor': 4,
  'master': 5,
  'promotion': 6
};

export function computeMatchingScore({ applicant, job }: MatchingInput): number {
  // Location is now handled by UI filter, not in scoring
  
  // 1. Education Matching (Most critical - often mandatory)
  const educationScore = computeEducationScore(applicant.education, job.requiredEducation);
  
  // 2. Skills Matching (Very important but trainable)
  const skillsScore = computeSkillsScore(applicant.skills, job.requiredSkills);
  
  // 3. Experience Matching (Important for role fit)
  const experienceScore = computeExperienceScore(applicant.experience, job.minExperience);
  
  // 4. Industry Alignment (Bonus factor)
  const industryScore = computeIndustryScore(applicant.industry, job.industry);
  
  // Weighted combination - location removed (handled by filter)
  const total = 
    educationScore * 0.35 +    // Education is critical (Bachelor minimum often required)
    skillsScore * 0.30 +       // Skills are very important but trainable
    experienceScore * 0.25 +   // Experience matters significantly
    industryScore * 0.10;      // Industry alignment is a nice bonus
  
  return Math.round(total * 1000) / 10; // percentage with 0.1 precision
}

function computeSkillsScore(applicantSkills: string[], requiredSkills: string[]): number {
  const aSkills = new Set(applicantSkills.map(s => s.trim().toLowerCase()).filter(Boolean));
  const jSkills = new Set(requiredSkills.map(s => s.trim().toLowerCase()).filter(Boolean));
  
  if (jSkills.size === 0) return 1;
  
  let exactMatches = 0;
  let categoryMatches = 0;
  let partialMatches = 0;
  
  for (const requiredSkill of jSkills) {
    if (aSkills.has(requiredSkill)) {
      exactMatches++;
    } else {
      // Check for category matches
      const categoryMatch = findCategoryMatch(requiredSkill, aSkills);
      if (categoryMatch) {
        categoryMatches++;
      } else {
        // Check for partial matches (substring)
        const partialMatch = findPartialMatch(requiredSkill, aSkills);
        if (partialMatch) {
          partialMatches++;
        }
      }
    }
  }
  
  // Weighted scoring: exact matches = 1.0, category = 0.7, partial = 0.4
  const totalScore = exactMatches + (categoryMatches * 0.7) + (partialMatches * 0.4);
  return Math.min(totalScore / jSkills.size, 1);
}

function findCategoryMatch(skill: string, applicantSkills: Set<string>): boolean {
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    if (skills.includes(skill)) {
      return skills.some(s => applicantSkills.has(s));
    }
  }
  return false;
}

function findPartialMatch(skill: string, applicantSkills: Set<string>): boolean {
  for (const applicantSkill of applicantSkills) {
    if (skill.includes(applicantSkill) || applicantSkill.includes(skill)) {
      return true;
    }
  }
  return false;
}

function computeExperienceScore(applicantExp: number, minExp: number): number {
  if (applicantExp >= minExp) {
    // Bonus for having more experience than required (up to a point)
    const excessExp = Math.min(applicantExp - minExp, 5); // Cap bonus at 5 years
    return Math.min(1 + (excessExp * 0.1), 1.3); // Max 30% bonus
  } else {
    // Penalty for insufficient experience
    return Math.max(applicantExp / Math.max(1, minExp), 0.1);
  }
}

function computeEducationScore(applicantEducation?: string, requiredEducation?: string): number {
  // If job requires no education, everyone passes
  if (!requiredEducation || requiredEducation.toLowerCase() === 'keine angabe') {
    return 1.0; // 100% - no requirement
  }
  
  // If applicant has no education info, neutral score
  if (!applicantEducation) {
    return 0.5; // 50% - unknown
  }
  
  const applicantLevel = EDUCATION_LEVELS[applicantEducation.toLowerCase()] ?? 0;
  const requiredLevel = EDUCATION_LEVELS[requiredEducation.toLowerCase()] ?? 0;
  
  // If applicant meets or exceeds requirement
  if (applicantLevel >= requiredLevel) {
    return 1.0; // 100% - qualified or overqualified
  }
  
  // Calculate gap (how many levels below requirement)
  const gap = requiredLevel - applicantLevel;
  
  if (gap === 1) {
    return 0.6; // 60% - one level below (e.g., Abitur vs Bachelor)
  } else if (gap === 2) {
    return 0.2; // 20% - two levels below (e.g., Abitur vs Master)
  } else {
    return 0.05; // 5% - three or more levels below (major gap)
  }
}

function computeLocationScore(applicantLocation: string, jobLocation: string): number {
  const applicant = applicantLocation.trim().toLowerCase();
  const job = jobLocation.trim().toLowerCase();
  
  if (applicant === job) return 1;
  
  // Check for proximity
  for (const [city, nearby] of Object.entries(LOCATION_PROXIMITY)) {
    if (job === city && nearby.some(n => applicant.includes(n))) {
      return 0.8; // Nearby location
    }
    if (applicant === city && nearby.some(n => job.includes(n))) {
      return 0.8;
    }
  }
  
  // Remote work compatibility
  if (job === 'remote' && applicant === 'remote') {
    return 1.0; // Perfect match - both want remote
  }
  if (job === 'remote' || applicant === 'remote') {
    return 0.9; // One is remote - still very compatible
  }
  
  // Check for remote work flexibility keywords
  for (const [keyword, score] of Object.entries(REMOTE_FLEXIBILITY)) {
    if (applicant.includes(keyword) || job.includes(keyword)) {
      return Math.max(score, 0.7); // At least 70% for remote-friendly terms
    }
  }
  
  return 0.1; // Different locations
}

function computeIndustryScore(applicantIndustry?: string, jobIndustry?: string): number {
  if (!applicantIndustry || !jobIndustry) return 0.5; // Neutral if unknown
  
  const applicant = applicantIndustry.toLowerCase();
  const job = jobIndustry.toLowerCase();
  
  if (applicant === job) return 1;
  
  // Related industries
  const relatedIndustries: { [key: string]: string[] } = {
    'it & software': ['fintech', 'e-commerce', 'gaming', 'telekommunikation'],
    'finanzwesen': ['fintech', 'banking', 'insurance', 'cryptocurrency'],
    'gesundheitswesen': ['pharma', 'biotech', 'medical devices'],
    'e-commerce': ['retail', 'logistics', 'marketing'],
    'automotive': ['manufacturing', 'engineering', 'logistics']
  };
  
  for (const [industry, related] of Object.entries(relatedIndustries)) {
    if ((applicant === industry && related.includes(job)) || 
        (job === industry && related.includes(applicant))) {
      return 0.7;
    }
  }
  
  return 0.3; // Different industries
}

function computeKeywordScore(bio?: string, jobTitle?: string, jobDescription?: string): number {
  if (!bio || (!jobTitle && !jobDescription)) return 0.5;
  
  const bioWords = bio.toLowerCase().split(/\s+/);
  const jobText = `${jobTitle || ''} ${jobDescription || ''}`.toLowerCase();
  const jobWords = jobText.split(/\s+/);
  
  // Find common meaningful words (longer than 3 characters)
  const meaningfulWords = jobWords.filter(word => word.length > 3);
  const matches = meaningfulWords.filter(word => bioWords.includes(word));
  
  return Math.min(matches.length / Math.max(meaningfulWords.length, 1), 1);
}

function computeLevelScore(applicantExp: number, minExp: number, jobTitle: string): number {
  if (!jobTitle) return 0.5; // Neutral score if no title
  const title = jobTitle.toLowerCase();
  
  // Determine expected experience level from job title
  let expectedLevel = minExp;
  if (title.includes('senior') || title.includes('lead') || title.includes('principal')) {
    expectedLevel = Math.max(minExp, 5);
  } else if (title.includes('junior') || title.includes('entry') || title.includes('trainee')) {
    expectedLevel = Math.max(minExp, 0);
  } else if (title.includes('manager') || title.includes('director') || title.includes('head')) {
    expectedLevel = Math.max(minExp, 7);
  }
  
  // Score based on how well experience matches expected level
  if (applicantExp >= expectedLevel) {
    return 1;
  } else {
    return Math.max(applicantExp / Math.max(1, expectedLevel), 0.2);
  }
}

export function isPassing(scorePercent: number): boolean {
  return scorePercent >= 50; // Lowered threshold for better matching
}

// Function to get detailed matching breakdown
export function getMatchingBreakdown({ applicant, job }: MatchingInput) {
  return {
    education: computeEducationScore(applicant.education, job.requiredEducation),
    skills: computeSkillsScore(applicant.skills, job.requiredSkills),
    experience: computeExperienceScore(applicant.experience, job.minExperience),
    industry: computeIndustryScore(applicant.industry, job.industry),
    total: computeMatchingScore({ applicant, job })
  };
}

// ============================================
// PREFERENCE BOOSTING SYSTEM
// ============================================

/**
 * Computes preference-based boost for a job based on user's historical preferences
 * @param job - The job to score
 * @param preferences - User's preferences from analytics
 * @returns Boost factor (1.0 = no boost, 1.10 = max 10% boost)
 */
export function computePreferenceBoost(
  job: { requiredSkills: string[]; industry?: string; requiredEducation?: string },
  preferences: UserPreferences | null
): number {
  if (!preferences) return 1.0; // No boost if no preferences data
  
  // 1. Skills Match (60% weight)
  const skillsMatch = computePreferenceSkillsMatch(job.requiredSkills, preferences.skills);
  
  // 2. Industry Match (25% weight)
  const industryMatch = computePreferenceIndustryMatch(job.industry, preferences.industries);
  
  // 3. Education Match (15% weight)
  const educationMatch = computePreferenceEducationMatch(job.requiredEducation, preferences.educationLevels);
  
  // Calculate weighted preference score (0-1)
  let preferenceScore = 
    skillsMatch * 0.60 +
    industryMatch * 0.25 +
    educationMatch * 0.15;
  
  // Apply skill count penalty to prevent simple jobs from getting too much boost
  // Jobs with fewer skills get less boost (prevents overqualified matches)
  const skillCountPenalty = computeSkillCountPenalty(job.requiredSkills.length);
  preferenceScore = preferenceScore * skillCountPenalty;
  
  // Convert to boost factor (max 10% boost, reduced from 15%)
  const boostFactor = 1 + (preferenceScore * 0.10);
  
  return boostFactor;
}

/**
 * Computes penalty based on number of required skills
 * Prevents simple jobs (1-2 skills) from getting disproportionate boost
 * @param skillCount - Number of required skills
 * @returns Penalty factor (0.3 to 1.0)
 */
function computeSkillCountPenalty(skillCount: number): number {
  if (skillCount <= 2) {
    return 0.3; // Only 30% of boost for very simple jobs (1-2 skills)
  } else if (skillCount <= 4) {
    return 0.6; // 60% of boost for simple jobs (3-4 skills)
  } else {
    return 1.0; // Full boost for complex jobs (5+ skills)
  }
}

/**
 * Computes how well job skills match user's preferred skills
 * @returns Score from 0 to 1
 */
function computePreferenceSkillsMatch(
  jobSkills: string[],
  preferredSkills: Array<{ name: string; count: number }>
): number {
  if (jobSkills.length === 0 || preferredSkills.length === 0) return 0;
  
  // Get top 5 preferred skills (normalized to lowercase)
  // Only top 5 to be selective (out of 20 total skills in system)
  const topPreferredSkills = new Set(
    preferredSkills.slice(0, 5).map(s => s.name.toLowerCase())
  );
  
  // Count how many job skills are in preferred skills
  const matchingSkills = jobSkills.filter(skill => 
    topPreferredSkills.has(skill.toLowerCase())
  );
  
  // Return percentage of job skills that match preferences
  return matchingSkills.length / jobSkills.length;
}

/**
 * Computes if job industry is in user's top 3 preferred industries
 * @returns 1.0 if in top 3, 0 otherwise (binary)
 */
function computePreferenceIndustryMatch(
  jobIndustry: string | undefined,
  preferredIndustries: Array<{ name: string; count: number }>
): number {
  if (!jobIndustry || preferredIndustries.length === 0) return 0;
  
  // Get top 3 preferred industries (normalized)
  const top3Industries = preferredIndustries
    .slice(0, 3)
    .map(i => i.name.toLowerCase());
  
  // Binary: either in top 3 (100%) or not (0%)
  return top3Industries.includes(jobIndustry.toLowerCase()) ? 1.0 : 0;
}

/**
 * Computes if job education level is in user's top 3 preferred education levels
 * @returns 1.0 if in top 3, 0 otherwise (binary)
 */
function computePreferenceEducationMatch(
  jobEducation: string | undefined,
  preferredEducations: Array<{ name: string; count: number }>
): number {
  if (!jobEducation || preferredEducations.length === 0) return 0;
  
  // Get top 3 preferred education levels (normalized)
  const top3Educations = preferredEducations
    .slice(0, 3)
    .map(e => e.name.toLowerCase());
  
  // Binary: either in top 3 (100%) or not (0%)
  return top3Educations.includes(jobEducation.toLowerCase()) ? 1.0 : 0;
}

/**
 * Applies preference boost to base matching score
 * @param baseScore - The base matching score (0-100)
 * @param boostFactor - The boost factor from preferences (1.0-1.10)
 * @returns Final score capped at 100
 */
export function applyPreferenceBoost(baseScore: number, boostFactor: number): number {
  const boostedScore = baseScore * boostFactor;
  return Math.min(boostedScore, 100); // Cap at 100%
}
