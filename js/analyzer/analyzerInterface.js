/**
 * Standard classification verdicts and contract for all analyzer implementations.
 * Enables drop-in replacement with real machine learning models (HuggingFace, ONNX,
 * TensorFlow.js, or backend API endpoints).
 */

export const VERDICTS = {
  LIKELY_RELIABLE: 'Likely Reliable',
  POSSIBLY_MISLEADING: 'Possibly Misleading',
  UNABLE_TO_ASSESS: 'Unable to Assess'
};

export const VERDICT_CODES = {
  LIKELY_RELIABLE: 'LIKELY_RELIABLE',
  POSSIBLY_MISLEADING: 'POSSIBLY_MISLEADING',
  UNABLE_TO_ASSESS: 'UNABLE_TO_ASSESS'
};

/**
 * Base analyzer interface. All custom or machine-learning models should extend this.
 */
export class BaseAnalyzer {
  constructor(name = 'BaseAnalyzer', isSimulated = true) {
    this.name = name;
    this.isSimulated = isSimulated;
  }

  /**
   * Analyze input text and return structured credibility assessment.
   * @param {string} text Raw text of the article or headline
   * @param {Object} options Optional configuration
   * @returns {Promise<AnalysisResult>}
   */
  async analyze(text, options = {}) {
    throw new Error('Method analyze() must be implemented by subclass');
  }
}

/**
 * Helper to validate analysis result shape.
 */
export function formatResult({
  code,
  confidence,
  summary,
  engine,
  isSimulated,
  features,
  keyFactors = [],
  highlights = [],
  recommendations = [],
  stats = {}
}) {
  return {
    code,
    verdictLabel: VERDICTS[code] || VERDICTS.UNABLE_TO_ASSESS,
    confidence: Math.min(100, Math.max(0, Math.round(confidence))),
    summary,
    modelMeta: {
      engine: engine || 'Linguistic Heuristic Engine v1.2',
      isSimulated: isSimulated !== undefined ? isSimulated : true,
      timestamp: new Date().toISOString()
    },
    features: {
      sensationalismScore: features?.sensationalismScore ?? 0,
      emotionalIntensityScore: features?.emotionalIntensityScore ?? 0,
      attributionScore: features?.attributionScore ?? 0,
      formalityScore: features?.formalityScore ?? 0,
      subjectivityScore: features?.subjectivityScore ?? 0,
      punctuationAnomalyScore: features?.punctuationAnomalyScore ?? 0
    },
    keyFactors,
    highlights,
    recommendations,
    stats
  };
}
