import {
  BaseAnalyzer,
  VERDICT_CODES,
  formatResult
} from './analyzerInterface.js';
import {
  SENSATIONAL_PATTERNS,
  EMOTIONAL_TRIGGER_WORDS,
  SOURCE_ATTRIBUTION_PATTERNS,
  OBJECTIVITY_QUALIFIERS,
  FIRST_PERSON_OPINION_PATTERNS,
  HYPERBOLIC_ASSERTIONS
} from './lexicons.js';

export class HeuristicNLPAnalyzer extends BaseAnalyzer {
  constructor() {
    super('Veritas Heuristic NLP Engine (Simulated)', true);
  }

  /**
   * Main analysis method.
   * @param {string} text Raw news text
   * @returns {Promise<Object>} Formatted credibility analysis result
   */
  async analyze(text, options = {}) {
    const trimmed = (text || '').trim();

    // Word, character, and sentence breakdown
    const words = trimmed.match(/\b[a-zA-Z0-9'-]+\b/g) || [];
    const wordCount = words.length;
    const charCount = trimmed.length;
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = Math.max(1, sentences.length);
    const avgSentenceLength = wordCount / sentenceCount;

    const stats = {
      charCount,
      wordCount,
      sentenceCount,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10
    };

    // Edge case 1: Insufficient text length
    if (charCount < 60 || wordCount < 10) {
      return formatResult({
        code: VERDICT_CODES.UNABLE_TO_ASSESS,
        confidence: 30,
        summary: 'The submitted text is too brief to reliably analyze linguistic framing or stylistic patterns. Headlines with minimal context cannot be assessed without more supporting detail.',
        engine: this.name,
        isSimulated: this.isSimulated,
        features: {
          sensationalismScore: 10,
          emotionalIntensityScore: 10,
          attributionScore: 5,
          formalityScore: 30,
          subjectivityScore: 10,
          punctuationAnomalyScore: 0
        },
        keyFactors: [
          'Text length is under minimum linguistic threshold (60 characters / 10 words)',
          'Lacks sufficient syntactic structure for attribution or tone assessment',
          'Context is insufficient for automated stylistic evaluation'
        ],
        highlights: [],
        recommendations: [
          'Paste the full article body or at least 2-3 complete sentences for better analysis.',
          'Search the claim directly on verified fact-checking websites like Snopes or AP Fact Check.',
          'Verify if the headline links to a reputable, transparent news organization.'
        ],
        stats
      });
    }

    const highlights = [];
    const lowerText = trimmed.toLowerCase();

    // 1. Sensationalism detection
    let sensationalMatches = 0;
    SENSATIONAL_PATTERNS.forEach(pattern => {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(trimmed)) !== null) {
        sensationalMatches++;
        highlights.push({
          text: match[0],
          type: 'sensational',
          label: 'Sensational Phrase',
          index: match.index,
          length: match[0].length
        });
      }
    });

    // Hyperbolic assertions
    HYPERBOLIC_ASSERTIONS.forEach(pattern => {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(trimmed)) !== null) {
        sensationalMatches += 1.5;
        highlights.push({
          text: match[0],
          type: 'hyperbolic',
          label: 'Absolute / Hyperbolic Claim',
          index: match.index,
          length: match[0].length
        });
      }
    });

    // 2. Emotional trigger words
    let emotionalMatches = 0;
    EMOTIONAL_TRIGGER_WORDS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(trimmed)) !== null) {
        emotionalMatches++;
        highlights.push({
          text: match[0],
          type: 'emotional',
          label: 'Emotional / Alarmist Word',
          index: match.index,
          length: match[0].length
        });
      }
    });

    // 3. Source attribution and journalistic quotes
    let attributionMatches = 0;
    SOURCE_ATTRIBUTION_PATTERNS.forEach(pattern => {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(trimmed)) !== null) {
        attributionMatches++;
        highlights.push({
          text: match[0],
          type: 'attribution',
          label: 'Source Attribution / Verifiable Citation',
          index: match.index,
          length: match[0].length
        });
      }
    });

    // Direct quotes detection (e.g. "quote" or “quote”)
    const directQuotes = trimmed.match(/"([^"]{10,})"/g) || trimmed.match(/“([^”]{10,})”/g) || [];
    attributionMatches += directQuotes.length * 1.2;

    // 4. Objectivity and scientific nuance qualifiers
    let objectivityMatches = 0;
    OBJECTIVITY_QUALIFIERS.forEach(pattern => {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(trimmed)) !== null) {
        objectivityMatches++;
        highlights.push({
          text: match[0],
          type: 'nuance',
          label: 'Nuanced / Measured Qualifier',
          index: match.index,
          length: match[0].length
        });
      }
    });

    // 5. Subjectivity and First-person bias
    let subjectivityMatches = 0;
    FIRST_PERSON_OPINION_PATTERNS.forEach(pattern => {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(trimmed)) !== null) {
        subjectivityMatches += 1.5;
        highlights.push({
          text: match[0],
          type: 'subjective',
          label: 'Opinion / First-Person Marker',
          index: match.index,
          length: match[0].length
        });
      }
    });

    // 6. Punctuation anomalies (multiple '!', '?', '!?', etc.)
    const excessiveExclamations = (trimmed.match(/!{2,}/g) || []).length;
    const excessiveQuestions = (trimmed.match(/\?{2,}/g) || []).length;
    const mixedPunctuation = (trimmed.match(/[!?]{2,}/g) || []).length;
    const singleExclamations = (trimmed.match(/!/g) || []).length;
    const punctuationScore = Math.min(
      100,
      Math.round(excessiveExclamations * 25 + excessiveQuestions * 20 + mixedPunctuation * 20 + singleExclamations * 5)
    );

    // 7. Capitalization anomaly (ALL-CAPS words)
    const allowedAcronyms = new Set([
      'NASA', 'FBI', 'CIA', 'WHO', 'CDC', 'UN', 'US', 'USA', 'UK', 'EU', 'NATO', 'COVID', 'GDP', 'IMF', 'AI', 'CEO', 'FDA', 'EPA', 'NIH'
    ]);
    let allCapsCount = 0;
    words.forEach(w => {
      if (w.length > 2 && w === w.toUpperCase() && !allowedAcronyms.has(w) && !/^\d+$/.test(w)) {
        allCapsCount++;
        highlights.push({
          text: w,
          type: 'caps',
          label: 'Excessive Capitalization',
          index: trimmed.indexOf(w),
          length: w.length
        });
      }
    });

    // Normalize metrics per 100 words
    const normalizer = Math.max(1, wordCount / 100);

    const sensationalismScore = Math.min(100, Math.round((sensationalMatches / normalizer) * 28));
    const emotionalIntensityScore = Math.min(100, Math.round((emotionalMatches / normalizer) * 22));
    const attributionScore = Math.min(100, Math.round((attributionMatches / normalizer) * 35));
    const subjectivityScore = Math.min(100, Math.round((subjectivityMatches / normalizer) * 30));
    const capsAnomalyScore = Math.min(100, Math.round((allCapsCount / normalizer) * 25));

    // Formality score calculated from balanced sentence structure, attribution, and absence of slang
    const formalityScore = Math.max(
      10,
      Math.min(
        100,
        Math.round(
          70 +
          (attributionMatches * 8) +
          (objectivityMatches * 6) -
          (sensationalMatches * 10) -
          (allCapsCount * 8) -
          (punctuationScore * 0.3)
        )
      )
    );

    // Composite risk vs reliability calculation
    const misleadingSignals =
      (sensationalismScore * 0.32) +
      (emotionalIntensityScore * 0.22) +
      (punctuationScore * 0.16) +
      (capsAnomalyScore * 0.14) +
      (subjectivityScore * 0.16);

    const reliableSignals =
      (attributionScore * 0.50) +
      (formalityScore * 0.32) +
      (Math.min(40, objectivityMatches * 12) * 0.18);

    // Classification decision logic
    let verdictCode = VERDICT_CODES.UNABLE_TO_ASSESS;
    let confidence = 50;
    let summary = '';
    const keyFactors = [];

    const delta = misleadingSignals - reliableSignals;

    if (misleadingSignals >= 35 && delta > 12) {
      verdictCode = VERDICT_CODES.POSSIBLY_MISLEADING;
      confidence = Math.min(94, Math.round(55 + (delta * 0.7) + (sensationalismScore * 0.15)));
      summary = 'The text exhibits stylistic markers frequently associated with sensationalist or misleading content, such as emotionally charged language, exaggerated assertions, or an absence of transparent source attribution.';

      if (sensationalismScore > 30) keyFactors.push(`Elevated sensationalism score (${sensationalismScore}/100) with clickbait or dramatic phrasing`);
      if (emotionalIntensityScore > 30) keyFactors.push(`High density of emotive trigger vocabulary (${emotionalIntensityScore}/100) intended to evoke anxiety or outrage`);
      if (attributionScore < 20) keyFactors.push('Minimal or absent verifiable source attribution (no named researchers, journals, or official entities)');
      if (punctuationScore > 25 || capsAnomalyScore > 20) keyFactors.push('Unconventional typography (multiple exclamation points, all-caps emphasis)');
      if (subjectivityScore > 25) keyFactors.push('Frequent use of subjective, first-person framing rather than neutral third-person reporting');
    } else if (reliableSignals >= 42 && delta < -10) {
      verdictCode = VERDICT_CODES.LIKELY_RELIABLE;
      confidence = Math.min(95, Math.round(58 + (Math.abs(delta) * 0.65) + (attributionScore * 0.15)));
      summary = 'The text aligns with professional journalistic norms, displaying measured tone, formal linguistic syntax, named source attribution, and balanced qualifiers.';

      if (attributionScore > 30) keyFactors.push(`Strong source attribution (${attributionScore}/100) referencing verifiable institutions, studies, or quotes`);
      if (formalityScore > 60) keyFactors.push(`Objective journalistic structure with high linguistic formality (${formalityScore}/100)`);
      if (sensationalismScore < 15) keyFactors.push('Neutral, measured vocabulary devoid of hyperbolic superlatives or clickbait hooks');
      if (objectivityMatches > 0) keyFactors.push('Includes nuanced qualifying statements and acknowledgment of preliminary data or context');
    } else {
      verdictCode = VERDICT_CODES.UNABLE_TO_ASSESS;
      confidence = Math.round(40 + Math.random() * 15);
      summary = 'Linguistic signals are mixed or indeterminate. The text does not exhibit strong characteristic markers of either professional journalism or deliberate clickbait framing.';
      keyFactors.push('Balanced or neutral linguistic indicators without clear stylistic skew');
      keyFactors.push('Signals may be mixed (e.g., emotional discussion alongside valid references, or neutral text lacking direct sources)');
      keyFactors.push('Requires deeper external fact-checking and primary source verification');
    }

    // Recommendations
    const recommendations = [
      'Remember: This tool analyzes writing style and vocabulary, NOT whether an event physically occurred.',
      'Cross-check key claims with reputable independent news wires (Reuters, Associated Press, BBC).',
      'Look for the primary document, peer-reviewed paper, or official press briefing directly.',
      'Check if reputable fact-checking platforms (PolitiFact, Snopes, FactCheck.org) have investigated this topic.'
    ];

    // Deduplicate and sort highlights by occurrence position
    const uniqueHighlights = [];
    const seenSpans = new Set();
    highlights.sort((a, b) => a.index - b.index).forEach(h => {
      const key = `${h.index}-${h.length}`;
      if (!seenSpans.has(key)) {
        seenSpans.add(key);
        uniqueHighlights.push(h);
      }
    });

    return formatResult({
      code: verdictCode,
      confidence,
      summary,
      engine: this.name,
      isSimulated: this.isSimulated,
      features: {
        sensationalismScore,
        emotionalIntensityScore,
        attributionScore,
        formalityScore,
        subjectivityScore,
        punctuationAnomalyScore: punctuationScore
      },
      keyFactors,
      highlights: uniqueHighlights,
      recommendations,
      stats
    });
  }
}
