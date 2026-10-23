import { SAMPLE_ARTICLES } from './samples.js';
import { modelManager } from './analyzer/modelAdapter.js';
import { VERDICT_CODES } from './analyzer/analyzerInterface.js';

// DOM Element References
const articleInput = document.getElementById('articleInput');
const charCountEl = document.getElementById('charCount');
const wordCountEl = document.getElementById('wordCount');
const sentenceCountEl = document.getElementById('sentenceCount');
const readingTimeEl = document.getElementById('readingTime');

const pasteBtn = document.getElementById('pasteBtn');
const clearBtn = document.getElementById('clearBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeSpinner = document.getElementById('analyzeSpinner');
const analyzeIcon = document.getElementById('analyzeIcon');
const analyzeBtnText = document.getElementById('analyzeBtnText');

const sampleChipsContainer = document.getElementById('sampleChipsContainer');
const resultsPlaceholder = document.getElementById('resultsPlaceholder');
const resultsContent = document.getElementById('resultsContent');
const analysisTimestamp = document.getElementById('analysisTimestamp');

// Verdict Card Elements
const verdictCard = document.getElementById('verdictCard');
const verdictIconWrap = document.getElementById('verdictIconWrap');
const verdictLabel = document.getElementById('verdictLabel');
const gaugeProgressPath = document.getElementById('gaugeProgressPath');
const gaugePercentage = document.getElementById('gaugePercentage');
const verdictSummary = document.getElementById('verdictSummary');
const modelMetaEngine = document.getElementById('modelMetaEngine');

// Feature Meters
const scoreSensationalism = document.getElementById('scoreSensationalism');
const barSensationalism = document.getElementById('barSensationalism');
const scoreEmotional = document.getElementById('scoreEmotional');
const barEmotional = document.getElementById('barEmotional');
const scoreAttribution = document.getElementById('scoreAttribution');
const barAttribution = document.getElementById('barAttribution');
const scoreFormality = document.getElementById('scoreFormality');
const barFormality = document.getElementById('barFormality');
const scoreSubjectivity = document.getElementById('scoreSubjectivity');
const barSubjectivity = document.getElementById('barSubjectivity');
const scorePunctuation = document.getElementById('scorePunctuation');
const barPunctuation = document.getElementById('barPunctuation');

// Factors & Annotations
const factorsList = document.getElementById('factorsList');
const highlightCountLabel = document.getElementById('highlightCountLabel');
const annotatedTextViewer = document.getElementById('annotatedTextViewer');
const recommendationsList = document.getElementById('recommendationsList');

// Header & Settings Modal Elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIconDark = document.getElementById('themeIconDark');
const themeIconLight = document.getElementById('themeIconLight');
const engineStatusBtn = document.getElementById('engineStatusBtn');
const engineStatusLabel = document.getElementById('engineStatusLabel');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsModal = document.getElementById('settingsModal');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const modelOptionCards = document.querySelectorAll('.model-option-card');
const remoteApiConfig = document.getElementById('remoteApiConfig');
const remoteUrlInput = document.getElementById('remoteUrlInput');
const remoteKeyInput = document.getElementById('remoteKeyInput');
const toastContainer = document.getElementById('toastContainer');

// State
let selectedModelKey = 'heuristic';

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderDemoSamples();
  setupEventListeners();
  updateTextMetrics();
});

// --------------------------------------------------------------------------
// Theme Handling (Light / Dark)
// --------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('veritas_theme') || 'dark';
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('veritas_theme', theme);

  if (theme === 'light') {
    themeIconDark.style.display = 'none';
    themeIconLight.style.display = 'block';
  } else {
    themeIconDark.style.display = 'block';
    themeIconLight.style.display = 'none';
  }
}

// --------------------------------------------------------------------------
// Demo Samples
// --------------------------------------------------------------------------
function renderDemoSamples() {
  sampleChipsContainer.innerHTML = '';

  SAMPLE_ARTICLES.forEach(sample => {
    const chip = document.createElement('button');
    chip.className = 'sample-chip';
    chip.setAttribute('type', 'button');
    chip.setAttribute('aria-label', `Load sample: ${sample.title}`);
    chip.innerHTML = `
      <span class="sample-chip-title">${escapeHtml(sample.title)}</span>
      <span class="sample-chip-badge ${sample.badgeClass}">${sample.expectedVerdict}</span>
    `;

    chip.addEventListener('click', () => {
      // Highlight active chip
      document.querySelectorAll('.sample-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      // Populate text
      articleInput.value = sample.text;
      updateTextMetrics();
      showToast(`Loaded demo: "${sample.title}"`, 'info');

      // Auto-trigger analysis for quick demo experience
      runAnalysis();
    });

    sampleChipsContainer.appendChild(chip);
  });
}

// --------------------------------------------------------------------------
// Text Metrics Calculator
// --------------------------------------------------------------------------
function updateTextMetrics() {
  const text = articleInput.value || '';
  const trimmed = text.trim();
  const charLength = text.length;

  const words = trimmed.length > 0 ? (trimmed.match(/\b\S+\b/g) || []) : [];
  const wordCount = words.length;

  const sentences = trimmed.length > 0 ? (trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0)) : [];
  const sentenceCount = sentences.length;

  // Average reading speed: ~200 wpm
  const readingTimeMin = Math.ceil(wordCount / 200);

  charCountEl.textContent = charLength.toLocaleString();
  wordCountEl.textContent = wordCount.toLocaleString();
  sentenceCountEl.textContent = sentenceCount.toLocaleString();
  readingTimeEl.textContent = wordCount > 0 ? `${readingTimeMin} min` : '0 min';

  // Toggle button states
  const hasContent = trimmed.length > 0;
  clearBtn.disabled = !hasContent;
  analyzeBtn.disabled = !hasContent;
}

