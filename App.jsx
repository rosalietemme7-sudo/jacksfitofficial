import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  :root {
    --cream: #f0ede8;
    --orange: #e8631a;
    --dark: #0a0a0a;
    --card: #141414;
    --border: #1e1e1e;
  }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 40px;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0;
    background: rgba(10,10,10,0.97);
    backdrop-filter: blur(12px);
    z-index: 100;
  }
  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 3px; }
  .logo span { color: var(--orange); }
  .nav-status { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #444; }
  .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #2ecc71; box-shadow: 0 0 5px #2ecc71; animation: blink 2.5s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* JACK AVATAR SVG */
  .jack-face {
    width: 52px; height: 52px; flex-shrink: 0;
  }
  .jack-face.small { width: 38px; height: 38px; }
  .jack-face.large { width: 80px; height: 80px; }

  /* INTRO */
  .intro-wrap {
    max-width: 640px; margin: 56px auto 0; padding: 0 40px;
  }

  .jack-intro-header {
    display: flex; align-items: center; gap: 18px; margin-bottom: 32px;
    animation: fadeUp 0.4s ease both;
  }
  .jack-intro-header-text h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; letter-spacing: 2px; margin-bottom: 4px;
  }
  .jack-intro-header-text p { font-size: 13px; color: #555; font-weight: 300; }

  /* CHAT BUBBLES */
  .bubble-row {
    display: flex; gap: 12px; align-items: flex-end; margin-bottom: 14px;
    animation: fadeUp 0.4s ease both;
  }
  .bubble-row:nth-child(2) { animation-delay: 0.12s; }
  .bubble-row:nth-child(3) { animation-delay: 0.24s; }
  .bubble-row:nth-child(4) { animation-delay: 0.36s; }

  .bubble {
    background: #161616; border: 1px solid var(--border);
    border-radius: 4px 18px 18px 18px;
    padding: 13px 17px; font-size: 14px; color: #bbb;
    line-height: 1.65; font-weight: 300; max-width: 480px;
  }
  .bubble strong { color: var(--cream); font-weight: 500; }
  .bubble em { color: var(--orange); font-style: normal; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* UPLOAD */
  .upload-section {
    max-width: 640px; margin: 0 auto; padding: 8px 40px 80px; width: 100%;
    animation: fadeUp 0.4s 0.5s ease both;
  }

  .upload-zone {
    border: 1.5px dashed #222; border-radius: 12px;
    padding: 48px 40px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: var(--card);
    position: relative; overflow: hidden;
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--orange); background: #111; }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .upload-zone h3 {
    font-family: 'Bebas Neue', sans-serif; font-size: 20px;
    letter-spacing: 2px; margin: 14px 0 6px;
  }
  .upload-zone p { font-size: 12px; color: #3a3a3a; font-weight: 300; }

  /* PREVIEW */
  .preview-wrap {
    position: relative; border-radius: 12px; overflow: hidden;
    background: var(--card); border: 1px solid var(--border);
  }
  .preview-img { width: 100%; max-height: 360px; object-fit: cover; display: block; }
  .preview-bar {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    display: flex; justify-content: space-between; align-items: center;
  }
  .preview-bar span { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #777; }
  .btn-change {
    background: none; border: 1px solid #333; color: #666;
    padding: 5px 12px; font-size: 11px; letter-spacing: 1px;
    text-transform: uppercase; cursor: pointer; border-radius: 6px;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .btn-change:hover { border-color: #666; color: var(--cream); }

  .btn-analyze {
    width: 100%; margin-top: 12px; padding: 17px;
    background: var(--orange); color: #000;
    border: none; font-family: 'Bebas Neue', sans-serif;
    font-size: 19px; letter-spacing: 3px; cursor: pointer;
    border-radius: 10px; transition: all 0.2s;
  }
  .btn-analyze:hover:not(:disabled) { background: #f07030; transform: translateY(-1px); }
  .btn-analyze:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* LOADING */
  .loading-wrap {
    max-width: 640px; margin: 56px auto; padding: 0 40px;
    animation: fadeUp 0.3s ease both;
  }
  .typing-row { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 20px; }
  .typing-dots {
    background: #161616; border: 1px solid var(--border);
    border-radius: 4px 18px 18px 18px;
    padding: 14px 18px; display: flex; gap: 5px; align-items: center;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #333; animation: bounce 1.3s infinite ease-in-out; }
  .dot:nth-child(2) { animation-delay: 0.18s; }
  .dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes bounce {
    0%,80%,100% { transform: translateY(0); background: #333; }
    40% { transform: translateY(-5px); background: var(--orange); }
  }
  .loading-steps { padding-left: 50px; }
  .step { font-size: 11px; color: #252525; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 7px; transition: color 0.3s; }
  .step.active { color: #555; }
  .step.done { color: var(--orange); }

  /* RESULTS */
  .results { max-width: 640px; margin: 0 auto; padding: 0 40px 100px; width: 100%; }

  .jack-says {
    display: flex; gap: 12px; align-items: flex-start;
    margin: 44px 0 24px;
    animation: fadeUp 0.4s ease both;
  }
  .jack-says-bubble {
    background: #161616; border: 1px solid var(--border);
    border-radius: 4px 18px 18px 18px;
    padding: 16px 20px; flex: 1;
  }
  .jack-says-bubble p { font-size: 14px; color: #bbb; line-height: 1.65; font-weight: 300; margin-bottom: 10px; }
  .jack-says-bubble p:last-child { margin-bottom: 0; }
  .jack-says-bubble strong { color: var(--cream); font-weight: 500; }

  /* OUTFITS */
  .outfit-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; margin-bottom: 12px; overflow: hidden;
    animation: fadeUp 0.4s ease both;
  }
  .outfit-card:nth-child(2) { animation-delay: 0.08s; }
  .outfit-card:nth-child(3) { animation-delay: 0.16s; }
  .outfit-card:nth-child(4) { animation-delay: 0.24s; }

  .outfit-head {
    padding: 16px 20px; display: flex; align-items: center;
    justify-content: space-between; cursor: pointer; user-select: none;
  }
  .outfit-head-left { display: flex; align-items: center; gap: 12px; }
  .outfit-num { font-family: 'Bebas Neue', sans-serif; font-size: 11px; letter-spacing: 2px; color: var(--orange); }
  .outfit-title { font-family: 'Bebas Neue', sans-serif; font-size: 19px; letter-spacing: 1px; }
  .outfit-vibe { font-size: 11px; color: #333; font-weight: 300; margin-left: 4px; }
  .outfit-arrow { color: #2a2a2a; font-size: 14px; transition: transform 0.2s; }
  .outfit-arrow.open { transform: rotate(180deg); color: var(--orange); }

  .outfit-body { padding: 0 20px 20px; border-top: 1px solid var(--border); }

  .jack-comment {
    display: flex; gap: 10px; align-items: flex-start; padding: 14px 0 16px;
  }
  .jack-comment-text {
    background: #0f0f0f; border: 1px solid #181818;
    border-radius: 4px 12px 12px 12px;
    padding: 10px 14px; font-size: 13px; color: #555;
    line-height: 1.6; font-weight: 300; font-style: italic;
  }

  .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
  .item {
    background: #0f0f0f; border: 1px solid #181818;
    border-radius: 10px; padding: 14px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .item-cat { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #2a2a2a; }
  .item-name { font-size: 13px; color: var(--cream); font-weight: 500; line-height: 1.3; }
  .item-desc { font-size: 12px; color: #3a3a3a; font-weight: 300; line-height: 1.4; flex: 1; }
  .item-btn {
    display: block; text-align: center;
    padding: 8px; background: transparent;
    border: 1px solid #1e1e1e; border-radius: 7px;
    color: var(--orange); font-size: 11px; letter-spacing: 1px;
    text-transform: uppercase; text-decoration: none;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    font-weight: 500; margin-top: 6px;
  }
  .item-btn:hover { background: var(--orange); color: #000; border-color: var(--orange); }

  /* CLOSING */
  .closing {
    display: flex; gap: 12px; align-items: flex-start;
    margin-top: 28px;
    animation: fadeUp 0.4s 0.3s ease both;
  }
  .closing-bubble {
    background: #161616; border: 1px solid var(--border);
    border-radius: 4px 18px 18px 18px;
    padding: 16px 20px; flex: 1;
  }
  .closing-bubble p { font-size: 14px; color: #666; line-height: 1.6; font-weight: 300; margin-bottom: 16px; font-style: italic; }
  .btn-new {
    width: 100%; padding: 13px;
    background: transparent; border: 1px solid #222;
    color: #444; font-family: 'Bebas Neue', sans-serif;
    font-size: 15px; letter-spacing: 3px; cursor: pointer;
    border-radius: 8px; transition: all 0.2s;
  }
  .btn-new:hover { border-color: #555; color: var(--cream); }

  /* ERROR */
  .error { background: #120a0a; border: 1px solid #2a1010; border-radius: 10px; padding: 14px 18px; margin-top: 12px; font-size: 13px; color: #aa4444; }

  /* FOOTER */
  .footer { margin-top: auto; padding: 20px 40px; border-top: 1px solid var(--border); text-align: center; font-size: 11px; color: #1e1e1e; letter-spacing: 1px; }

  @media (max-width: 600px) {
    .nav, .intro-wrap, .upload-section, .results { padding-left: 20px; padding-right: 20px; }
    .intro-wrap { margin-top: 36px; }
    .items-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// Jack SVG mascot — clean, simple face like Duolingo style
function JackAvatar({ size = "normal" }) {
  return (
    <svg className={`jack-face ${size}`} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="40" cy="40" r="36" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
      {/* Hair */}
      <path d="M14 30 Q20 10 40 12 Q60 10 66 30 Q58 18 40 20 Q22 18 14 30Z" fill="#111"/>
      {/* Face skin */}
      <ellipse cx="40" cy="44" rx="20" ry="18" fill="#2a1f1a"/>
      {/* Eyes */}
      <ellipse cx="32" cy="40" rx="4" ry="4.5" fill="#0a0a0a"/>
      <ellipse cx="48" cy="40" rx="4" ry="4.5" fill="#0a0a0a"/>
      {/* Eye shine */}
      <circle cx="33.5" cy="38.5" r="1.2" fill="white"/>
      <circle cx="49.5" cy="38.5" r="1.2" fill="white"/>
      {/* Eyebrows — straight, serious */}
      <path d="M27 34 Q32 32.5 37 34" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      <path d="M43 34 Q48 32.5 53 34" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M39 44 Q37 48 40 50 Q43 48 41 44" stroke="#1a0f0a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Mouth — neutral/slight smile */}
      <path d="M33 55 Q40 59 47 55" stroke="#111" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Collar */}
      <path d="M24 72 L30 62 L40 66 L50 62 L56 72" fill="#e8631a" opacity="0.9"/>
      {/* Shirt */}
      <path d="M10 80 Q14 70 24 72 L30 62 L40 66 L50 62 L56 72 Q66 70 70 80Z" fill="#141414"/>
    </svg>
  );
}

const STEPS = [
  "Foto wordt verwerkt...",
  "Jack analyseert je look...",
  "Bouw en huidstoon worden meegenomen...",
  "Outfits worden samengesteld...",
  "Afronden...",
];

function OutfitCard({ outfit, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="outfit-card">
      <div className="outfit-head" onClick={() => setOpen(!open)}>
        <div className="outfit-head-left">
          <span className="outfit-num">0{index + 1}</span>
          <div>
            <span className="outfit-title">{outfit.name}</span>
            <span className="outfit-vibe">— {outfit.vibe}</span>
          </div>
        </div>
        <span className={`outfit-arrow ${open ? "open" : ""}`}>▾</span>
      </div>
      {open && (
        <div className="outfit-body">
          <div className="jack-comment">
            <JackAvatar size="small" />
            <p className="jack-comment-text">{outfit.why}</p>
          </div>
          <div className="items-grid">
            {outfit.items.map((item, i) => (
              <div className="item" key={i}>
                <span className="item-cat">{item.category}</span>
                <span className="item-name">{item.name}</span>
                <span className="item-desc">{item.description}</span>
                <a
                  className="item-btn"
                  href={`https://www.zalando.nl/catalogus/?q=${encodeURIComponent(item.searchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                >
                  Bekijk item →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JacksFits() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const iv = setInterval(() => { i++; setStepIndex(i); if (i >= STEPS.length - 1) clearInterval(iv); }, 950);
    return () => clearInterval(iv);
  }, [loading]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(URL.createObjectURL(file));
    setResult(null); setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImageBase64({ data: e.target.result.split(",")[1], type: file.type });
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true); setStepIndex(0); setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageBase64.data, imageType: imageBase64.type }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else { setResult(data); }
    } catch {
      setError("Er is een verbindingsprobleem opgetreden. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setImageBase64(null); setResult(null); setError(null); };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        <nav className="nav">
          <div className="logo">JACKS<span>.</span>FITS</div>
          <div className="nav-status"><div className="nav-dot" /> Jack is beschikbaar</div>
        </nav>

        {!result && !loading && (
          <>
            <div className="intro-wrap">
              <div className="jack-intro-header">
                <JackAvatar size="large" />
                <div className="jack-intro-header-text">
                  <h2>Goedendag, ik ben Jack.</h2>
                  <p>Persoonlijk stijladvies op basis van jouw foto.</p>
                </div>
              </div>

              <div className="bubble-row">
                <JackAvatar size="small" />
                <div className="bubble">
                  Upload een foto van jezelf — ik analyseer je bouw, huidstoon en huidige stijl, en stel drie complete outfits samen die specifiek bij jou passen.
                </div>
              </div>

              <div className="bubble-row">
                <JackAvatar size="small" />
                <div className="bubble">
                  Elk item is direct te kopen. <strong>Geen generiek advies.</strong> Ik kijk naar wat ik zie.
                </div>
              </div>
            </div>

            <div className="upload-section">
              {!image ? (
                <div
                  className={`upload-zone ${drag ? "drag" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
                  <JackAvatar size="large" />
                  <h3>Stuur Jack je foto</h3>
                  <p>Klik of sleep een foto hierheen · JPG, PNG of HEIC</p>
                </div>
              ) : (
                <>
                  <div className="preview-wrap">
                    <img src={image} alt="Preview" className="preview-img" />
                    <div className="preview-bar">
                      <span>Foto geladen</span>
                      <button className="btn-change" onClick={reset}>Wijzigen</button>
                    </div>
                  </div>
                  <button className="btn-analyze" onClick={analyze} disabled={!imageBase64}>
                    VRAAG JACK OM ADVIES →
                  </button>
                </>
              )}
              {error && <div className="error">{error}</div>}
            </div>
          </>
        )}

        {loading && (
          <div className="loading-wrap">
            <div className="typing-row">
              <JackAvatar size="small" />
              <div className="typing-dots">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
            <div className="loading-steps">
              {STEPS.map((s, i) => (
                <p key={i} className={`step ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`}>
                  {i < stepIndex ? "✓ " : i === stepIndex ? "→ " : "  "}{s}
                </p>
              ))}
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="results">
            <div className="jack-says">
              <JackAvatar size="small" />
              <div className="jack-says-bubble">
                <p>{result.jackReaction}</p>
                <p><strong>Stijlprofiel:</strong> {result.profile}</p>
              </div>
            </div>

            {result.outfits?.map((outfit, i) => (
              <OutfitCard key={i} outfit={outfit} index={i} />
            ))}

            <div className="closing">
              <JackAvatar size="small" />
              <div className="closing-bubble">
                <p>"{result.jackClosing}"</p>
                <button className="btn-new" onClick={reset}>NIEUWE FOTO UPLOADEN</button>
              </div>
            </div>
          </div>
        )}

        <footer className="footer">© 2026 JACKS.FITS</footer>
      </div>
    </>
  );
}
