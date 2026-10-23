import { BaseAnalyzer, VERDICT_CODES, formatResult } from './analyzerInterface.js';
import { HeuristicNLPAnalyzer } from './heuristicNLP.js';

/**
 * Simulated Transformer Deep Learning Model (e.g. RoBERTa / DeBERTa fine-tuned on LIAR/FakeNewsNet).
 * Useful for demonstrating how a machine learning model pipeline interfaces with the UI.
 */
export class SimulatedTransformerAnalyzer extends BaseAnalyzer {
  constructor() {
    super('RoBERTa-News-Credibility-v2 (Simulated Transformer)', true);
  }

  async analyze(text, options = {}) {
    // Simulate neural inference network latency (350ms - 750ms)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Leverage heuristic feature extraction as foundational embeddings
    const fallback = new HeuristicNLPAnalyzer();
    const result = await fallback.analyze(text, options);

    return {
      ...result,
      modelMeta: {
        engine: this.name,
        isSimulated: true,
        architecture: 'Transformer (12-layer, 768-hidden, fine-tuned)',
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Real Remote API Analyzer adapter.
 * Connects to any custom REST or Hugging Face Inference API endpoint.
 * Expects or converts standard API responses.
 */
export class RemoteAPIAnalyzer extends BaseAnalyzer {
  constructor(endpointUrl = '', apiKey = '') {
    super('Remote Production NLP Service', false);
    this.endpointUrl = endpointUrl;
    this.apiKey = apiKey;
  }

  setEndpoint(url, apiKey = '') {
    this.endpointUrl = url;
    this.apiKey = apiKey;
  }

  async analyze(text, options = {}) {
    if (!this.endpointUrl) {
      throw new Error('No remote API endpoint configured. Please provide a valid URL.');
    }

    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(this.endpointUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, options })
    });

    if (!response.ok) {
      throw new Error(`Remote NLP server returned error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Map external API response to standard schema
    return formatResult({
      code: data.code || VERDICT_CODES.UNABLE_TO_ASSESS,
      confidence: data.confidence || 50,
      summary: data.summary || 'Analysis returned by remote NLP service.',
      engine: `External API (${this.endpointUrl})`,
      isSimulated: false,
      features: data.features || {},
      keyFactors: data.keyFactors || ['Analysis conducted via external remote model.'],
      highlights: data.highlights || [],
      recommendations: data.recommendations || [
        'Always independently corroborate claims with primary sources and independent news bureaus.'
      ],
      stats: data.stats || {}
    });
  }
}

/**
 * ModelManager singleton to manage switching between heuristic, simulated neural,
 * and remote production models cleanly.
 */
class ModelManager {
  constructor() {
    this.providers = {
      heuristic: new HeuristicNLPAnalyzer(),
      transformer: new SimulatedTransformerAnalyzer(),
      remote: new RemoteAPIAnalyzer()
    };
    this.activeKey = 'heuristic';
    this.listeners = [];
  }

  getActiveAnalyzer() {
    return this.providers[this.activeKey] || this.providers.heuristic;
  }

  setActiveProvider(key) {
    if (this.providers[key]) {
      this.activeKey = key;
      this.notify();
    }
  }

  configureRemote(url, apiKey = '') {
    this.providers.remote.setEndpoint(url, apiKey);
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    const active = this.getActiveAnalyzer();
    this.listeners.forEach(cb => cb({ key: this.activeKey, analyzer: active }));
  }
}

export const modelManager = new ModelManager();