// --------------------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------------------
function setupEventListeners() {
  // Live input updates
  articleInput.addEventListener('input', updateTextMetrics);

  // Clear button
  clearBtn.addEventListener('click', () => {
    articleInput.value = '';
    document.querySelectorAll('.sample-chip').forEach(c => c.classList.remove('active'));
    updateTextMetrics();
    articleInput.focus();
    showToast('Input cleared', 'default');
  });

  // Paste button
  pasteBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          articleInput.value = clipText;
          updateTextMetrics();
          showToast('Pasted from clipboard', 'success');
          return;
        }
      }
      throw new Error('Clipboard access unavailable');
    } catch {
      // Fallback
      const manual = prompt('Paste your news text or headline below:');
      if (manual) {
        articleInput.value = manual;
        updateTextMetrics();
        showToast('Text loaded', 'success');
      }
    }
  });

  // Analyze button
  analyzeBtn.addEventListener('click', () => {
    runAnalysis();
  });

  // Model settings modal triggers
  engineStatusBtn.addEventListener('click', openSettings);
  openSettingsBtn.addEventListener('click', openSettings);
  closeSettingsBtn.addEventListener('click', closeSettings);

  settingsModal.addEventListener('click', e => {
    if (e.target === settingsModal) closeSettings();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && settingsModal.classList.contains('open')) {
      closeSettings();
    }
  });

  // Model selection options in modal
  modelOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      modelOptionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedModelKey = card.getAttribute('data-model');

      if (selectedModelKey === 'remote') {
        remoteApiConfig.style.display = 'block';
      } else {
        remoteApiConfig.style.display = 'none';
      }
    });
  });

  // Save Settings
  saveSettingsBtn.addEventListener('click', () => {
    if (selectedModelKey === 'remote') {
      const url = remoteUrlInput.value.trim();
      if (!url) {
        showToast('Please provide a valid remote endpoint URL.', 'error');
        return;
      }
      modelManager.configureRemote(url, remoteKeyInput.value.trim());
      modelManager.setActiveProvider('remote');
      engineStatusLabel.textContent = 'Remote API Engine';
    } else if (selectedModelKey === 'transformer') {
      modelManager.setActiveProvider('transformer');
      engineStatusLabel.textContent = 'RoBERTa Transformer (Simulated)';
    } else {
      modelManager.setActiveProvider('heuristic');
      engineStatusLabel.textContent = 'Heuristic NLP (Simulated Demo)';
    }

    closeSettings();
    showToast(`Active engine updated: ${engineStatusLabel.textContent}`, 'success');

    // Re-run analysis if input has content
    if (articleInput.value.trim()) {
      runAnalysis();
    }
  });
}

function openSettings() {
  settingsModal.classList.add('open');
}

function closeSettings() {
  settingsModal.classList.remove('open');
}

