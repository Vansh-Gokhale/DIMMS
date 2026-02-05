// AI Analysis utilities for DIMMS
// These are mock implementations - in production, these would use actual AI models

export interface ReportQualityAnalysis {
  quality: 'high' | 'medium' | 'low';
  score: number;
  issues: string[];
  suggestions: string[];
  engagementLevel: 'high' | 'medium' | 'low';
}

export interface EnhancedFeedback {
  original: string;
  enhanced: string;
  tone: 'encouraging' | 'constructive' | 'formal';
  keyPoints: string[];
}

/**
 * Analyzes a weekly report for quality and engagement
 * In production, this would use NLP and ML models
 */
export function analyzeReportQuality(
  workDone: string,
  learningOutcomes: string,
  issuesFaced: string
): ReportQualityAnalysis {
  const fullText = `${workDone} ${learningOutcomes} ${issuesFaced}`;
  const wordCount = fullText.split(/\s+/).length;
  
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check length
  if (wordCount < 50) {
    issues.push('Report is too short and lacks detail');
    suggestions.push('Provide more specific examples and details about your work');
    score -= 25;
  }

  if (wordCount < 30) {
    issues.push('Very low effort report');
    suggestions.push('Write comprehensive descriptions of your accomplishments');
    score -= 15;
  }

  // Check for repetition (mock detection)
  const words = fullText.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  let repetitionCount = 0;

  words.forEach((word) => {
    if (word.length > 4) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
      if (wordFreq[word] > 4) repetitionCount++;
    }
  });

  if (repetitionCount > 5) {
    issues.push('Content shows signs of repetition');
    suggestions.push('Vary your vocabulary and provide diverse examples');
    score -= 15;
  }

  // Check for learning outcomes
  const hasLearning =
    learningOutcomes.length > 20 &&
    (learningOutcomes.toLowerCase().includes('learned') ||
      learningOutcomes.toLowerCase().includes('understand') ||
      learningOutcomes.toLowerCase().includes('skill') ||
      learningOutcomes.toLowerCase().includes('improve'));

  if (!hasLearning) {
    suggestions.push('Clearly articulate specific skills and knowledge gained');
    score -= 10;
  }

  // Check for challenges/reflection
  const hasReflection =
    issuesFaced.length > 15 &&
    issuesFaced.toLowerCase() !== 'none' &&
    issuesFaced.toLowerCase() !== 'n/a';

  if (!hasReflection) {
    suggestions.push('Reflect on challenges faced and how you overcame them');
    score -= 5;
  }

  // Determine engagement level
  let engagementLevel: 'high' | 'medium' | 'low' = 'medium';
  if (wordCount > 200 && hasLearning && hasReflection) {
    engagementLevel = 'high';
  } else if (wordCount < 75) {
    engagementLevel = 'low';
  }

  const quality =
    score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';

  return {
    quality,
    score: Math.max(0, score),
    issues,
    suggestions,
    engagementLevel,
  };
}

/**
 * Enhances mentor feedback to be more professional and academically structured
 * In production, this would use an LLM API
 */
export function enhanceFeedback(
  bulletPoints: string,
  tone: 'encouraging' | 'constructive' | 'formal' = 'constructive'
): EnhancedFeedback {
  const points = bulletPoints
    .split('\n')
    .filter((p) => p.trim().length > 0)
    .map((p) => p.replace(/^[-•*]\s*/, '').trim());

  // Mock enhancement - in production, use Claude or similar
  let enhanced = '';

  if (tone === 'encouraging') {
    enhanced = `I'm impressed with your progress! ${
      points.length > 0
        ? `Your recent work demonstrates several strengths: `
        : ''
    }${points.map((p) => `\n• ${p}`).join('')}

To continue growing, consider focusing on these areas:
${
  points.length > 1
    ? points
        .slice(1)
        .map((p) => `• ${p}`)
        .join('\n')
    : '• Seeking feedback regularly and implementing suggestions'
}

I'm confident you'll excel with continued effort and reflection.`;
  } else if (tone === 'constructive') {
    enhanced = `Thank you for your submission. I've reviewed your work and have the following feedback:

Strengths:
${
  points.length > 0
    ? points.map((p) => `• ${p}`).join('\n')
    : '• You\'re making progress on the assigned tasks'
}

Areas for Improvement:
${
  points.length > 1
    ? points
        .slice(1)
        .map((p) => `• ${p}`)
        .join('\n')
    : `• Increase attention to detail in your deliverables
• Focus on code quality and best practices
• Document your work more thoroughly`
}

Next Steps:
• Address the feedback points in your next submission
• Schedule a 1-on-1 discussion if you need clarification`;
  } else {
    enhanced = `Re: Task Submission Review

Dear ${undefined},

Thank you for your submission. Please find my professional assessment below:

${points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

This feedback reflects the established standards and expectations for this internship program. Please incorporate these recommendations into your future work.

Best regards,
Mentor`;
  }

  return {
    original: bulletPoints,
    enhanced,
    tone,
    keyPoints: points,
  };
}

/**
 * Generates a brief AI-powered suggestion for improving a student's performance
 */
export function generatePerformanceSuggestion(
  reportsCount: number,
  avgRating: number,
  tasksCompleted: number
): string {
  if (avgRating < 2) {
    return 'The student may benefit from more structured support and regular check-ins. Consider providing additional resources or mentoring.';
  }

  if (reportsCount < 3) {
    return 'Encourage the student to maintain consistent weekly reporting to track progress effectively.';
  }

  if (tasksCompleted === 0) {
    return 'The student should prioritize completing assigned tasks to demonstrate practical skills and competency.';
  }

  if (avgRating >= 4) {
    return 'Excellent performance! Consider assigning more challenging tasks to further develop the student\'s skills.';
  }

  return 'The student is progressing well. Continue with regular feedback and provide opportunities for skill development.';
}
