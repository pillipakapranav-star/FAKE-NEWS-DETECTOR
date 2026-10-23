# Fake News Detection & Text Credibility Analyzer

An accessible, responsive, modern web application for analyzing news headlines and articles for **linguistic credibility, sensationalism, emotional charge, and transparent source attribution**.

Built with a modular, pluggable architecture conforming to `BaseAnalyzer`, allowing rule-based statistical NLP, simulated deep learning transformers, or live production machine learning models (e.g. Hugging Face Inference API, ONNX, or custom REST servers) to be swapped in effortlessly.

---

## ⚠️ Responsible AI & Ethical Boundaries

> [!IMPORTANT]
> **Stylistic Analysis Only — Not Factual Verification**  
> This application evaluates **linguistic and stylistic patterns** (such as emotional intensity, sensationalism, hyperbolic claims, and formal source attribution).  
> **This tool cannot verify whether an underlying real-world claim or event is actually true.**  
>
> - **Predictions are not facts:** Stylistic markers indicate typical reporting conventions, not objective truth. Satire, breaking unconfirmed reports, and nuanced editorials can exhibit complex linguistic traits.
> - **No labeling of individuals:** This tool never labels real persons or institutions as dishonest.
> - **Check reliable primary sources:** Users must always cross-check critical news with verified independent fact-checkers and primary documentation:
>   - [Associated Press Fact Check](https://apnews.com/hub/ap-fact-check)
>   - [Reuters Fact Check](https://www.reuters.com/fact-check/)
>   - [Snopes](https://www.snopes.com/)
>   - [PolitiFact](https://www.politifact.com/)
>   - [FactCheck.org](https://www.factcheck.org/)

---

## Key Features

1. **Interactive Text Studio**:
   - Clean, accessible text area with real-time counters: **Character count**, **Word count**, **Sentence count**, and **Estimated reading time**.
   - One-click clipboard **Paste** and **Clear** actions.

2. **Categorical Credibility Verdicts**:
   - 🟢 **Likely Reliable**: High syntactic formality, transparent citations, measured and objective tone.
   - 🟡 **Possibly Misleading**: High emotional urgency, sensationalism, all-caps emphasis, or complete lack of source attribution.
   - 🟣 **Unable to Assess**: Ambiguous text, insufficient context (< 60 chars / 10 words), or balanced mixed signals.

3. **Explainable AI & Feature Breakdown**:
   - **Radial Confidence Gauge**: Dynamic SVG visualization showing model confidence in stylistic alignment.
   - **6 Linguistic Feature Meters (0–100 scale)**:
     - *Tone & Sensationalism*
     - *Emotional Intensity*
     - *Source Attribution & Citations*
     - *Syntactic Formality*
     - *Subjectivity & Opinion Ratio*
     - *Punctuation & Capitalization Anomalies*
   - **Annotated Text Inspector**: In-line text highlighter showing color-coded tokens for sensational words, emotional triggers, citations, and all-caps markers.
   - **Contextual Key Factors**: Plain-language bullets explaining why the assessment was made.
   - **Fact-Checking Checklist**: Actionable tips on how to independently verify the claim.

4. **Curated Demo Mode**:
   - 1-click sample articles loaded across diverse styles:
     - *Plastic-Degrading Enzyme Discovery* (Peer-reviewed science reporting — Likely Reliable)
     - *Banned Miracle Cure Clickbait* (Hyperbolic health claim — Possibly Misleading)
     - *Central Bank Inflation Report* (Neutral financial wire journalism — Likely Reliable)
     - *Viral Conspiracy & Urgency Alert* (Alarmist call to action — Possibly Misleading)
     - *Ambiguous Short Fragment* (Minimal context — Unable to Assess)
     - *Nuanced Editorial Essay* (First-person commentary — Nuanced)

5. **Modern, Responsive Design**:
   - Refined dark and light themes with automatic system preference detection and manual toggle.
   - Glassmorphism, smooth micro-animations, and fluid layout for mobile, tablet, and desktop screens.
   - Accessible keyboard focus states, semantic HTML5, and screen-reader `aria-live` regions.

---

## Architecture: Pluggable NLP Engine

The app is organized so that any real machine learning model can replace the demo prediction engine without touching the UI.

```
PROJECT 3/
├── index.html                   # Semantic HTML5 UI layout
├── css/
│   ├── main.css                 # Design tokens, themes (dark/light), typography
│   └── components.css           # Cards, gauges, progress bars, modals, annotations
├── js/
│   ├── app.js                   # Application state, UI controller, event bindings
│   ├── samples.js               # Demo sample articles dataset
│   └── analyzer/
│       ├── analyzerInterface.js # BaseAnalyzer abstract class & standardized schema
│       ├── lexicons.js          # Curated linguistic patterns & regex banks
│       ├── heuristicNLP.js      # Client-side heuristic linguistic feature extractor
│       └── modelAdapter.js      # ModelManager and Remote API / HuggingFace adapter
├── test/
│   └── analyzer.test.js         # Automated unit & integration test suite
├── server.js                    # Lightweight zero-dependency static server
└── package.json                 # Project configuration & npm scripts
```

### Integrating a Trained NLP Model

1. Subclass `BaseAnalyzer` in `js/analyzer/`:
   ```javascript
   import { BaseAnalyzer, formatResult, VERDICT_CODES } from './analyzerInterface.js';

   export class CustomBERTAnalyzer extends BaseAnalyzer {
     constructor() {
       super('Fine-Tuned RoBERTa (FakeNewsNet)', false); // isSimulated: false
     }

     async analyze(text, options = {}) {
       // Call your model (e.g., Transformers.js, ONNX Runtime Web, or API)
       const prediction = await myModel.predict(text);

       return formatResult({
         code: prediction.label, // LIKELY_RELIABLE | POSSIBLY_MISLEADING | UNABLE_TO_ASSESS
         confidence: prediction.score * 100,
         summary: prediction.explanation,
         engine: this.name,
         isSimulated: false,
         features: prediction.featureBreakdown,
         keyFactors: prediction.topTokens,
         highlights: prediction.spanHighlights
       });
     }
   }
   ```
2. Register it in `modelManager.providers` in `js/analyzer/modelAdapter.js`.

---

## Setup & Running Locally

### Option A: Using Node.js (Recommended)

1. Clone or download this project folder.
2. In the terminal, navigate to the folder:
   ```bash
   npm start
   ```
   *Or:*
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3005/
   ```

### Option B: Run Without Any Server (Direct Browser)

Because the project is built with standard ES Modules:
- Serve via any local HTTP server (such as Python `python -m http.server 8000` or VS Code Live Server) to allow ES module imports.

### Running Automated Tests

To run the unit test suite verifying classification logic, thresholds, and edge cases:
```bash
npm test
```
*Or:*
```bash
node test/analyzer.test.js
```

---

## License

MIT License. Designed for educational, journalistic, and research demonstration purposes.
