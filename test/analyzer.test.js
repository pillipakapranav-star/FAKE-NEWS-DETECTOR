import assert from 'node:assert/strict';
import { HeuristicNLPAnalyzer } from '../js/analyzer/heuristicNLP.js';
import { VERDICT_CODES } from '../js/analyzer/analyzerInterface.js';
import { SAMPLE_ARTICLES } from '../js/samples.js';
import { modelManager } from '../js/analyzer/modelAdapter.js';

console.log('🧪 Starting Fake News Detection Analyzer Unit Tests...\n');

const analyzer = new HeuristicNLPAnalyzer();

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(err);
      failed++;
    }
  }

  // Test 1: Science peer-reviewed sample should be LIKELY_RELIABLE
  await test('Analyzes peer-reviewed science report as LIKELY_RELIABLE', async () => {
    const scienceSample = SAMPLE_ARTICLES.find(s => s.id === 'sample-science');
    assert.ok(scienceSample, 'Science sample must exist');

    const result = await analyzer.analyze(scienceSample.text);
    assert.equal(result.code, VERDICT_CODES.LIKELY_RELIABLE);
    assert.ok(result.confidence >= 55, `Confidence ${result.confidence} should be >= 55`);
    assert.ok(result.features.attributionScore > 20, 'Attribution score should be elevated');
    assert.ok(result.highlights.length > 0, 'Highlights should identify citations');
  });

  // Test 2: Miracle cure sensationalist clickbait should be POSSIBLY_MISLEADING
  await test('Analyzes miracle cure clickbait as POSSIBLY_MISLEADING', async () => {
    const miracleSample = SAMPLE_ARTICLES.find(s => s.id === 'sample-miracle-cure');
    assert.ok(miracleSample, 'Miracle cure sample must exist');

    const result = await analyzer.analyze(miracleSample.text);
    assert.equal(result.code, VERDICT_CODES.POSSIBLY_MISLEADING);
    assert.ok(result.confidence >= 55, `Confidence ${result.confidence} should be >= 55`);
    assert.ok(result.features.sensationalismScore > 30, 'Sensationalism score should be high');
    assert.ok(result.highlights.length > 0, 'Highlights should flag clickbait markers');
  });

  // Test 3: Insufficient / short text triggers UNABLE_TO_ASSESS
  await test('Short or ambiguous fragment triggers UNABLE_TO_ASSESS', async () => {
    const briefSample = SAMPLE_ARTICLES.find(s => s.id === 'sample-brief-fragment');
    const result = await analyzer.analyze(briefSample.text);
    assert.equal(result.code, VERDICT_CODES.UNABLE_TO_ASSESS);
    assert.ok(result.summary.toLowerCase().includes('too brief') || result.summary.toLowerCase().includes('minimal context'));
  });

  // Test 4: Economics wire report classified as LIKELY_RELIABLE
  await test('Financial journalism wire report classified as LIKELY_RELIABLE', async () => {
    const ecoSample = SAMPLE_ARTICLES.find(s => s.id === 'sample-economics');
    const result = await analyzer.analyze(ecoSample.text);
    assert.equal(result.code, VERDICT_CODES.LIKELY_RELIABLE);
    assert.ok(result.features.formalityScore >= 60, 'Formality score should be high');
  });

  // Test 5: Pluggable modelManager architecture
  await test('ModelManager supports switching providers cleanly', async () => {
    assert.equal(modelManager.activeKey, 'heuristic');
    const defaultAnalyzer = modelManager.getActiveAnalyzer();
    assert.ok(defaultAnalyzer instanceof HeuristicNLPAnalyzer);

    modelManager.setActiveProvider('transformer');
    assert.equal(modelManager.activeKey, 'transformer');
    const transformerAnalyzer = modelManager.getActiveAnalyzer();
    const result = await transformerAnalyzer.analyze('Researchers published findings in a peer-reviewed journal.');
    assert.equal(result.modelMeta.isSimulated, true);
    assert.ok(result.modelMeta.engine.includes('Transformer'));

    // Reset back to heuristic
    modelManager.setActiveProvider('heuristic');
  });

  console.log(`\n==========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
