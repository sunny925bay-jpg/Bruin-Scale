import { useState, useRef, useCallback } from 'react';
import { analyzeImage } from './api';
import { getTier, TIERS, FAKE_MATCHES } from './tiers';
import './App.css';

const BREAKDOWN_LABELS = {
  symmetry: 'Facial Symmetry',
  harmony: 'Feature Harmony',
  proportions: 'Proportions',
  skin: 'Skin Quality',
  structure: 'Bone Structure',
  averageness: 'Averageness',
  dimorphism: 'Sexual Dimorphism',
  memorable: 'Memorable Features',
};

function ScoreGauge({ score }) {
  const pct = ((score - 0.1) / 9.9) * 100;
  const hue = Math.round((pct / 100) * 260);
  const color = `hsl(${hue}, 90%, 55%)`;
  return (
    <div className="gauge-wrap">
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="gauge-score" style={{ color }}>
        {score.toFixed(1)}
      </div>
    </div>
  );
}

function BreakdownBar({ label, value }) {
  const pct = (value / 10) * 100;
  const hue = Math.round((pct / 100) * 260);
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{ width: `${pct}%`, background: `hsl(${hue}, 80%, 50%)` }}
        />
      </div>
      <span className="bar-val">{value.toFixed(1)}</span>
    </div>
  );
}

function MatchCard({ match }) {
  const tier = getTier(match.score, Math.random() > 0.5 ? 'male' : 'female');
  return (
    <div className="match-card">
      <div className="match-avatar">{match.avatar}</div>
      <div className="match-info">
        <div className="match-name">{match.name}</div>
        <div className="match-meta">{match.major} · {match.year}</div>
        <div className="match-tier" style={{ color: tier.color }}>{tier.tag}</div>
      </div>
      <div className="match-score" style={{ color: tier.color }}>{match.score.toFixed(1)}</div>
    </div>
  );
}

