/**
 * Lexicons and linguistic pattern banks for news credibility feature extraction.
 * These patterns are curated to detect stylistic signals typical of sensationalist /
 * misleading reporting versus formal, source-attributed journalistic reporting.
 */

export const SENSATIONAL_PATTERNS = [
  /\b(shocking|jaw-dropping|mind-blowing|unbelievable|miracle|secret cure|banned|hidden truth)\b/gi,
  /\b(they don'?t want you to know|what they won'?t tell you|mainstream media won'?t|wake up)\b/gi,
  /\b(bombshell|exposed|unmasked|scandal explodes|leaked confession|smoking gun)\b/gi,
  /\b(guaranteed to|100% proven|instant cure|secret revealed|miracle discovery)\b/gi,
  /\b(you won'?t believe|this will blow your mind|the truth about|destroy everything)\b/gi,
  /\b(elites are hiding|conspiracy uncovered|globalist plot|deep state secret)\b/gi,
  /\b(disaster looms|apocalypse|cataclysmic|death sentence|absolute nightmare)\b/gi
];

export const EMOTIONAL_TRIGGER_WORDS = [
  'terrifying', 'horrifying', 'catastrophic', 'outrageous', 'furious', 'evil',
  'sinister', 'bloodbath', 'panic', 'devastating', 'nightmarish', 'monstrous',
  'disgusting', 'traitor', 'treason', 'hoax', 'corrupt', 'scam', 'fraud',
  'hysteria', 'paralyzed', 'apocalyptic', 'crippling', 'carnage', 'insane'
];

export const SOURCE_ATTRIBUTION_PATTERNS = [
  /\baccording to (the|a|an|[A-Z][a-zA-Z0-9_\s]{2,20})/gi,
  /\b(reported by|stated by|confirmed by|cited by|announced by)\b/gi,
  /\b(spokesperson for|representative from|officials said|investigators found)\b/gi,
  /\b(published in (the journal|science|nature|the lancet|[A-Z][a-zA-Z\s]+))\b/gi,
  /\b(peer-reviewed (study|research|journal)|clinical trial|meta-analysis)\b/gi,
  /\b(data (collected|analyzed|published) by|survey of \d+)\b/gi,
  /\b(in an official statement|press release issued by)\b/gi,
  /\b(world health organization|reuters|associated press|bbc|bloomberg|afp)\b/gi,
  /\b(national institutes of health|centers for disease control|bureau of labor)\b/gi
];

export const OBJECTIVITY_QUALIFIERS = [
  /\b(however|preliminary findings|further research is required|margin of error)\b/gi,
  /\b(on the other hand|estimates suggest|independent verification|provisional data)\b/gi,
  /\b(some experts argue|critics note|competing hypotheses|cautioned that)\b/gi,
  /\b(peer review pending|under review|correlated with|associated with)\b/gi
];

export const FIRST_PERSON_OPINION_PATTERNS = [
  /\b(i think|in my opinion|i believe|trust me|mark my words|i know for a fact)\b/gi,
  /\b(as i always said|everyone knows that|wake up people|sheeple)\b/gi,
  /\b(we must fight|they are coming for|our only hope|share before it is taken down)\b/gi
];

export const HYPERBOLIC_ASSERTIONS = [
  /\b(everyone agrees|nobody can deny|without a doubt|undeniable fact)\b/gi,
  /\b(100% effective|zero side effects|completely cured|permanent solution)\b/gi,
  /\b(absolute proof|unequivocal certainty|undisputed truth)\b/gi
];
