const natural = require('natural');
const logger = require('../utils/logger');

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer('English', stemmer, 'afinn');

// Clickbait patterns
const CLICKBAIT_PATTERNS = [
  /you won't believe/i,
  /shocking/i,
  /mind-blowing/i,
  /what happens next/i,
  /this is why/i,
  /the truth about/i,
  /exposed/i,
  /secret/i,
  /they don't want you to know/i,
  /breaking/i,
  /urgent/i,
  /alert/i,
  /you need to see this/i,
  /unbelievable/i,
  /jaw-dropping/i,
  /insane/i,
  /gone wrong/i,
  /will blow your mind/i,
];

const EMOTIONAL_WORDS = [
  'outrage', 'fury', 'terrifying', 'devastating', 'horrifying',
  'incredible', 'amazing', 'disgusting', 'evil', 'destroy',
  'catastrophe', 'crisis', 'panic', 'fear', 'hate', 'love',
  'miracle', 'nightmare', 'scandal', 'chaos', 'explosive',
  'bombshell', 'slam', 'blast', 'rip', 'savage',
];

class NLPAnalyzer {
  /**
   * Analyze text for fake news indicators using NLP techniques
   */
  static analyze(text) {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    const sentimentScore = this.analyzeSentiment(tokens);
    const subjectivityScore = this.analyzeSubjectivity(tokens, text);
    const hasClickbait = this.detectClickbait(text);
    const hasEmotionalLanguage = this.detectEmotionalLanguage(tokens);
    const hasSourceAttribution = this.detectSourceAttribution(text);
    const hasStatisticalClaims = this.detectStatisticalClaims(text);
    const readabilityScore = this.calculateReadability(text, sentences, tokens);

    // Composite credibility score (0-100)
    let credibilityScore = 50; // baseline

    // Sentiment extremity reduces credibility
    const sentimentExtremity = Math.abs(sentimentScore);
    credibilityScore -= sentimentExtremity * 10;

    // High subjectivity reduces credibility
    credibilityScore -= subjectivityScore * 20;

    // Clickbait reduces credibility significantly
    if (hasClickbait) credibilityScore -= 15;

    // Emotional language reduces credibility
    if (hasEmotionalLanguage) credibilityScore -= 10;

    // Source attribution increases credibility
    if (hasSourceAttribution) credibilityScore += 15;

    // Statistical claims with sources increase credibility
    if (hasStatisticalClaims && hasSourceAttribution) credibilityScore += 10;

    // Very short articles are less credible
    if (tokens.length < 50) credibilityScore -= 10;

    // Normalize to 0-100
    credibilityScore = Math.max(0, Math.min(100, credibilityScore));

    // Determine prediction
    let label, confidence;
    if (credibilityScore >= 60) {
      label = 'REAL';
      confidence = Math.min(95, credibilityScore + 10);
    } else if (credibilityScore <= 35) {
      label = 'FAKE';
      confidence = Math.min(95, (100 - credibilityScore) + 5);
    } else {
      label = 'UNCERTAIN';
      confidence = 50 + Math.abs(credibilityScore - 50);
    }

    return {
      label,
      confidence: Math.round(confidence * 100) / 100,
      details: {
        sentimentScore: Math.round(sentimentScore * 1000) / 1000,
        subjectivityScore: Math.round(subjectivityScore * 1000) / 1000,
        credibilityIndicators: {
          hasClickbait,
          hasEmotionalLanguage,
          hasSourceAttribution,
          hasStatisticalClaims,
          readabilityScore: Math.round(readabilityScore * 100) / 100,
        },
      },
    };
  }

  static analyzeSentiment(tokens) {
    if (tokens.length === 0) return 0;
    const score = analyzer.getSentiment(tokens);
    return Math.max(-1, Math.min(1, score));
  }

  static analyzeSubjectivity(tokens, text) {
    const opinionWords = [
      'think', 'believe', 'feel', 'opinion', 'seems', 'appears',
      'might', 'could', 'perhaps', 'maybe', 'probably', 'obviously',
      'clearly', 'definitely', 'absolutely', 'certainly', 'undoubtedly',
    ];
    const opinionCount = tokens.filter((t) => opinionWords.includes(t)).length;

    // First person pronouns indicate subjectivity
    const firstPersonCount = tokens.filter((t) =>
      ['i', 'me', 'my', 'mine', 'we', 'our', 'ours'].includes(t)
    ).length;

    const exclamationCount = (text.match(/!/g) || []).length;
    const capsWordCount = text
      .split(/\s+/)
      .filter((w) => w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w)).length;

    const totalIndicators =
      opinionCount * 2 + firstPersonCount + exclamationCount + capsWordCount * 2;
    const normalizedScore = totalIndicators / Math.max(tokens.length, 1);

    return Math.min(1, normalizedScore * 5);
  }

  static detectClickbait(text) {
    return CLICKBAIT_PATTERNS.some((pattern) => pattern.test(text));
  }

  static detectEmotionalLanguage(tokens) {
    const emotionalCount = tokens.filter((t) =>
      EMOTIONAL_WORDS.includes(t)
    ).length;
    return emotionalCount >= 2 || emotionalCount / tokens.length > 0.03;
  }

  static detectSourceAttribution(text) {
    const sourcePatterns = [
      /according to/i,
      /reported by/i,
      /sources say/i,
      /study (shows|finds|suggests)/i,
      /research (shows|finds|suggests)/i,
      /officials? (said|stated|confirmed)/i,
      /spokesperson/i,
      /press release/i,
      /published in/i,
      /university of/i,
      /institute of/i,
      /department of/i,
    ];
    return sourcePatterns.some((p) => p.test(text));
  }

  static detectStatisticalClaims(text) {
    const statPatterns = [
      /\d+(\.\d+)?%/,
      /\d+ (percent|per cent)/i,
      /\d+ out of \d+/i,
      /survey of \d+/i,
      /\$[\d,.]+/,
      /\d+ (million|billion|trillion)/i,
    ];
    return statPatterns.some((p) => p.test(text));
  }

  static calculateReadability(text, sentences, tokens) {
    if (sentences.length === 0 || tokens.length === 0) return 0;
    const avgSentenceLength = tokens.length / sentences.length;
    const syllableCount = tokens.reduce(
      (sum, word) => sum + this.countSyllables(word),
      0
    );
    const avgSyllables = syllableCount / tokens.length;

    // Flesch Reading Ease (simplified)
    const score = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllables;
    return Math.max(0, Math.min(100, score));
  }

  static countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }
}

module.exports = NLPAnalyzer;