function TierTable() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (i) => setExpanded(prev => prev === i ? null : i);

  return (
    <div className="tier-table-wrap">
      {TIERS.map((t, i) => (
        <div
          key={i}
          className={`tier-row ${expanded === i ? 'tier-row-open' : ''}`}
          style={{ '--tier-color': t.color, '--tier-bg': t.bgColor }}
          onClick={() => toggle(i)}
        >
          <div className="tier-row-main">
            <span className="tier-row-score">{t.min === t.max ? t.min : `${t.min}–${t.max}`}</span>
            <span className="tier-row-tags">
              <span className="tier-row-tag">{t.maleTag}</span>
              <span className="tier-row-sep">/</span>
              <span className="tier-row-tag">{t.femaleTag}</span>
            </span>
            <span className="tier-row-desc">{t.description}</span>
            <span className="tier-row-arrow">{expanded === i ? '▲' : '▼'}</span>
          </div>
          {expanded === i && (
            <div className="tier-row-expanded">
              <div className="tier-row-fullname">
                <span className="tier-row-tag">{t.maleTag}</span>
                <span className="tier-fullname-text">{t.maleLabel}</span>
              </div>
              <div className="tier-row-fullname">
                <span className="tier-row-tag">{t.femaleTag}</span>
                <span className="tier-fullname-text">{t.femaleLabel}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [gender, setGender] = useState('male');
  const [roastMode, setRoastMode] = useState(false);
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showTierTable, setShowTierTable] = useState(false);
  const fileRef = useRef();

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];
      // Detect actual mime type from magic bytes instead of trusting file.type
      let mimeType = 'image/jpeg';
      if (base64.startsWith('iVBORw0KGgo')) mimeType = 'image/png';
      else if (base64.startsWith('UklGR')) mimeType = 'image/webp';
      else if (base64.startsWith('R0lGOD')) mimeType = 'image/gif';
      setImage({ base64, mimeType, url: dataUrl });
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeImage(image.base64, image.mimeType, gender, roastMode);
      const tier = getTier(data.score, gender);
      const matches = FAKE_MATCHES
        .map(m => ({ ...m, score: +(data.score + (Math.random() * 0.6 - 0.3)).toFixed(1) }))
        .filter(m => m.score >= 0.1 && m.score <= 10)
        .sort((a, b) => Math.abs(a.score - data.score) - Math.abs(b.score - data.score))
        .slice(0, 4);
      setResult({ ...data, tier, matches });
    } catch (e) {
      setError(e.message || 'Something went wrong. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-b">B</span>RUIN
            <span className="logo-sub"> SCALE</span>
          </div>
          <div className="tagline">UCLA Facial Tier System · Powered by AI</div>
        </div>
      </header>

      <main className="main">
        <div className="controls-row">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={() => setGender('male')}
            >
              ♂ Male
            </button>
            <button
              className={`toggle-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={() => setGender('female')}
            >
              ♀ Female
            </button>
          </div>
          <button
            className={`roast-btn ${roastMode ? 'active' : ''}`}
            onClick={() => setRoastMode(r => !r)}
          >
            {roastMode ? '🔥 ROAST MODE ON' : '🔥 Roast Mode'}
          </button>
        </div>

        {!result && (
          <div
            className={`upload-zone ${dragging ? 'dragging' : ''} ${image ? 'has-image' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !image && fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => processFile(e.target.files[0])}
            />
            {image ? (
              <div className="preview-wrap">
                <img src={image.url} alt="Preview" className="preview-img" />
                <button className="clear-btn" onClick={(e) => { e.stopPropagation(); reset(); }}>
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div className="upload-inner">
                <div className="upload-icon">⬆</div>
                <div className="upload-text">Drop your photo here</div>
                <div className="upload-sub">or click to browse · jpg, png, webp</div>
              </div>
            )}
          </div>
        )}

        {image && !result && (
          <button
            className={`analyze-btn ${loading ? 'loading' : ''}`}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-row">
                <span className="spinner" /> Analyzing...
              </span>
            ) : (
              'ANALYZE'
            )}
          </button>
        )}

        {error && <div className="error-box">{error}</div>}

        {result && (
          <div className="results">
            <div className="result-header">
              <div className="result-left">
                <img src={image.url} alt="Analyzed" className="result-img" />
              </div>
              <div className="result-right">
                <div className="tier-tag" style={{
                  color: result.tier.color,
                  borderColor: result.tier.color,
                  background: result.tier.bgColor,
                }}>
                  {result.tier.tag}
                </div>
                <div className="tier-label">{result.tier.label}</div>
                <ScoreGauge score={result.score} />
                <div className="tier-desc">{result.tier.description}</div>
                <div className="summary-text">"{result.summary}"</div>
              </div>
            </div>

            {roastMode && result.roast && result.roast !== 'null' && (
              <div className="roast-box">
                <div className="roast-label">🔥 THE ROAST</div>
                <div className="roast-text">{result.roast}</div>
              </div>
            )}

            <div className="section">
              <div className="section-title">BREAKDOWN</div>
              <div className="breakdown-grid">
                {Object.entries(result.breakdown).map(([key, val]) => (
                  <BreakdownBar key={key} label={BREAKDOWN_LABELS[key] || key} value={val} />
                ))}
              </div>
            </div>

            <div className="pos-neg-row">
              <div className="pos-box">
                <div className="pn-title" style={{ color: '#2ecc71' }}>POSITIVES</div>
                {result.positives.map((p, i) => (
                  <div key={i} className="pn-item">✓ {p}</div>
                ))}
              </div>
              <div className="neg-box">
                <div className="pn-title" style={{ color: '#e74c3c' }}>NEGATIVES</div>
                {result.negatives.map((n, i) => (
                  <div key={i} className="pn-item">✗ {n}</div>
                ))}
              </div>
            </div>

            <div className="advice-box">
              <span className="advice-label">ADVICE: </span>
              {result.advice}
            </div>

            <div className="section">
              <div className="section-title">YOUR UCLA MATCHES</div>
              <div className="section-sub">
                Students within ±0.3 of your score · Demo data
              </div>
              <div className="matches-grid">
                {result.matches.map((m, i) => (
                  <MatchCard key={i} match={m} />
                ))}
              </div>
            </div>

            <button className="retry-btn" onClick={reset}>
              ← Analyze Another Photo
            </button>
          </div>
        )}

        <div className="tier-table-toggle">
          <button
            className="tier-toggle-btn"
            onClick={() => setShowTierTable(t => !t)}
          >
            {showTierTable ? '▲ Hide' : '▼ Show'} Full Tier Reference
          </button>
        </div>

        {showTierTable && (
          <TierTable />
        )}

      </main>
    </div>
  );
}