// --------------------------------------------------------------------------
// Run Credibility Analysis
// --------------------------------------------------------------------------
async function runAnalysis() {
  const text = articleInput.value.trim();
  if (!text) return;

  // Set UI loading state
  setLoadingState(true);

  try {
    const analyzer = modelManager.getActiveAnalyzer();
    const result = await analyzer.analyze(text);

    renderResults(result, text);
    showToast('Analysis completed', 'success');

    // On mobile view, scroll results into view smoothly
    if (window.innerWidth <= 1024) {
      resultsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (error) {
    console.error('Analysis failed:', error);
    showToast(`Error analyzing text: ${error.message || 'Unknown error'}`, 'error');
  } finally {
    setLoadingState(false);
  }
}

function setLoadingState(isLoading) {
  analyzeBtn.disabled = isLoading;
  pasteBtn.disabled = isLoading;
  clearBtn.disabled = isLoading;

  if (isLoading) {
    analyzeIcon.style.display = 'none';
    analyzeSpinner.style.display = 'inline-block';
    analyzeBtnText.textContent = 'Analyzing...';
  } else {
    analyzeSpinner.style.display = 'none';
    analyzeIcon.style.display = 'inline-block';
    analyzeBtnText.textContent = 'Analyze Credibility';
  }
}

// --------------------------------------------------------------------------
// Render Results Dashboard
// --------------------------------------------------------------------------
function renderResults(result, originalText) {
  // Hide initial placeholder, show results panel
  resultsPlaceholder.style.display = 'none';
  resultsContent.style.display = 'block';

  // Timestamp
  const now = new Date();
  analysisTimestamp.textContent = `Assessed ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

  // 1. Verdict Card
  verdictCard.className = 'verdict-card';
  let iconSvg = '';

  if (result.code === VERDICT_CODES.LIKELY_RELIABLE) {
    verdictCard.classList.add('verdict-reliable');
    iconSvg = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>
    `;
  } else if (result.code === VERDICT_CODES.POSSIBLY_MISLEADING) {
    verdictCard.classList.add('verdict-misleading');
    iconSvg = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `;
  } else {
    verdictCard.classList.add('verdict-ambiguous');
    iconSvg = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `;
  }

  verdictIconWrap.innerHTML = iconSvg;
  verdictLabel.textContent = result.verdictLabel;
  verdictSummary.textContent = result.summary;

  // Engine metadata tag
  const simNote = result.modelMeta.isSimulated ? '(Simulated Demo Mode)' : '(Production)';
  modelMetaEngine.textContent = `${result.modelMeta.engine} ${simNote}`;

  // Confidence radial meter
  gaugePercentage.textContent = `${result.confidence}%`;
  // SVG stroke-dasharray animation
  gaugeProgressPath.setAttribute('stroke-dasharray', `${result.confidence}, 100`);

  // 2. Feature Meters
  const f = result.features;
  animateScore(scoreSensationalism, barSensationalism, f.sensationalismScore);
  animateScore(scoreEmotional, barEmotional, f.emotionalIntensityScore);
  animateScore(scoreAttribution, barAttribution, f.attributionScore);
  animateScore(scoreFormality, barFormality, f.formalityScore);
  animateScore(scoreSubjectivity, barSubjectivity, f.subjectivityScore);
  animateScore(scorePunctuation, barPunctuation, f.punctuationAnomalyScore);

  // 3. Key Factors
  factorsList.innerHTML = '';
  if (result.keyFactors && result.keyFactors.length > 0) {
    result.keyFactors.forEach(factor => {
      const li = document.createElement('li');
      li.className = 'factor-bullet';
      li.innerHTML = `
        <span class="factor-icon" aria-hidden="true">▸</span>
        <span>${escapeHtml(factor)}</span>
      `;
      factorsList.appendChild(li);
    });
  }

  // 4. Annotated Text Highlights
  renderAnnotatedText(originalText, result.highlights || []);

  // 5. Fact-checking recommendations
  recommendationsList.innerHTML = '';
  if (result.recommendations && result.recommendations.length > 0) {
    result.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      recommendationsList.appendChild(li);
    });
  }
}

function animateScore(labelEl, barEl, score) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  labelEl.textContent = `${safeScore}/100`;
  barEl.style.width = `${safeScore}%`;
}

// --------------------------------------------------------------------------
// Highlighted Text Renderer
// --------------------------------------------------------------------------
function renderAnnotatedText(text, rawHighlights) {
  const count = rawHighlights.length;
  highlightCountLabel.textContent = `${count} marker${count === 1 ? '' : 's'} flagged`;

  if (count === 0) {
    annotatedTextViewer.innerHTML = `<span style="color:var(--text-muted); font-style:italic;">No distinct sensational, emotional, or attribution pattern markers detected in this text.</span>\n\n${escapeHtml(text)}`;
    return;
  }

  // Sort highlights ascending by index
  const sorted = [...rawHighlights].sort((a, b) => a.index - b.index);

  let outputHtml = '';
  let lastIndex = 0;

  for (const h of sorted) {
    if (h.index < lastIndex) continue; // Skip overlapping span

    // Preceding unhighlighted segment
    if (h.index > lastIndex) {
      outputHtml += escapeHtml(text.slice(lastIndex, h.index));
    }

    // Highlighted token
    const tokenText = text.slice(h.index, h.index + h.length);
    const markClass = `mark-${h.type || 'sensational'}`;
    const tagTitle = h.label || h.type;

    outputHtml += `<mark class="text-mark ${markClass}" title="${escapeHtml(tagTitle)}">${escapeHtml(tokenText)}</mark>`;
    lastIndex = h.index + h.length;
  }

  // Remainder text
  if (lastIndex < text.length) {
    outputHtml += escapeHtml(text.slice(lastIndex));
  }

  annotatedTextViewer.innerHTML = outputHtml;
}

// --------------------------------------------------------------------------
// Toast Notification
// --------------------------------------------------------------------------
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// --------------------------------------------------------------------------
// HTML Escaping Utility
// --------------------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
