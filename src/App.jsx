import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES — theme-aware (dark / light)
───────────────────────────────────────────── */
const makeCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&family=Sora:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:       ${dark ? "#0b0e17" : "#F5F2EC"};
    --surface:   ${dark ? "#111827" : "#FFFFFF"};
    --panel:     ${dark ? "#161d2e" : "#FFFFFF"};
    --border:    ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)"};
    --gold:      #f5c842;
    --gold-dim:  #b8962e;
    --amber:     #f59e0b;
    --rose:      #fb7185;
    --teal:      #2dd4bf;
    --violet:    #a78bfa;
    --sky:       #38bdf8;
    --green:     #4ade80;
    --muted:     ${dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)"};
    --text:      ${dark ? "rgba(255,255,255,0.88)" : "#1a1a2e"};
    --radius:    16px;
    --shadow:    ${dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.1)"};
    --glow-gold: 0 0 40px rgba(245,200,66,0.18);
    --glow-rose: 0 0 40px rgba(251,113,133,0.18);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--ink);
    color: var(--text);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    min-height: 100vh;
    overflow-x: visible;
    transition: background 0.3s ease, color 0.3s ease;
  }

  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: ${dark ? 0.6 : 0.3};
  }

  body::after {
    content: '';
    position: fixed; top: -30%; left: -10%; width: 60%; height: 60%;
    background: radial-gradient(ellipse at center, ${dark ? "rgba(167,139,250,0.06)" : "rgba(245,200,66,0.07)"} 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  #root { position: relative; z-index: 1; }

  .font-display { font-family: 'Playfair Display', serif; }
  .font-mono    { font-family: 'DM Mono', monospace; }

  .glass {
    background: ${dark ? "rgba(22,29,46,0.85)" : "rgba(255,255,255,0.92)"};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .text-gold-shimmer {
    background: linear-gradient(90deg, #f5c842, #fde68a, #f5c842);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  @keyframes shimmer    { to { background-position: 200% center; } }
  @keyframes pulseRing  { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(1.15); opacity:0; } }
  @keyframes slideUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeScale  { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
  @keyframes fillBar    { from { width:0%; } }
  @keyframes breathe    { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
  @keyframes ticker     { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes doctorSlide{ from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes fireFlick  { 0%,100%{transform:scaleY(1) rotate(-2deg);} 50%{transform:scaleY(1.1) rotate(2deg);} }
  @keyframes xpFill     { from { width:0%; } }
  @keyframes achievePop { 0%{opacity:0;transform:scale(0.7);} 60%{transform:scale(1.06);} 100%{opacity:1;transform:scale(1);} }
  @keyframes cardShimmer{ from{background-position:200% center;} to{background-position:-200% center;} }
  @keyframes cardFloat  { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-8px) rotate(1deg);} }
  @keyframes savingsIn  { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
  @keyframes regretPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(251,113,133,0.4);} 50%{box-shadow:0 0 0 8px rgba(251,113,133,0);} }

  .slide-up    { animation: slideUp    0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .mood-overlay{ animation: fadeScale  0.35s cubic-bezier(0.22,1,0.36,1); }
  .breathe     { animation: breathe   4s ease-in-out infinite; }
  .fire-anim   { animation: fireFlick 0.6s ease-in-out infinite; display:inline-block; }
  .achieve-pop { animation: achievePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .savings-in  { animation: savingsIn  0.5s cubic-bezier(0.22,1,0.36,1) both; }

  .stagger > *:nth-child(1) { animation-delay:0.05s; }
  .stagger > *:nth-child(2) { animation-delay:0.12s; }
  .stagger > *:nth-child(3) { animation-delay:0.19s; }
  .stagger > *:nth-child(4) { animation-delay:0.26s; }
  .stagger > *:nth-child(5) { animation-delay:0.33s; }
  .stagger > *:nth-child(6) { animation-delay:0.40s; }

  .pulse-ring {
    position:absolute; inset:-8px; border-radius:50%;
    border:2px solid var(--gold);
    animation: pulseRing 2s ease-out infinite;
  }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(245,200,66,0.2); border-radius:99px; }

  .nav-item { transition: all 0.2s ease; }
  .nav-item.active { background: rgba(245,200,66,0.12); color: var(--gold); }
  .nav-item:not(.active):hover { background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}; }

  .emotion-pill {
    display:inline-flex; align-items:center; gap:4px;
    padding:3px 10px; border-radius:99px; font-size:11px;
    font-weight:500; font-family:'DM Mono',monospace; letter-spacing:0.3px;
  }

  .score-ring { transform:rotate(-90deg); transform-origin:center; }

  .app-input {
    background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
    border:1px solid var(--border); border-radius:10px;
    color:var(--text); padding:10px 14px;
    font-family:'Sora',sans-serif; font-size:13px; width:100%; outline:none;
    transition:border-color 0.2s;
  }
  .app-input:focus { border-color:rgba(245,200,66,0.5); }
  .app-input::placeholder { color:var(--muted); }
  .app-input option { background: ${dark ? "#1e2840" : "#fff"}; color: var(--text); }
  select.app-input { cursor:pointer; }

  .btn-gold {
    background:linear-gradient(135deg,#f5c842,#f59e0b);
    color:#0b0e17; font-weight:600; font-family:'Sora',sans-serif;
    border:none; border-radius:10px; padding:11px 24px;
    cursor:pointer; font-size:13px; letter-spacing:0.3px;
    transition:all 0.2s; box-shadow:0 4px 20px rgba(245,200,66,0.3);
  }
  .btn-gold:hover { transform:translateY(-1px); box-shadow:0 6px 28px rgba(245,200,66,0.4); }
  .btn-gold:active { transform:translateY(0); }

  .btn-ghost {
    background:transparent; border:1px solid var(--border);
    color:var(--muted); font-family:'Sora',sans-serif;
    border-radius:10px; padding:10px 20px; cursor:pointer;
    font-size:13px; transition:all 0.2s;
  }
  .btn-ghost:hover { border-color:${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}; color:var(--text); }

  .mood-bubble {
    display:flex; flex-direction:column; align-items:center; gap:6px;
    padding:14px 18px; border-radius:14px; border:2px solid transparent;
    cursor:pointer; transition:all 0.2s;
    background:${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
    font-size:26px; min-width:80px;
  }
  .mood-bubble:hover { transform:translateY(-3px); background:${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}; }
  .mood-bubble.selected { border-color:var(--gold); background:rgba(245,200,66,0.1); }
  .mood-bubble span.label { font-size:10px; font-family:'DM Mono',monospace; color:var(--muted); }
  .mood-bubble.selected span.label { color:var(--gold); }

  .doctor-card { animation: doctorSlide 0.5s cubic-bezier(0.22,1,0.36,1); }
  .goal-bar-track { height:8px; background:rgba(255,255,255,0.08); border-radius:99px; overflow:hidden; }
  .goal-bar-fill  { height:100%; border-radius:99px; transition:width 1.2s cubic-bezier(0.22,1,0.36,1); }

  .feed-item { border-left:2px solid transparent; transition:all 0.2s; cursor:pointer; }
  .feed-item:hover { border-left-color:var(--gold); background:${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}; }

  .college-tag { font-size:10px; padding:2px 8px; border-radius:99px; background:rgba(167,139,250,0.15); color:var(--violet); font-family:'DM Mono',monospace; }

  .personality-glow-saver   { box-shadow: 0 0 40px rgba(74,222,128,0.12); }
  .personality-glow-risk    { box-shadow: 0 0 40px rgba(251,113,133,0.12); }
  .personality-glow-social  { box-shadow: 0 0 40px rgba(56,189,248,0.12); }
  .personality-glow-impulse { box-shadow: 0 0 40px rgba(245,200,66,0.12); }

  .feed-scroll { max-height:320px; overflow-y:auto; padding-right:4px; }

  @media (max-width:640px) {
    .sidebar { display:none !important; }
    .main-content { margin-left:0 !important; padding-bottom:80px; }
    .mobile-nav { display:flex !important; }
  }

  .mobile-nav {
    display:none; position:fixed; bottom:0; left:0; right:0; z-index:50;
    background:${dark ? "rgba(11,14,23,0.95)" : "rgba(245,242,236,0.97)"};
    backdrop-filter:blur(20px); border-top:1px solid var(--border);
    padding:10px 0 16px; justify-content:space-around;
  }

  .ticker-inner { animation:ticker 18s linear infinite; white-space:nowrap; }
  .ticker-inner:hover { animation-play-state:paused; }

  /* ── DARK / LIGHT TOGGLE ── */
  .theme-toggle {
    display:flex; align-items:center; gap:8px; cursor:pointer;
    padding:9px 14px; border-radius:12px; border:1px solid var(--border);
    background:${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
    transition:all 0.2s; width:100%;
  }
  .theme-toggle:hover { border-color:rgba(245,200,66,0.4); }
  .toggle-track {
    width:40px; height:22px; border-radius:99px; position:relative;
    transition:background 0.25s; flex-shrink:0;
  }
  .toggle-thumb {
    position:absolute; top:3px; width:16px; height:16px; border-radius:50%;
    background:#fff; transition:left 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow:0 1px 4px rgba(0,0,0,0.3);
  }

  /* ── STREAK SYSTEM ── */
  .streak-milestone {
    border-radius:14px; padding:16px 18px;
    border:1px solid var(--border); transition:all 0.25s;
  }
  .streak-milestone.reached { box-shadow:0 0 20px rgba(245,200,66,0.15); }

  /* ── HEATMAP ── */
  .hm-cell {
    width:13px; height:13px; border-radius:3px;
    cursor:pointer; transition:transform 0.15s;
    flex-shrink:0; position:relative;
  }
  .hm-cell:hover { transform:scale(1.5); z-index:5; }
  .hm-tip {
    position:absolute; bottom:calc(100% + 6px); left:50%;
    transform:translateX(-50%);
    background:${dark ? "#1e2840" : "#fff"}; border:1px solid var(--border);
    border-radius:8px; padding:5px 9px; font-size:10px;
    white-space:nowrap; pointer-events:none; z-index:100;
    box-shadow:var(--shadow); color:var(--text);
  }

  /* ── RANGE SLIDER ── */
  input[type="range"] {
    -webkit-appearance:none; width:100%; height:5px;
    border-radius:99px; outline:none; cursor:pointer;
    background:${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance:none; width:18px; height:18px; border-radius:50%;
    background:var(--gold); box-shadow:0 0 8px rgba(245,200,66,0.5); cursor:pointer;
  }

  /* ── FINANCE CARD ── */
  .fc-card {
    width:340px; height:200px; border-radius:20px;
    position:relative; overflow:hidden; flex-shrink:0;
    animation:cardFloat 4s ease-in-out infinite;
  }
  .fc-shine {
    position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%);
    background-size:200% auto;
    animation:cardShimmer 3s linear infinite;
  }

  /* ── REGRET BUTTONS ── */
  .regret-btn {
    border:none; border-radius:8px; cursor:pointer;
    padding:5px 12px; font-size:11px;
    font-family:'DM Mono',monospace; transition:all 0.2s;
  }
  .regret-btn.yes { background:rgba(251,113,133,0.1); color:#fb7185; }
  .regret-btn.yes:hover, .regret-btn.yes.active { background:rgba(251,113,133,0.22); animation:regretPulse 1.5s ease infinite; }
  .regret-btn.no  { background:rgba(74,222,128,0.1); color:#4ade80; }
  .regret-btn.no:hover, .regret-btn.no.active   { background:rgba(74,222,128,0.2); }

  /* ── UPI MODAL CSS ── */
  .modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,0.75);
    backdrop-filter:blur(10px); z-index:300;
    display:flex; align-items:center; justify-content:center; padding:20px;
  }
  .pop-in { animation:popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes popIn { 0%{opacity:0;transform:scale(0.88);} 60%{transform:scale(1.04);} 100%{opacity:1;transform:scale(1);} }
  @keyframes ping  { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.12);opacity:0.7;} }
  @keyframes lockPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4);} 50%{box-shadow:0 0 0 12px rgba(239,68,68,0);} }
  .lock-ring { animation:lockPulse 1.8s ease infinite; }
  .live-dot  { width:7px; height:7px; border-radius:50%; background:#AAFF00; display:inline-block; animation:pulse 1.5s ease-in-out infinite; box-shadow:0 0 6px #AAFF00; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  .mood-btn {
    display:flex; flex-direction:column; align-items:center; gap:5px;
    padding:12px 16px; border-radius:12px; border:2px solid var(--border);
    background:${dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)"};
    font-size:26px; min-width:78px; cursor:pointer; transition:all 0.2s;
  }
  .mood-btn:hover { transform:translateY(-2px); }
  .mood-btn.sel   { border-color:#00E5CC; background:rgba(0,229,204,0.1); }
  .mood-btn .mlabel { font-size:10px; font-family:'DM Mono',monospace; color:var(--muted); }
  .mood-btn.sel .mlabel { color:#00E5CC; }
  .btn-primary-upi {
    background:linear-gradient(135deg,#00E5CC,#00B8A0); color:#0A0F1E;
    border:none; border-radius:10px; padding:11px 22px;
    font-weight:700; font-size:14px; cursor:pointer; width:100%;
    transition:all 0.2s; box-shadow:0 4px 16px rgba(0,229,204,0.3);
  }
  .btn-primary-upi:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(0,229,204,0.4); }
  .btn-danger-upi {
    background:linear-gradient(135deg,#EF4444,#DC2626); color:#fff;
    border:none; border-radius:10px; padding:11px 22px;
    font-weight:700; font-size:14px; cursor:pointer; flex:1;
    transition:all 0.2s;
  }
`;


/* ─────────────────────────────────────────────
   DATA & CONSTANTS
───────────────────────────────────────────── */
const EMOTIONS = [
  { id: "stress",   emoji: "😤", label: "Stress",   color: "#fb7185" },
  { id: "joy",      emoji: "😄", label: "Joy",       color: "#4ade80" },
  { id: "boredom",  emoji: "😑", label: "Boredom",   color: "#38bdf8" },
  { id: "peer",     emoji: "🤝", label: "Peer Press", color: "#a78bfa" },
  { id: "anxiety",  emoji: "😰", label: "Anxiety",   color: "#f59e0b" },
  { id: "happy",    emoji: "🥳", label: "Celebrat.", color: "#f5c842" },
];

const COLLEGE_CATS = [
  { id: "canteen",  label: "🍛 Canteen",   color: "#f59e0b" },
  { id: "xerox",    label: "📋 Xerox",     color: "#38bdf8" },
  { id: "treat",    label: "🎉 Treat",     color: "#4ade80" },
  { id: "travel",   label: "🚌 Travel",    color: "#a78bfa" },
  { id: "fine",     label: "🚨 Fine",      color: "#fb7185" },
  { id: "stationary",label:"📚 Stationery",color: "#fde68a" },
  { id: "mess",     label: "🥘 Mess Bill", color: "#2dd4bf" },
  { id: "hostel",   label: "🏠 Hostel",   color: "#f5c842" },
];

const PERSONALITIES = {
  saver:   { label: "The Saver",      emoji: "🏦", desc: "You're future-focused. Most spends happen in Joy/Celebration.", color: "#4ade80", cls: "personality-glow-saver" },
  risk:    { label: "Risk Taker",     emoji: "🎲", desc: "You spend big on impulse. Anxiety-driven spikes detected.",    color: "#fb7185", cls: "personality-glow-risk" },
  social:  { label: "Social Spender", emoji: "🤝", desc: "Peer pressure is your kryptonite. Group outings cost you.",    color: "#38bdf8", cls: "personality-glow-social" },
  impulse: { label: "Impulse Buyer",  emoji: "⚡", desc: "Boredom + instant gratification = your spending pattern.",    color: "#f5c842", cls: "personality-glow-impulse" },
};

const GOALS = [
  { id: 1, label: "🖥️ New Laptop",    target: 55000, saved: 18200, daily: 100, emoji: "🖥️", months: 12 },
  { id: 2, label: "✈️ Goa Trip",       target: 12000, saved: 7400,  daily: 50,  emoji: "✈️", months: 3  },
  { id: 3, label: "🎧 AirPods",        target: 8000,  saved: 2100,  daily: 80,  emoji: "🎧", months: 4  },
];

const SEED_EXPENSES = [
  { id: 1,  desc: "Maggi at Canteen",    amount: 40,   cat: "canteen",    emotion: "stress",  time: "Today, 11:32 AM", college: true },
  { id: 2,  desc: "Semester Xerox Set",  amount: 120,  cat: "xerox",      emotion: "anxiety", time: "Today, 9:15 AM",  college: true },
  { id: 3,  desc: "Birthday Treat",      amount: 650,  cat: "treat",      emotion: "joy",     time: "Yesterday",       college: true },
  { id: 4,  desc: "Ola Auto (late)",     amount: 85,   cat: "travel",     emotion: "stress",  time: "Yesterday",       college: true },
  { id: 5,  desc: "Library Fine",        amount: 30,   cat: "fine",       emotion: "anxiety", time: "Mon",             college: true },
  { id: 6,  desc: "Snack run (bored)",   amount: 180,  cat: "canteen",    emotion: "boredom", time: "Sun",             college: true },
  { id: 7,  desc: "Group dinner",        amount: 340,  cat: "treat",      emotion: "peer",    time: "Sat",             college: false },
  { id: 8,  desc: "Random Amazon buy",   amount: 499,  cat: "stationary", emotion: "boredom", time: "Fri",             college: false },
];

const ALTERNATIVES = {
  stress:  ["Try a 2-min box breathing exercise 🌬️", "Step outside for 5 min 🌿", "Drink a glass of water slowly 💧"],
  boredom: ["Watch one YouTube chapter of a course 📖", "Text a friend you haven't talked to 💬", "Do 20 jumping jacks ⚡"],
  anxiety: ["Write 3 things you're grateful for 📝", "Listen to lo-fi for 10 min 🎵", "Tidy your desk space 🗂️"],
  peer:    ["Suggest a free campus hangout next time 🌳", "Check if this is FOMO or genuine joy 🤔", "Remember: friends don't judge your wallet 💛"],
  joy:     ["Celebrate with a free activity too! 🎉", "Save 10% of this spend amount 💰", "Share the joy — not the bill 😄"],
  happy:   ["Capture this memory, not just the spend 📸", "Budget for celebrations in advance 🗓️", "Great — you deserved it! 🥳"],
};

/* ─────────────────────────────────────────────
   UPI SMS PARSER (from SentimentalSpend v2)
───────────────────────────────────────────── */
const UPI_PATTERNS = [
  { re: /Rs\.?\s*([\d,]+(?:\.\d{1,2})?)\s+debited.*?(?:to|@)\s+([A-Za-z0-9\s\.\-]+?)(?:\s+on|\s+Ref|\.)/i,   bank: "HDFC" },
  { re: /INR\s*([\d,]+(?:\.\d{1,2})?)\s+debited.*?(?:to|at)\s+([A-Za-z0-9\s\.\-]+?)(?:\s+on|\s+Ref|\.)/i,    bank: "SBI" },
  { re: /Rs\s*([\d,]+(?:\.\d{1,2})?)\s+debited\s+from.*?to\s+VPA\s+([A-Za-z0-9@\.\_\-]+)/i,                  bank: "ICICI" },
  { re: /(?:debited|paid|sent)\s+(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)\s+(?:to|via|at|for)\s+([A-Za-z0-9\s@\.\-]+?)(?:\s+on|\s+Ref|\.|\s+UPI)/i, bank: "Generic" },
  { re: /(?:₹|Rs\.?)\s*([\d,]+(?:\.\d{1,2})?)\s+(?:transferred to|sent to|paid to)\s+([A-Za-z0-9\s@\.\-]+?)(?:\s+via|\s+on|\.)/i, bank: "Wallet" },
];
const UPI_TIME_PATTERN = /\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4})\b/i;
const UPI_REF_PATTERN  = /(?:Ref(?:No)?\.?|UPI Ref\.?|Txn\.?)\s*:?\s*([A-Z0-9]{10,20})/i;
function parseUPISMS(sms) {
  if (!sms || typeof sms !== "string") return null;
  let amount = null, merchant = null, bank = "Unknown";
  for (const p of UPI_PATTERNS) {
    const m = sms.match(p.re);
    if (m) { amount = parseFloat(m[1].replace(/,/g, "")); merchant = m[2]?.trim().replace(/\s+/g, " ").replace(/[^\w\s@.\-]/g, "") || "Unknown"; bank = p.bank; break; }
  }
  const timeMatch = sms.match(UPI_TIME_PATTERN);
  const refMatch  = sms.match(UPI_REF_PATTERN);
  const time      = timeMatch ? timeMatch[1] : new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
  const ref       = refMatch  ? refMatch[1]  : `UPI${Math.random().toString(36).slice(2,12).toUpperCase()}`;
  if (!amount) return null;
  return { amount, merchant, bank, time, ref, raw: sms };
}
const SAMPLE_SMS = [
  "Rs.250.00 debited from A/c XX1234 to Zomato on 07-03-2026 Ref UPI2603071234",
  "INR 85 debited from your SBI ac on 07-03 to Canteen via UPI. Ref No: SBI1234567890",
  "₹199 transferred to Netflix via UPI on 07-03-2026. Ref HDFC2603005678",
  "Rs.340.00 sent to Rohit Kumar via PhonePe UPI on 07-03 10:30 PM Ref PP2603001111",
  "INR 149 paid to Spotify AutoPay via UPI on 07-03-2026 Ref SPTY2603004321",
  "₹500 debited. Paid to Swiggy at 08:45 PM on 07-03-2026 UPI Ref 112603009999",
];


/* ─────────────────────────────────────────────
   SEED DATA — Heatmap + Achievements
───────────────────────────────────────────── */
function genHeatmap() {
  const cells = [], today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const isWE = d.getDay() === 0 || d.getDay() === 6;
    const rand = Math.random();
    const amt  = rand < 0.1 ? 0 : Math.round((isWE ? 320 : 130) * (0.2 + rand * 1.7));
    const sr   = Math.random();
    cells.push({
      date: d.toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
      dow:  d.getDay(), amt,
      stressAmt: Math.round(amt * (sr < 0.3 ? sr * 1.1 : sr * 0.3)),
      isToday: i === 0,
    });
  }
  return cells;
}
const HEATMAP_DATA = genHeatmap();

const ACHIEVEMENTS = [
  { id:"first",   emoji:"📝", label:"First Log",    desc:"Logged your first expense",         xp:50,  done:true  },
  { id:"calm3",   emoji:"🧘", label:"Calm 3-Day",   desc:"Zero stress-spend 3 days in a row",  xp:150, done:true  },
  { id:"saver",   emoji:"🏦", label:"Saver Mode",   desc:"Health score above 80",              xp:300, done:false },
  { id:"streak7", emoji:"🔥", label:"Week Warrior", desc:"7-day no-stress streak",             xp:400, done:false },
  { id:"social",  emoji:"🤝", label:"Social Star",  desc:"Logged 10 group transactions",       xp:120, done:true  },
  { id:"regret0", emoji:"😌", label:"No Regrets",   desc:"Zero regret flags for 5 days",       xp:180, done:true  },
  { id:"night",   emoji:"🌙", label:"Night Guard",  desc:"No spends after 11 PM for 7 days",   xp:250, done:false },
  { id:"sub",     emoji:"✂️", label:"Sub Buster",   desc:"Cancelled an unused subscription",   xp:200, done:false },
];

/* ─────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────── */
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

function getEmotion(id) {
  return EMOTIONS.find((e) => e.id === id) || EMOTIONS[0];
}

function classifyPersonality(expenses) {
  const counts = {};
  expenses.forEach((e) => { counts[e.emotion] = (counts[e.emotion] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (top === "stress" || top === "anxiety") return "risk";
  if (top === "boredom") return "impulse";
  if (top === "peer") return "social";
  return "saver";
}

function calcHealthScore(expenses) {
  const negEmotions = ["stress", "boredom", "anxiety", "peer"];
  const badSpend = expenses.filter((e) => negEmotions.includes(e.emotion)).reduce((s, e) => s + e.amount, 0);
  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);
  if (!totalSpend) return 85;
  const ratio = badSpend / totalSpend;
  return Math.round(Math.max(30, 100 - ratio * 70));
}

function getDoctorTip(expenses) {
  const negEmotions = ["stress", "boredom", "anxiety"];
  const today = expenses.filter((e) => e.time.includes("Today") && negEmotions.includes(e.emotion));
  if (!today.length) return null;
  const total = today.reduce((s, e) => s + e.amount, 0);
  const emotion = today[today.length - 1].emotion;
  const alt = ALTERNATIVES[emotion]?.[Math.floor(Math.random() * 3)] || ALTERNATIVES.stress[0];
  return { total, emotion, alt };
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/* Budget Health Score — Gamified Circle */
function HealthScore({ score }) {
  const r = 52, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score > 70 ? "#4ade80" : score > 45 ? "#f59e0b" : "#fb7185";
  const label = score > 70 ? "Healthy" : score > 45 ? "Cautious" : "At Risk";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <div className="pulse-ring" style={{ borderColor: color }} />
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            className="score-ring"
            cx="65" cy="65" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)`, transition: "stroke-dasharray 1.2s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
          <span className="font-mono" style={{ fontSize: 26, fontWeight: 500, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>/ 100</span>
        </div>
      </div>
      <span style={{ fontSize: 11, color, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>{label.toUpperCase()}</span>
    </div>
  );
}

/* Emotion Pill */
function EmotionPill({ emotionId }) {
  const e = getEmotion(emotionId);
  return (
    <span className="emotion-pill" style={{ background: `${e.color}1a`, color: e.color }}>
      {e.emoji} {e.label}
    </span>
  );
}

/* Spend Feed Item */
function FeedItem({ expense, onClick }) {
  const cat = [...COLLEGE_CATS].find((c) => c.id === expense.cat);
  return (
    <div
      className="feed-item slide-up"
      onClick={() => onClick(expense)}
      style={{ padding: "12px 14px", borderRadius: 12, marginBottom: 6 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${cat?.color || "#f5c842"}18`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
        }}>
          {cat?.label?.split(" ")[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{expense.desc}</span>
            <span className="font-mono" style={{ fontSize: 13, color: "#fb7185", fontWeight: 500, flexShrink: 0, marginLeft: 8 }}>
              -{fmt(expense.amount)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
            <EmotionPill emotionId={expense.emotion} />
            {expense.college && <span className="college-tag">College</span>}
            <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>{expense.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Mood Check Modal */
function MoodCheck({ expense, onDone }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);

  const handleMood = (id) => {
    setSelected(id);
    setTimeout(() => { setStep(1); }, 300);
  };

  const alt = selected ? ALTERNATIVES[selected]?.[0] : "";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div className="glass mood-overlay" style={{ maxWidth: 420, width: "100%", padding: 28 }}>
        {step === 0 ? (
          <>
            <div style={{ marginBottom: 4, fontSize: 11, color: "var(--gold)", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
              MOOD CHECK · 2 SEC
            </div>
            <h2 className="font-display" style={{ fontSize: 20, marginBottom: 6 }}>
              How were you feeling?
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>
              You just logged <strong style={{ color: "var(--gold)" }}>{fmt(expense.amount)}</strong> on "<em>{expense.desc}</em>". What was behind it?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 22 }}>
              {EMOTIONS.map((e) => (
                <button
                  key={e.id}
                  className={`mood-bubble ${selected === e.id ? "selected" : ""}`}
                  onClick={() => handleMood(e.id)}
                >
                  {e.emoji}
                  <span className="label">{e.label}</span>
                </button>
              ))}
            </div>
            <button className="btn-ghost" style={{ width: "100%" }} onClick={() => onDone(null)}>
              Skip for now
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div className="breathe" style={{ fontSize: 48, marginBottom: 10 }}>
                {getEmotion(selected).emoji}
              </div>
              <h2 className="font-display" style={{ fontSize: 18, marginBottom: 8 }}>
                {selected === "joy" || selected === "happy" ? "Great choice!" : "We've got you 💛"}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                {selected !== "joy" && selected !== "happy"
                  ? `Spending when ${getEmotion(selected).label.toLowerCase()} can add up. Next time, try:`
                  : "Keep the good vibes! A small tip:"}
              </p>
              <div style={{
                margin: "16px 0",
                padding: "14px 18px",
                background: "rgba(245,200,66,0.08)",
                border: "1px solid rgba(245,200,66,0.2)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--text)",
                lineHeight: 1.5
              }}>
                {alt}
              </div>
            </div>
            <button className="btn-gold" style={{ width: "100%" }} onClick={() => onDone(selected)}>
              Got it, save this entry ✓
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* Add Expense Form */
function AddExpense({ onAdd, onClose, collegeMode }) {
  const [form, setForm] = useState({ desc: "", amount: "", cat: "canteen" });
  const [showMood, setShowMood] = useState(false);
  const [pending, setPending] = useState(null);

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.desc || !form.amount) return;
    const entry = {
      id: Date.now(), desc: form.desc, amount: parseInt(form.amount),
      cat: form.cat, emotion: "stress", time: "Today, just now", college: collegeMode
    };
    setPending(entry);
    setShowMood(true);
  };

  const finalize = (emotion) => {
    const final = { ...pending, emotion: emotion || "joy" };
    onAdd(final);
    setShowMood(false);
    onClose();
  };

  const cats = collegeMode ? COLLEGE_CATS : [
    { id: "food", label: "🍔 Food" }, { id: "shopping", label: "🛍️ Shopping" },
    { id: "transport", label: "🚗 Transport" }, { id: "bills", label: "💡 Bills" },
    { id: "entertainment", label: "🎮 Entertainment" }, { id: "health", label: "💊 Health" },
  ];

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
        zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
      }}>
        <div className="glass mood-overlay" style={{ maxWidth: 400, width: "100%", padding: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--gold)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, marginBottom: 2 }}>
                {collegeMode ? "COLLEGE MODE" : "STANDARD"} · LOG EXPENSE
              </div>
              <h2 className="font-display" style={{ fontSize: 20 }}>Add a Spend</h2>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "var(--muted)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 5 }}>Description</label>
              <input className="app-input" placeholder={collegeMode ? "e.g. Canteen Maggi, Xerox set..." : "What did you spend on?"} value={form.desc} onChange={(e) => handle("desc", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 5 }}>Amount (₹)</label>
              <input className="app-input font-mono" type="number" placeholder="0" value={form.amount} onChange={(e) => handle("amount", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 5 }}>Category</label>
              <select className="app-input" value={form.cat} onChange={(e) => handle("cat", e.target.value)}>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn-gold" style={{ flex: 2 }} onClick={submit}>Log & Check Mood →</button>
            </div>
          </div>
        </div>
      </div>
      {showMood && pending && <MoodCheck expense={pending} onDone={finalize} />}
    </>
  );
}

/* Financial Mood Doctor Card */
function DoctorCard({ tip }) {
  if (!tip) return (
    <div className="glass" style={{ padding: 18, borderRadius: 14, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 28 }}>🩺</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--green)" }}>Mood Doctor</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>No stress-spending detected today. Keep it up!</div>
      </div>
    </div>
  );

  const e = getEmotion(tip.emotion);
  return (
    <div className="glass doctor-card" style={{
      padding: 18, borderRadius: 14,
      border: `1px solid ${e.color}33`,
      background: `linear-gradient(135deg, rgba(22,29,46,0.9) 0%, ${e.color}0a 100%)`
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 26, flexShrink: 0 }}>🩺</div>
        <div>
          <div style={{ fontSize: 11, color: e.color, fontFamily: "'DM Mono',monospace", letterSpacing: 0.5, marginBottom: 4 }}>
            MOOD DOCTOR ALERT
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 8 }}>
            You've spent <strong style={{ color: "var(--gold)" }}>{fmt(tip.total)}</strong> while{" "}
            <span style={{ color: e.color }}>{e.emoji} {e.label.toLowerCase()}</span> today.
          </p>
          <div style={{
            padding: "9px 12px",
            background: "rgba(245,200,66,0.07)",
            borderRadius: 10,
            fontSize: 12,
            color: "var(--text)"
          }}>
            💡 {tip.alt}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Future Goal Card */
function GoalCard({ goal }) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const remaining = goal.target - goal.saved;
  const daysLeft = Math.ceil(remaining / (goal.daily || 50));
  const colors = ["#f5c842", "#4ade80", "#38bdf8", "#a855f7", "#f97316", "#00e5cc"];
  const color = colors[goal.id % colors.length];

  return (
    <div className="glass slide-up" style={{ padding: 18, borderRadius: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 22, marginBottom: 2 }}>{goal.emoji}</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{goal.label.replace(/^\S+\s/, "")}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="font-mono" style={{ fontSize: 18, color, fontWeight: 500 }}>{pct}%</div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>of goal</div>
        </div>
      </div>
      <div className="goal-bar-track" style={{ marginBottom: 10 }}>
        <div className="goal-bar-fill fill-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: "var(--muted)" }}>{fmt(goal.saved)} saved</span>
        <span style={{ color: "var(--muted)" }}>{fmt(goal.target)} goal</span>
      </div>
      <div style={{
        marginTop: 10, padding: "7px 10px", borderRadius: 9,
        background: `${color}12`, fontSize: 11, color
      }}>
        ₹{goal.daily}/day → {daysLeft} days to reach your goal 🚀
      </div>
    </div>
  );
}

/* Spending Personality Card */
function PersonalityCard({ expenses }) {
  const pKey = classifyPersonality(expenses);
  const p = PERSONALITIES[pKey];

  // Mini emotion breakdown
  const counts = {};
  expenses.forEach((e) => { counts[e.emotion] = (counts[e.emotion] || 0) + e.amount; });
  const total = Object.values(counts).reduce((s, v) => s + v, 0);

  return (
    <div className={`glass ${p.cls}`} style={{ padding: 20, borderRadius: 14, border: `1px solid ${p.color}22` }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 36 }}>{p.emoji}</div>
        <div>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: p.color, letterSpacing: 1, marginBottom: 3 }}>
            YOUR SPENDING PERSONALITY
          </div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 600 }}>{p.label}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{p.desc}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>Emotional spend breakdown</div>
      {Object.entries(counts).slice(0, 4).map(([eid, amt]) => {
        const em = getEmotion(eid);
        const pctW = total ? Math.round((amt / total) * 100) : 0;
        return (
          <div key={eid} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: em.color }}>{em.emoji} {em.label}</span>
              <span className="font-mono" style={{ color: "var(--muted)" }}>{fmt(amt)} · {pctW}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
              <div className="fill-bar" style={{ width: `${pctW}%`, height: "100%", background: em.color, borderRadius: 99 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* College Mode Dashboard */
function CollegeMode({ expenses }) {
  const collegeSpends = expenses.filter((e) => e.college);
  const byCat = {};
  COLLEGE_CATS.forEach((c) => { byCat[c.id] = { label: c.label, color: c.color, total: 0 }; });
  collegeSpends.forEach((e) => { if (byCat[e.cat]) byCat[e.cat].total += e.amount; });
  const sorted = Object.values(byCat).filter((b) => b.total > 0).sort((a, b) => b.total - a.total);
  const grandTotal = sorted.reduce((s, b) => s + b.total, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div style={{ fontSize: 24 }}>🎓</div>
        <div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>College Mode</h2>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>Hostel & campus spend breakdown</p>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div className="font-mono" style={{ fontSize: 20, color: "var(--gold)" }}>{fmt(grandTotal)}</div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>this week</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }} className="stagger">
        {COLLEGE_CATS.map((cat) => {
          const total = byCat[cat.id]?.total || 0;
          const pct = grandTotal ? Math.round((total / grandTotal) * 100) : 0;
          return (
            <div key={cat.id} className="glass slide-up" style={{
              padding: "14px 16px", borderRadius: 14,
              borderLeft: `3px solid ${cat.color}`,
              opacity: total === 0 ? 0.4 : 1
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.label.split(" ")[0]}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{cat.label.replace(/^\S+\s/, "")}</div>
              <div className="font-mono" style={{ fontSize: 15, fontWeight: 500, color: cat.color }}>{fmt(total)}</div>
              {total > 0 && (
                <div style={{ marginTop: 6, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
                  <div className="fill-bar" style={{ width: `${pct}%`, height: "100%", background: cat.color, borderRadius: 99 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bill Splitter */}
      <BillSplitter />
    </div>
  );
}

/* ─────────────────────────────────────────────
   BILL SPLITTER COMPONENT
───────────────────────────────────────────── */
function BillSplitter() {
  const [splits, setSplits] = useState([
    { id: 1, title: "Goa Trip 🌊", total: 4800, members: [{ name: "You", upi: "you@upi" }, { name: "Rohit", upi: "rohit@okaxis" }, { name: "Priya", upi: "priya@paytm" }] },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTotal, setNewTotal] = useState("");
  const [newMembers, setNewMembers] = useState([{ name: "", upi: "" }]);

  const addSplit = () => {
    if (!newTitle || !newTotal) return;
    setSplits(prev => [...prev, { id: Date.now(), title: newTitle, total: parseFloat(newTotal), members: newMembers.filter(m => m.name) }]);
    setNewTitle(""); setNewTotal(""); setNewMembers([{ name: "", upi: "" }]); setShowForm(false);
  };
  const removeSplit = (id) => setSplits(prev => prev.filter(s => s.id !== id));
  const addMember = () => setNewMembers(prev => [...prev, { name: "", upi: "" }]);
  const removeMember = (i) => setNewMembers(prev => prev.filter((_, idx) => idx !== i));
  const updateMember = (i, field, val) => setNewMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  return (
    <div className="glass" style={{ padding: 18, borderRadius: 14, border: "1px solid rgba(167,139,250,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "var(--violet)", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>✂️ BILL SPLITTER</div>
        <button onClick={() => setShowForm(v => !v)} style={{
          padding: "5px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer",
          background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--violet)"
        }}>+ New Split</button>
      </div>

      {/* New split form */}
      {showForm && (
        <div style={{ marginBottom: 16, padding: 14, borderRadius: 12, background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Split title (e.g. Goa Trip)" style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
            <input value={newTotal} onChange={e => setNewTotal(e.target.value)} type="number" placeholder="Total amount (₹)" style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>Members</div>
          {newMembers.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input value={m.name} onChange={e => updateMember(i, "name", e.target.value)} placeholder="Name" style={{ flex: 1, padding: "6px 9px", borderRadius: 7, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
              <input value={m.upi} onChange={e => updateMember(i, "upi", e.target.value)} placeholder="UPI ID" style={{ flex: 1.4, padding: "6px 9px", borderRadius: 7, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
              {newMembers.length > 1 && <button onClick={() => removeMember(i)} style={{ padding: "6px 9px", borderRadius: 7, background: "rgba(255,77,141,0.1)", border: "1px solid rgba(255,77,141,0.2)", color: "var(--rose)", cursor: "pointer", fontSize: 13 }}>✕</button>}
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={addMember} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer", background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.2)", color: "var(--cyan)" }}>+ Member</button>
            <button onClick={addSplit} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer", background: "rgba(167,139,250,0.2)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--violet)", fontWeight: 600 }}>Create Split</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "6px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Existing splits */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {splits.map(s => {
          const share = s.members.length ? Math.round(s.total / s.members.length) : 0;
          return (
            <div key={s.id} style={{ padding: 14, borderRadius: 12, background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Total ₹{s.total.toLocaleString("en-IN")} · {s.members.length} members · ₹{share.toLocaleString("en-IN")} each</div>
                </div>
                <button onClick={() => removeSplit(s.id)} style={{ padding: "4px 8px", borderRadius: 7, background: "rgba(255,77,141,0.08)", border: "1px solid rgba(255,77,141,0.2)", color: "var(--rose)", cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {s.members.map((m, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 90, background: "rgba(167,139,250,0.08)", borderRadius: 9, padding: "9px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: 16, marginBottom: 3 }}>👤</div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{m.name}</div>
                    {m.upi && <div style={{ fontSize: 9, color: "var(--cyan)", marginTop: 2, fontFamily: "'DM Mono',monospace" }}>{m.upi}</div>}
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--violet)", marginTop: 4 }}>₹{share.toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────
   THEME TOGGLE BUTTON
───────────────────────────────────────────── */
function ThemeToggle({ dark, toggle }) {
  return (
    <button className="theme-toggle" onClick={toggle}>
      <div className="toggle-track" style={{ background: dark ? "rgba(245,200,66,0.35)" : "rgba(0,0,0,0.15)" }}>
        <div className="toggle-thumb" style={{ left: dark ? "21px" : "3px" }}/>
      </div>
      <span style={{ fontSize:13, color:"var(--muted)", fontFamily:"'DM Mono',monospace", letterSpacing:0.5 }}>
        {dark ? "☀️ Light mode" : "🌙 Dark mode"}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────
   NEW FEATURE 1 — STREAK SYSTEM 🔥
───────────────────────────────────────────── */
function StreakSystem({ expenses, score }) {
  const streak = 4;
  const totalXP  = ACHIEVEMENTS.filter(a=>a.done).reduce((s,a)=>s+a.xp,0);
  const level    = Math.floor(totalXP/200)+1;
  const levelXP  = totalXP%200;

  const MILESTONES = [
    {days:3,  reward:"🌿 Calm Badge",     color:"#4ade80"},
    {days:7,  reward:"🔥 Week Warrior",   color:"#f59e0b"},
    {days:14, reward:"⚡ Fortnight Flash",color:"#38bdf8"},
    {days:30, reward:"👑 Month Master",   color:"#f5c842"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Hero */}
      <div className="glass" style={{
        padding:"28px 26px", borderRadius:"var(--radius)",
        background:"linear-gradient(135deg,var(--panel) 0%,rgba(245,200,66,0.07) 100%)",
        border:"1px solid rgba(245,200,66,0.2)",
        display:"flex", alignItems:"center", gap:28
      }}>
        <div style={{textAlign:"center", flexShrink:0}}>
          <div className="fire-anim" style={{fontSize:60,lineHeight:1}}>🔥</div>
          <div className="font-display" style={{fontSize:52,fontWeight:700,color:"var(--gold)",lineHeight:1,marginTop:4}}>{streak}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>day streak</div>
        </div>
        <div style={{flex:1}}>
          <h2 className="font-display" style={{fontSize:22,marginBottom:8}}>No Stress-Spend Streak!</h2>
          <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.65,marginBottom:16}}>
            You haven't made a stress or anxiety purchase in <strong style={{color:"var(--gold)"}}>{streak} days</strong>. You're saving roughly ₹{streak*65} on impulse buys!
          </p>
          {(() => {
            const next = MILESTONES.find(m=>m.days>streak);
            if (!next) return null;
            const pct = Math.round((streak/next.days)*100);
            return (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",marginBottom:5}}>
                  <span>Next: <span style={{color:next.color}}>{next.reward}</span></span>
                  <span>{streak}/{next.days} days</span>
                </div>
                <div style={{height:7,background:"rgba(255,255,255,0.07)",borderRadius:99}}>
                  <div style={{height:"100%",width:`${pct}%`,borderRadius:99,
                    background:`linear-gradient(90deg,var(--amber),var(--gold))`,
                    boxShadow:"0 0 8px rgba(245,200,66,0.4)",
                    animation:"fillBar 1.4s cubic-bezier(0.22,1,0.36,1) both"
                  }}/>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* XP / Level */}
      <div className="glass" style={{padding:"20px 22px",borderRadius:"var(--radius)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:3}}>XP & LEVEL</div>
            <div className="font-display" style={{fontSize:22,fontWeight:600}}>
              Level <span style={{color:"var(--gold)"}}>{level}</span> · <span className="font-mono">{totalXP}</span> XP
            </div>
          </div>
          <div style={{
            width:50,height:50,borderRadius:"50%",
            background:"rgba(245,200,66,0.1)",border:"2px solid var(--gold)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20
          }}>🏅</div>
        </div>
        <div style={{height:9,background:"rgba(255,255,255,0.06)",borderRadius:99,marginBottom:6}}>
          <div style={{
            height:"100%",width:`${(levelXP/200)*100}%`,borderRadius:99,
            background:"linear-gradient(90deg,var(--gold-dim),var(--gold))",
            boxShadow:"0 0 10px rgba(245,200,66,0.35)",
            animation:"fillBar 1.6s cubic-bezier(0.22,1,0.36,1) both"
          }}/>
        </div>
        <div style={{fontSize:11,color:"var(--muted)"}}>{levelXP}/200 XP to Level {level+1}</div>
      </div>

      {/* Milestones */}
      <div>
        <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:12}}>STREAK MILESTONES</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {MILESTONES.map(m=>{
            const done = streak>=m.days;
            return (
              <div key={m.days} className={`streak-milestone ${done?"reached":""}`}
                style={{opacity:done?1:0.5,border:`1px solid ${done?m.color:"var(--border)"}`,
                  background:done?`linear-gradient(135deg,var(--panel),${m.color}10)`:"var(--panel)"}}>
                <div style={{fontSize:26,marginBottom:6}}>{m.reward.split(" ")[0]}</div>
                <div style={{fontWeight:600,fontSize:13,color:done?m.color:"var(--muted)"}}>{m.days}-Day Streak</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{m.reward}</div>
                {done && <div style={{fontSize:10,color:m.color,marginTop:4}}>✅ Unlocked!</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:12}}>ACHIEVEMENTS</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {ACHIEVEMENTS.map((a,i)=>(
            <div key={a.id} className="glass achieve-pop"
              style={{padding:"14px 16px",borderRadius:14,animationDelay:`${i*0.07}s`,
                opacity:a.done?1:0.4,
                border:a.done?"1px solid rgba(245,200,66,0.2)":"1px solid var(--border)"}}>
              <div style={{fontSize:24,marginBottom:6}}>{a.emoji}</div>
              <div style={{fontWeight:600,fontSize:12,color:a.done?"var(--text)":"var(--muted)"}}>{a.label}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:2,lineHeight:1.4}}>{a.desc}</div>
              <div style={{marginTop:8}}>
                <span className="emotion-pill" style={{
                  background:a.done?"rgba(245,200,66,0.12)":"rgba(255,255,255,0.05)",
                  color:a.done?"var(--gold)":"var(--muted)"
                }}>
                  {a.done?"✅":"🔒"} {a.xp} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW FEATURE 2 — HEATMAP CALENDAR 📅
───────────────────────────────────────────── */
function HeatmapCalendar() {
  const [hover,setHover] = useState(null);
  const [mode, setMode]  = useState("total");

  const weeks = [];
  for (let w=0;w<12;w++) weeks.push(HEATMAP_DATA.slice(w*7,w*7+7));

  const maxAmt = Math.max(...HEATMAP_DATA.map(d=>mode==="stress"?d.stressAmt:d.amt),1);

  function color(cell) {
    const v = mode==="stress"?cell.stressAmt:cell.amt;
    const p = v/maxAmt;
    if (!v) return "rgba(255,255,255,0.05)";
    if (mode==="stress") {
      if(p>0.75) return "#fb7185"; if(p>0.5) return "#f59e0b"; if(p>0.25) return "#f5c842";
      return "rgba(245,200,66,0.3)";
    }
    if(p>0.75) return "var(--gold)"; if(p>0.5) return "rgba(245,200,66,0.7)";
    if(p>0.25) return "rgba(245,200,66,0.4)"; return "rgba(245,200,66,0.15)";
  }

  const totalSpend  = HEATMAP_DATA.reduce((s,d)=>s+d.amt,0);
  const totalStress = HEATMAP_DATA.reduce((s,d)=>s+d.stressAmt,0);
  const zeroDays    = HEATMAP_DATA.filter(d=>d.amt===0).length;
  const activeDays  = HEATMAP_DATA.filter(d=>d.amt>0).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
        <div>
          <h2 className="font-display" style={{fontSize:22,fontWeight:600}}>Spend Heatmap Calendar 📅</h2>
          <p style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Last 84 days of emotional spending intensity</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {["total","stress"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{
              background:mode===m?"rgba(245,200,66,0.12)":"transparent",
              border:`1px solid ${mode===m?"var(--gold)":"var(--border)"}`,
              color:mode===m?"var(--gold)":"var(--muted)",
              borderRadius:9,padding:"6px 14px",cursor:"pointer",
              fontFamily:"'DM Mono',monospace",fontSize:11
            }}>
              {m==="total"?"🗓 Total":"🔴 Stress"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[
          {v:`₹${Math.round(totalSpend/1000)}K`,  l:"84-Day Spend",    c:"var(--gold)"},
          {v:`₹${Math.round(totalStress/1000)}K`, l:"Stress Spend",    c:"var(--rose)"},
          {v:`${activeDays}`,                      l:"Spend Days",      c:"var(--amber)"},
          {v:`${zeroDays}`,                        l:"Zero-Spend Days", c:"var(--green)"},
        ].map(s=>(
          <div key={s.l} className="glass" style={{padding:"13px 15px",borderRadius:14}}>
            <div className="font-mono" style={{fontSize:18,fontWeight:500,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:3}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="glass" style={{padding:"20px 22px",borderRadius:"var(--radius)",overflowX:"auto"}}>
        <div style={{display:"flex",gap:4}}>
          <div style={{display:"flex",flexDirection:"column",gap:3,marginRight:4}}>
            {["S","M","T","W","T","F","S"].map((d,i)=>(
              <div key={i} style={{height:13,fontSize:8,color:"var(--muted)",fontFamily:"'DM Mono',monospace",lineHeight:"13px"}}>{d}</div>
            ))}
          </div>
          {weeks.map((week,wi)=>(
            <div key={wi} style={{display:"flex",flexDirection:"column",gap:3}}>
              {week.map((cell,di)=>(
                <div key={di} style={{position:"relative"}}
                  onMouseEnter={()=>setHover(cell)} onMouseLeave={()=>setHover(null)}>
                  <div className="hm-cell" style={{
                    background:color(cell),
                    outline:cell.isToday?"2px solid var(--gold)":"none",
                    outlineOffset:1
                  }}/>
                  {hover===cell && (
                    <div className="hm-tip">
                      <strong>{cell.date}</strong><br/>
                      💸 ₹{cell.amt}<br/>😤 ₹{cell.stressAmt} stress
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,marginTop:14,justifyContent:"flex-end"}}>
          <span style={{fontSize:10,color:"var(--muted)"}}>Less</span>
          {[0.1,0.3,0.55,0.8,1].map(p=>(
            <div key={p} style={{
              width:13,height:13,borderRadius:3,
              background:p===0.1?"rgba(255,255,255,0.05)":`rgba(245,200,66,${p})`
            }}/>
          ))}
          <span style={{fontSize:10,color:"var(--muted)"}}>More</span>
        </div>
      </div>

      {/* Top days */}
      <div className="glass" style={{padding:"18px 20px",borderRadius:"var(--radius)"}}>
        <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:14}}>
          TOP SPEND DAYS
        </div>
        {(() => {
          const maxDaySpend = Math.max(...HEATMAP_DATA.map(d => d.amt), 1);
          return [...HEATMAP_DATA].sort((a,b)=>b.amt-a.amt).slice(0,5).map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <span className="font-mono" style={{fontSize:12,color:"var(--muted)",width:22}}>#{i+1}</span>
              <span style={{fontSize:12,flex:1,color:"var(--muted)"}}>{d.date}</span>
              <div style={{flex:2,height:6,background:"rgba(255,255,255,0.06)",borderRadius:99}}>
                <div className="fill-bar" style={{
                  width:`${(d.amt / maxDaySpend) * 100}%`,
                  height:"100%",borderRadius:99,background:"var(--gold)"
                }}/>
              </div>
              <span className="font-mono" style={{fontSize:12,color:"var(--rose)",width:60,textAlign:"right"}}>₹{d.amt}</span>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW FEATURE 3 — WHAT-IF SIMULATOR 💡
───────────────────────────────────────────── */
function WhatIfSimulator({ expenses }) {
  const [stressCut,  setStressCut]  = useState(50);
  const [boredomCut, setBoredomCut] = useState(40);
  const [peerCut,    setPeerCut]    = useState(30);
  const [anxietyCut, setAnxietyCut] = useState(35);

  const base = {
    stress:  expenses.filter(e=>e.emotion==="stress").reduce((s,e)=>s+e.amount,0)||240,
    boredom: expenses.filter(e=>e.emotion==="boredom").reduce((s,e)=>s+e.amount,0)||680,
    peer:    expenses.filter(e=>e.emotion==="peer").reduce((s,e)=>s+e.amount,0)||340,
    anxiety: expenses.filter(e=>e.emotion==="anxiety").reduce((s,e)=>s+e.amount,0)||150,
  };

  const savedStress  = Math.round(base.stress  * stressCut  / 100);
  const savedBoredom = Math.round(base.boredom * boredomCut / 100);
  const savedPeer    = Math.round(base.peer    * peerCut    / 100);
  const savedAnxiety = Math.round(base.anxiety * anxietyCut / 100);
  const totalSaved   = savedStress+savedBoredom+savedPeer+savedAnxiety;
  const annualSaved  = totalSaved*12;

  const goals = [
    {label:"AirPods",      cost:8000,  emoji:"🎧"},
    {label:"Goa Trip",     cost:12000, emoji:"🏖️"},
    {label:"New Laptop",   cost:55000, emoji:"💻"},
    {label:"iPhone",       cost:79900, emoji:"📱"},
    {label:"Bike Down Pay",cost:36000, emoji:"🏍️"},
  ];

  const sliders = [
    {label:"😤 Reduce Stress-Spend",   val:stressCut,  set:setStressCut,  saved:savedStress,  color:"#fb7185"},
    {label:"😑 Reduce Boredom-Spend",  val:boredomCut, set:setBoredomCut, saved:savedBoredom, color:"#38bdf8"},
    {label:"🤝 Resist Peer-Pressure",  val:peerCut,    set:setPeerCut,    saved:savedPeer,    color:"#a78bfa"},
    {label:"😰 Cut Anxiety-Spending",  val:anxietyCut, set:setAnxietyCut, saved:savedAnxiety, color:"#f59e0b"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 className="font-display" style={{fontSize:22,fontWeight:600}}>What-If Simulator 💡</h2>
        <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Drag sliders to see how small habit changes turn into life-changing savings</p>
      </div>

      {/* Savings hero */}
      <div className="glass" style={{
        padding:"28px 26px",borderRadius:"var(--radius)",textAlign:"center",
        background:"linear-gradient(135deg,var(--panel) 0%,rgba(245,200,66,0.06) 100%)",
        border:"1px solid rgba(245,200,66,0.2)"
      }}>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>You could save this much per month:</div>
        <div key={totalSaved} className="savings-in font-mono" style={{fontSize:52,fontWeight:500,color:"var(--gold)",lineHeight:1}}>
          {fmt(totalSaved)}
        </div>
        <div style={{fontSize:13,color:"var(--muted)",marginTop:8}}>
          = <strong style={{color:"var(--teal)"}}>{fmt(annualSaved)}</strong> per year
        </div>
      </div>

      {/* Sliders */}
      <div className="glass" style={{padding:"22px 24px",borderRadius:"var(--radius)"}}>
        <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:18}}>
          ADJUST YOUR HABITS
        </div>
        {sliders.map(s=>(
          <div key={s.label} style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:500}}>{s.label}</span>
              <span className="font-mono" style={{fontSize:13,color:s.color,fontWeight:500}}>
                {s.val}% · saves <span style={{color:"var(--green)"}}>{fmt(s.saved)}</span>
              </span>
            </div>
            <input type="range" min={0} max={100} value={s.val}
              onChange={e=>s.set(Number(e.target.value))}
              style={{accentColor:s.color}}/>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="glass" style={{padding:"20px 22px",borderRadius:"var(--radius)"}}>
        <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:16}}>
          HOW LONG TO YOUR GOALS?
        </div>
        {goals.map(g=>{
          const months = totalSaved>0?Math.ceil(g.cost/totalSaved):"∞";
          const ok = typeof months==="number" && months<=24;
          return (
            <div key={g.label} style={{
              display:"flex",alignItems:"center",gap:14,marginBottom:12,
              padding:"12px 14px",borderRadius:12,
              background:ok?"rgba(245,200,66,0.05)":"rgba(255,255,255,0.02)",
              border:`1px solid ${ok?"rgba(245,200,66,0.2)":"var(--border)"}`
            }}>
              <span style={{fontSize:22}}>{g.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500}}>{g.label}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{fmt(g.cost)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="font-display" style={{fontSize:18,fontWeight:600,color:ok?"var(--gold)":"var(--muted)"}}>
                  {months==="∞"?"∞":`${months}mo`}
                </div>
                <div style={{fontSize:10,color:"var(--muted)"}}>{ok?"✅ Achievable":"Adjust sliders"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW FEATURE 4 — SHAREABLE FINANCE CARD 🎴
───────────────────────────────────────────── */
function FinanceCard({ expenses, score }) {
  const [copied,setCopied] = useState(false);
  const [theme,setTheme]   = useState("dark");

  const persona = PERSONALITIES[classifyPersonality(expenses)];
  const total   = expenses.reduce((s,e)=>s+e.amount,0);
  const negTotal= expenses.filter(e=>["stress","boredom","anxiety","peer"].includes(e.emotion)).reduce((s,e)=>s+e.amount,0);
  const stressPct = total ? Math.round((negTotal/total)*100) : 0;
  const topDesc = Object.entries(
    expenses.reduce((m,e)=>{ m[e.desc]=(m[e.desc]||0)+e.amount; return m; }, {})
  ).sort((a,b)=>b[1]-a[1])[0];
  const label = score>70?"Healthy":score>45?"Cautious":"At Risk";
  const scoreColor = score>70?"#4ade80":score>45?"#f59e0b":"#fb7185";

  const THEMES = {
    dark:   {bg:"linear-gradient(135deg,#0b0e17 0%,#161d2e 60%,#0b0e17 100%)",accent:"#f5c842",text:"#fff"},
    teal:   {bg:"linear-gradient(135deg,#021915 0%,#042e28 60%,#021915 100%)",accent:"#2dd4bf",text:"#fff"},
    violet: {bg:"linear-gradient(135deg,#110a1f 0%,#1e1040 60%,#110a1f 100%)",accent:"#a78bfa",text:"#fff"},
    rose:   {bg:"linear-gradient(135deg,#1f0a10 0%,#3a1020 60%,#1f0a10 100%)",accent:"#fb7185",text:"#fff"},
  };
  const ct = THEMES[theme];

  const copy = () => {
    const t = `🎴 SentimentalSpend Card
${persona.emoji} ${persona.label}
💸 Spent: ${fmt(total)}
😤 Emotion-led: ${stressPct}%
🏥 Health: ${score}/100 (${label})

Track yours at SentimentalSpend 🚀`;
    navigator.clipboard?.writeText(t).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 className="font-display" style={{fontSize:22,fontWeight:600}}>Shareable Finance Card 🎴</h2>
        <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Your money personality, beautifully visualized. Made to be shared.</p>
      </div>

      {/* Theme picker */}
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {Object.entries(THEMES).map(([k,v])=>(
          <button key={k} onClick={()=>setTheme(k)} style={{
            width:32,height:32,borderRadius:9,cursor:"pointer",
            background:v.bg,border:`2px solid ${theme===k?v.accent:"transparent"}`,
            transition:"all 0.2s"
          }}/>
        ))}
        <span style={{fontSize:11,color:"var(--muted)",marginLeft:4}}>Choose card theme</span>
      </div>

      {/* Card */}
      <div style={{display:"flex",justifyContent:"center",padding:"20px 0"}}>
        <div className="fc-card" style={{background:ct.bg}}>
          <div className="fc-shine"/>
          {/* Decorative orbs */}
          <div style={{position:"absolute",right:-30,top:-30,width:110,height:110,borderRadius:"50%",background:`${ct.accent}15`,border:`1px solid ${ct.accent}20`}}/>
          <div style={{position:"absolute",right:20,bottom:-35,width:70,height:70,borderRadius:"50%",background:`${ct.accent}0a`}}/>
          {/* Content */}
          <div style={{position:"relative",padding:"22px 24px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:8,color:`${ct.accent}`,fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:3}}>
                  SENTIMENTAL SPEND · 2026
                </div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:ct.text}}>
                  {persona.label}
                </div>
              </div>
              <div style={{fontSize:28}}>{persona.emoji}</div>
            </div>
            <div>
              <div style={{display:"flex",gap:22,marginBottom:12}}>
                {[
                  {l:"HEALTH",v:score,c:scoreColor},
                  {l:"EMOTION%",v:`${stressPct}%`,c:ct.text},
                  {l:"TOTAL",v:fmt(total),c:ct.text},
                ].map(s=>(
                  <div key={s.l}>
                    <div style={{fontSize:7,color:`${ct.accent}99`,fontFamily:"'DM Mono',monospace"}}>{s.l}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{height:3,background:`${ct.accent}25`,borderRadius:99,marginBottom:7}}>
                <div style={{height:"100%",width:`${score}%`,background:ct.accent,borderRadius:99}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:9,color:`${ct.text}55`,fontFamily:"'DM Mono',monospace"}}>
                  TOP: {topDesc?.[0]?.slice(0,18)||"—"}
                </span>
                <span style={{fontSize:9,color:ct.accent,fontFamily:"'DM Mono',monospace"}}>{label.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:10}}>
        <button className="btn-gold" style={{flex:1}} onClick={copy}>
          {copied?"✅ Copied!":"📋 Copy Stats"}
        </button>
        <button className="btn-ghost" style={{flex:1}}>📤 Share Card</button>
      </div>

      {/* Full breakdown */}
      <div className="glass" style={{padding:"20px 22px",borderRadius:"var(--radius)"}}>
        <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:14}}>
          YOUR 2026 MONEY REPORT
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            {emoji:"🏷️",l:"Personality",    v:persona.label,       c:"var(--gold)"},
            {emoji:"😤",l:"Emotion-Led",     v:`${fmt(negTotal)} (${stressPct}%)`, c:"var(--rose)"},
            {emoji:"🏥",l:"Health Level",    v:`${label} · ${score}/100`, c:scoreColor},
            {emoji:"📊",l:"Avg Daily Spend", v:fmt(Math.round(total/30)),  c:"var(--amber)"},
            {emoji:"🎓",l:"College Spends",  v:fmt(expenses.filter(e=>e.college).reduce((s,e)=>s+e.amount,0)), c:"var(--violet)"},
            {emoji:"🏷️",l:"Top Item",        v:topDesc?.[0]||"—",   c:"var(--teal)"},
          ].map(s=>(
            <div key={s.l} className="glass" style={{padding:"12px 14px",borderRadius:12}}>
              <div style={{fontSize:16,marginBottom:4}}>{s.emoji}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginBottom:2}}>{s.l}</div>
              <div className="font-mono" style={{fontSize:12,color:s.c,fontWeight:500}}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NEW FEATURE 5 — REGRET SCORE 😔
───────────────────────────────────────────── */
function RegretScore({ expenses, regrets, onToggle }) {
  const rated     = Object.keys(regrets).map(Number);
  const regretIds = rated.filter(id=>regrets[id]===true);
  const regretAmt = expenses.filter(e=>regretIds.includes(e.id)).reduce((s,e)=>s+e.amount,0);
  const totalRated= expenses.filter(e=>rated.includes(e.id)).reduce((s,e)=>s+e.amount,0);
  const regretPct = totalRated?Math.round((regretAmt/totalRated)*100):0;

  const byEmotion = {};
  expenses.filter(e=>regretIds.includes(e.id)).forEach(e=>{
    byEmotion[e.emotion]=(byEmotion[e.emotion]||0)+1;
  });
  const topMood = Object.entries(byEmotion).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 className="font-display" style={{fontSize:22,fontWeight:600}}>Regret Score 😔</h2>
        <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Rate each purchase 24 hrs later. Discover your buyer's remorse patterns.</p>
      </div>

      {/* Overview stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {v:`${regretPct}%`,        l:"Regret Rate",     c:regretPct>50?"var(--rose)":regretPct>25?"var(--amber)":"var(--green)"},
          {v:fmt(regretAmt),         l:"Money Regretted", c:"var(--rose)"},
          {v:`${rated.length}/${expenses.length}`,l:"Rated",c:"var(--gold)"},
        ].map(s=>(
          <div key={s.l} className="glass" style={{padding:"14px 16px",borderRadius:14}}>
            <div className="font-mono" style={{fontSize:20,fontWeight:500,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Insight callout */}
      {topMood && (
        <div style={{
          padding:"14px 18px",borderRadius:14,
          background:`${getEmotion(topMood[0]).color}0d`,
          border:`1px solid ${getEmotion(topMood[0]).color}25`,
          fontSize:13,lineHeight:1.6,color:"var(--text)"
        }}>
          {getEmotion(topMood[0]).emoji} <strong>Insight:</strong> Most regretted purchases happened under{" "}
          <strong style={{color:getEmotion(topMood[0]).color}}>{getEmotion(topMood[0]).label}</strong> mood — {topMood[1]} transaction{topMood[1]!==1?"s":""}.
          Next time you feel {getEmotion(topMood[0]).label.toLowerCase()}, wait 20 minutes before opening your payment app.
        </div>
      )}

      {/* Rate purchases */}
      <div className="glass" style={{padding:"18px 20px",borderRadius:"var(--radius)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:2}}>RATE YOUR PURCHASES</div>
            <div style={{fontSize:14,fontWeight:500}}>Do you regret this spend?</div>
          </div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{rated.length} rated · {expenses.length-rated.length} pending</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {expenses.map(e=>{
            const em = getEmotion(e.emotion);
            const r  = regrets[e.id];
            return (
              <div key={e.id} style={{
                padding:"12px 14px",borderRadius:12,
                background:r===true?"rgba(251,113,133,0.06)":r===false?"rgba(74,222,128,0.04)":"rgba(255,255,255,0.02)",
                border:`1px solid ${r===true?"rgba(251,113,133,0.2)":r===false?"rgba(74,222,128,0.15)":"var(--border)"}`,
                transition:"all 0.2s"
              }}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:18}}>{em.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:13,fontWeight:500}}>{e.desc}</span>
                      <span className="font-mono" style={{fontSize:12,color:"var(--rose)"}}>-{fmt(e.amount)}</span>
                    </div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>
                      {e.time} · <span style={{color:em.color}}>{em.label}</span>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <button className={`regret-btn yes ${r===true?"active":""}`}
                    onClick={()=>onToggle(e.id,true)}>
                    😔 Yes, regret it
                  </button>
                  <button className={`regret-btn no ${r===false?"active":""}`}
                    onClick={()=>onToggle(e.id,false)}>
                    😊 No regrets!
                  </button>
                  {r!==undefined && (
                    <span style={{fontSize:11,color:r?"var(--rose)":"var(--green)",marginLeft:"auto"}}>
                      {r?"😔 Regretted":"✅ Worth it"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By emotion breakdown */}
      {rated.length>0 && (
        <div className="glass" style={{padding:"18px 20px",borderRadius:"var(--radius)"}}>
          <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:14}}>
            REGRET BY EMOTION
          </div>
          {EMOTIONS.map(em=>{
            const eTxns  = expenses.filter(e=>e.emotion===em.id && rated.includes(e.id));
            const eRegret= eTxns.filter(e=>regrets[e.id]===true).length;
            const ePct   = eTxns.length?Math.round((eRegret/eTxns.length)*100):0;
            if(!eTxns.length) return null;
            return (
              <div key={em.id} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12}}>{em.emoji} {em.label}</span>
                  <span className="font-mono" style={{fontSize:11,color:em.color}}>{eRegret}/{eTxns.length} · {ePct}%</span>
                </div>
                <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:99}}>
                  <div className="fill-bar" style={{width:`${ePct}%`,height:"100%",borderRadius:99,background:em.color,opacity:0.85}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Stats Summary Row */
function StatsRow({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const todayExp = expenses.filter((e) => e.time.includes("Today"));
  const todayTotal = todayExp.reduce((s, e) => s + e.amount, 0);
  const negEmotions = ["stress", "boredom", "anxiety", "peer"];
  const negTotal = expenses.filter((e) => negEmotions.includes(e.emotion)).reduce((s, e) => s + e.amount, 0);

  const stats = [
    { label: "Total Spent", value: fmt(total),     sub: "all time",     color: "#fb7185", icon: "💸" },
    { label: "Today",       value: fmt(todayTotal), sub: `${todayExp.length} transactions`, color: "#f59e0b", icon: "📅" },
    { label: "Emotion-Led", value: fmt(negTotal),   sub: "stress/anxiety/peer", color: "#a78bfa", icon: "🧠" },
    { label: "Saved Est.",  value: fmt(3200),        sub: "this month",   color: "#4ade80", icon: "🏦" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }} className="stagger">
      {stats.map((s) => (
        <div key={s.label} className="glass slide-up" style={{ padding: "14px 16px", borderRadius: 14 }}>
          <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
          <div className="font-mono" style={{ fontSize: 16, fontWeight: 500, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* Ticker Bar */
function TickerBar({ expenses }) {
  const items = expenses.map((e) => `${getEmotion(e.emotion).emoji} ${e.desc} · ${fmt(e.amount)}`);
  const str = items.join("  ·  ") + "  ·  " + items.join("  ·  ");
  return (
    <div style={{
      overflow: "hidden",
      borderBottom: "1px solid var(--border)",
      borderTop: "1px solid var(--border)",
      padding: "7px 0",
      background: "rgba(245,200,66,0.03)"
    }}>
      <div className="ticker-inner font-mono" style={{ color: "var(--gold)", fontSize: 11, display: "inline-block" }}>
        {str}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   UPI MOOD PROMPT HOOK
───────────────────────────────────────────── */
function useMoodPrompt() {
  const [pending, setPending] = useState(null);
  const [isOpen,  setIsOpen]  = useState(false);
  const timeoutRef = useRef(null);
  const trigger = useCallback((txn) => {
    clearTimeout(timeoutRef.current);
    setPending(txn);
    timeoutRef.current = setTimeout(() => setIsOpen(true), 800);
  }, []);
  const resolve = useCallback((mood) => {
    setIsOpen(false);
    const resolved = pending ? { ...pending, mood } : null;
    setPending(null);
    return resolved;
  }, [pending]);
  const dismiss = useCallback(() => { setIsOpen(false); setPending(null); }, []);
  useEffect(() => () => clearTimeout(timeoutRef.current), []);
  return { isOpen, pending, trigger, resolve, dismiss };
}

/* ─────────────────────────────────────────────
   MOOD PING MODAL
───────────────────────────────────────────── */
const UPI_MOODS = [
  { id:"stress",  emoji:"😤", label:"Stress"  },
  { id:"joy",     emoji:"😄", label:"Joy"     },
  { id:"boredom", emoji:"😑", label:"Boredom" },
  { id:"peer",    emoji:"🤝", label:"Peer"    },
  { id:"anxiety", emoji:"😰", label:"Anxiety" },
  { id:"hunger",  emoji:"🍕", label:"Hunger"  },
];
const ALT_MAP = {
  stress:  "Try box breathing: 4s inhale, 4s hold, 4s exhale 🌬️",
  hunger:  "That's legit! But was it planned? Note it for next week's meal plan 🍕",
  boredom: "Boredom buy? Try a 10-min YouTube skill video first next time 📺",
  joy:     "Happy spending! Consider saving 10% of this amount too 🎉",
  peer:    "Friend group pressure? Remember: your wallet, your rules 💪",
  anxiety: "Retail therapy is real but temporary. Try a 5-min walk first 🌿",
};
function MoodPingModal({ txn, onResolve, onDismiss }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const pick = (id) => { setSelected(id); setTimeout(() => setStep(1), 300); };
  const mood = UPI_MOODS.find(m => m.id === selected);
  if (!txn) return null;
  return (
    <div className="modal-bg">
      <div className="glass pop-in" style={{ maxWidth:440, width:"100%", padding:"28px 26px", borderRadius:18 }}>
        {step === 0 ? (<>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div className="live-dot"/>
            <span style={{ fontSize:10, color:"#00E5CC", fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>UPI DETECTED · MOOD PING</span>
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:22, fontWeight:700, marginBottom:8 }}>We caught that spend! 👀</div>
          <div style={{ background:"rgba(0,229,204,0.08)", border:"1px solid rgba(0,229,204,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13 }}>
            <span style={{ color:"#00E5CC", fontWeight:700 }}>₹{txn.amount?.toLocaleString("en-IN")}</span>
            {" "}at <strong>{txn.merchant || txn.desc}</strong>
          </div>
          <p style={{ fontSize:13, color:"var(--muted)", marginBottom:18, lineHeight:1.6 }}>How were you feeling when you made this payment?</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:20 }}>
            {UPI_MOODS.map(m => (
              <button key={m.id} className={`mood-btn ${selected===m.id?"sel":""}`} onClick={() => pick(m.id)}>
                {m.emoji}<span className="mlabel">{m.label}</span>
              </button>
            ))}
          </div>
          <button onClick={onDismiss} style={{ width:"100%", padding:"10px", borderRadius:10, background:"transparent", border:"1px solid var(--border)", color:"var(--muted)", cursor:"pointer", fontSize:13 }}>
            Skip for now
          </button>
        </>) : (<>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:52, marginBottom:10, animation:"ping 1.5s ease-in-out infinite" }}>{mood?.emoji}</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:20, fontWeight:700, marginBottom:8 }}>
              {selected==="joy"||selected==="hunger" ? "Noted! 🎉" : "Got you 💛"}
            </div>
            <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.6, marginBottom:16 }}>
              {selected!=="joy"&&selected!=="hunger"
                ? `Spending under ${mood?.label.toLowerCase()} can become a habit. Next time try:`
                : "We've tagged this spend. Here's a tip:"}
            </p>
            <div style={{ background:`rgba(0,229,204,0.07)`, border:`1px solid rgba(0,229,204,0.2)`, borderRadius:12, padding:"14px 16px", fontSize:13, lineHeight:1.5 }}>
              💡 {ALT_MAP[selected]}
            </div>
          </div>
          <button className="btn-primary-upi" onClick={() => onResolve(selected)}>Save & Continue →</button>
        </>)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   UPI LOCK MODAL
───────────────────────────────────────────── */
function UPILockModal({ score, onProceed, onCancel }) {
  const [countdown, setCountdown] = useState(3);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (countdown <= 0) { setDone(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);
  return (
    <div className="modal-bg">
      <div className="glass pop-in lock-ring" style={{ maxWidth:400, width:"100%", padding:"28px 26px", borderRadius:18, border:"1px solid rgba(239,68,68,0.4)" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:52, marginBottom:10 }}>🔒</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:22, fontWeight:700, color:"#EF4444", marginBottom:6 }}>Virtual UPI Lock</div>
          <div style={{ fontSize:12, color:"var(--muted)", marginBottom:14 }}>
            Budget Health: <span style={{ fontFamily:"'DM Mono',monospace", color:"#f5c842", fontWeight:600 }}>{score}/100</span>
          </div>
          <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, padding:"14px 16px", fontSize:13, marginBottom:16, lineHeight:1.5 }}>
            ⚠️ Your <strong>stress spending</strong> is elevated today. Take a breath before proceeding.
          </div>
          <div style={{ fontSize:22, marginBottom:8 }}>
            {countdown > 0
              ? <>🫁 Take <span style={{ color:"#00E5CC", fontWeight:700 }}>{countdown}</span> deep breath{countdown!==1?"s":""}…</>
              : "✅ Breathing done!"}
          </div>
          {!done && (
            <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:99, marginBottom:16 }}>
              <div style={{ height:"100%", borderRadius:99, background:"#00E5CC", width:`${((3-countdown)/3)*100}%`, transition:"width 0.9s ease" }}/>
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px", borderRadius:10, background:"transparent", border:"1px solid var(--border)", color:"var(--muted)", cursor:"pointer", fontSize:13 }}>Cancel</button>
          <button className="btn-danger-upi" disabled={!done} onClick={onProceed} style={{ opacity:done?1:0.4, cursor:done?"pointer":"not-allowed" }}>Proceed Anyway</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
const NAV = [
  { id: "dashboard", label: "Dashboard",   icon: "◈" },
  { id: "feed",      label: "Spend Feed",  icon: "⟁" },
  { id: "goals",     label: "Goals",       icon: "◎" },
  { id: "college",   label: "College",     icon: "🎓" },
  { id: "insights",  label: "Insights",    icon: "◉" },
  { id: "streaks",   label: "Streaks",     icon: "🔥" },
  { id: "heatmap",   label: "Heatmap",     icon: "📅" },
  { id: "whatif",    label: "What-If",     icon: "💡" },
  { id: "fincard",   label: "Finance Card",icon: "🎴" },
  { id: "regret",    label: "Regret",      icon: "😔" },
];

export default function App() {
  const [dark, setDark]           = useState(true);
  const [page, setPage]           = useState("dashboard");
  const [expenses, setExpenses]   = useState(SEED_EXPENSES);
  const [showAdd, setShowAdd]     = useState(false);
  const [collegeMode, setCollegeMode] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [regrets, setRegrets]     = useState({ 1:true, 3:false, 5:true, 7:false });
  const [goals, setGoals]         = useState([
    { id: 1, label: "🖥️ New Laptop",    target: 55000, saved: 18200, daily: 100, emoji: "🖥️", months: 12 },
    { id: 2, label: "✈️ Goa Trip",       target: 12000, saved: 7400,  daily: 50,  emoji: "✈️", months: 3  },
    { id: 3, label: "🎧 AirPods",        target: 8000,  saved: 2100,  daily: 80,  emoji: "🎧", months: 4  },
  ]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ label: "", emoji: "🎯", target: "", saved: "", daily: "", months: "" });
  const [showUPILock, setShowUPILock] = useState(false);
  const [pendingUPITxn, setPendingUPITxn] = useState(null);

  const moodPrompt = useMoodPrompt();

  const score      = calcHealthScore(expenses);
  const doctorTip  = getDoctorTip(expenses);
  const addExpense = (e) => setExpenses((prev) => [e, ...prev]);
  const onToggleRegret = useCallback((id, val) => setRegrets(r=>({...r,[id]:val})), []);

  const simulateUPI = () => {
    const sms = SAMPLE_SMS[Math.floor(Math.random() * SAMPLE_SMS.length)];
    const parsed = parseUPISMS(sms);
    if (!parsed) return;
    const draft = { ...parsed, id: Date.now(), emotion: "stress", isGroup: Math.random() > 0.7, isSub: Math.random() > 0.85, category: "Auto-detected", time: "Today, " + parsed.time, college: false };
    // Show UPI lock if score is low
    if (score < 50) {
      setPendingUPITxn(draft);
      setShowUPILock(true);
    } else {
      moodPrompt.trigger(draft);
    }
  };

  const onMoodResolved = (mood) => {
    const resolved = moodPrompt.resolve(mood);
    if (resolved) {
      setExpenses(prev => [{ id: resolved.id, desc: resolved.merchant, amount: resolved.amount, cat: "auto", emotion: mood, time: resolved.time, college: false }, ...prev]);
    }
  };

  const onUPILockProceed = () => {
    setShowUPILock(false);
    if (pendingUPITxn) moodPrompt.trigger(pendingUPITxn);
    setPendingUPITxn(null);
  };

  const onUPILockCancel = () => { setShowUPILock(false); setPendingUPITxn(null); };

  // Inject theme-aware CSS
  useEffect(() => {
    let el = document.getElementById("ss-styles");
    if (!el) { el = document.createElement("style"); el.id = "ss-styles"; document.head.appendChild(el); }
    el.textContent = makeCSS(dark);
  }, [dark]);

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* ── SIDEBAR ── */}
        <aside className="sidebar" style={{
          width: 220, height: "100vh", position: "fixed", left: 0, top: 0,
          background: dark ? "rgba(11,14,23,0.97)" : "rgba(245,242,236,0.97)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column", padding: "28px 16px", gap: 4,
          backdropFilter: "blur(12px)", zIndex: 40,
          transition: "background 0.3s ease",
          overflowY: "auto", overflowX: "hidden"
        }}>
          {/* Logo */}
          <div style={{ marginBottom: 28, paddingLeft: 8 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 2, marginBottom: 4 }}>
              SENTIMENTAL
            </div>
            <div className="font-display text-gold-shimmer" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
              Spend
            </div>
          </div>

          {/* Nav */}
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                border: "none", background: "transparent",
                color: page === n.id ? "var(--gold)" : "var(--muted)",
                cursor: "pointer", fontSize: 13, textAlign: "left", width: "100%",
                fontFamily: "'Sora', sans-serif"
              }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}

          {/* College toggle */}
          <div style={{
            marginTop: 16, padding: "12px 14px", borderRadius: 12,
            background: collegeMode ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${collegeMode ? "rgba(167,139,250,0.3)" : "var(--border)"}`,
            cursor: "pointer", transition: "all 0.2s"
          }}
            onClick={() => setCollegeMode(!collegeMode)}
          >
            <div style={{ fontSize: 11, color: collegeMode ? "var(--violet)" : "var(--muted)", fontFamily: "'DM Mono',monospace", marginBottom: 2 }}>
              COLLEGE MODE
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 18, borderRadius: 99, position: "relative",
                background: collegeMode ? "var(--violet)" : "rgba(255,255,255,0.1)",
                transition: "background 0.2s"
              }}>
                <div style={{
                  position: "absolute", top: 3, left: collegeMode ? 16 : 3,
                  width: 12, height: 12, borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s"
                }} />
              </div>
              <span style={{ fontSize: 12, color: collegeMode ? "var(--violet)" : "var(--muted)" }}>
                {collegeMode ? "On" : "Off"}
              </span>
            </div>
          </div>

          {/* Theme + stats */}
          <div style={{ marginTop: "auto" }}>
            <button onClick={simulateUPI} style={{
              width: "100%", marginBottom: 10,
              padding: "12px 16px", borderRadius: 12, cursor: "pointer",
              background: "linear-gradient(135deg, #00E5CC, #00b8a9)",
              border: "none", color: "#000", fontSize: 14,
              fontWeight: 700, fontFamily: "'DM Mono',monospace",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 0 20px rgba(0,229,204,0.45), 0 4px 12px rgba(0,0,0,0.3)",
              transition: "all 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 32px rgba(0,229,204,0.7), 0 4px 16px rgba(0,0,0,0.3)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,204,0.45), 0 4px 12px rgba(0,0,0,0.3)"}
            >
              ⚡ Simulate UPI
            </button>
            <ThemeToggle dark={dark} toggle={()=>setDark(d=>!d)}/>
            <div style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", lineHeight: 1.5, marginTop: 10 }}>
              {expenses.length} entries logged<br />
              <span style={{ color: "rgba(245,200,66,0.5)" }}>Budget Health: {score}/100</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main-content" style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {/* Top bar */}
          <div style={{
            position: "sticky", top: 0, zIndex: 40, width: "100%",
            background: dark ? "rgba(11,14,23,0.97)" : "rgba(245,242,236,0.97)", backdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border)",
            padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, boxSizing: "border-box"
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-display" style={{ fontSize: 18, fontWeight: 600 }}>
                {NAV.find((n) => n.id === page)?.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            {collegeMode && (
              <span style={{
                padding: "4px 10px", borderRadius: 99, fontSize: 11, whiteSpace: "nowrap",
                background: "rgba(167,139,250,0.12)", color: "var(--violet)",
                border: "1px solid rgba(167,139,250,0.25)", fontFamily: "'DM Mono',monospace"
              }}>🎓 College Mode ON</span>
            )}
            <button onClick={() => setPage("streaks")} style={{
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              padding: "8px 14px", borderRadius: 10, cursor: "pointer", flexShrink: 0,
              background: "rgba(245,200,66,0.15)", border: "2px solid rgba(245,200,66,0.6)",
              color: "#f5c842", fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono',monospace"
            }}>🔥 4 streak</button>
            <button onClick={simulateUPI} style={{
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              padding: "8px 16px", borderRadius: 10, cursor: "pointer", flexShrink: 0,
              background: "rgba(0,229,204,0.15)", border: "2px solid rgba(0,229,204,0.6)",
              color: "#00E5CC", fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono',monospace"
            }}>⚡ SIM UPI</button>
            <button className="btn-gold" style={{ padding: "8px 16px", fontSize: 13, flexShrink: 0 }} onClick={() => setShowAdd(true)}>
              + Log
            </button>
          </div>

          {/* UPI Modals */}
          {showUPILock && <UPILockModal score={score} onProceed={onUPILockProceed} onCancel={onUPILockCancel} />}
          {moodPrompt.isOpen && <MoodPingModal txn={moodPrompt.pending} onResolve={onMoodResolved} onDismiss={moodPrompt.dismiss} />}

          {/* Ticker */}
          <TickerBar expenses={expenses} />

          {/* Page content */}
          <div style={{ flex: 1, padding: "24px", maxWidth: 1100, width: "100%" }}>
            {/* ── DASHBOARD ── */}
            {page === "dashboard" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <StatsRow expenses={expenses} />

                <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
                  {/* Health score + doctor */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div className="glass slide-up" style={{ padding: 24, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
                        BUDGET HEALTH SCORE
                      </div>
                      <HealthScore score={score} />
                      <div style={{ width: "100%", borderTop: "1px solid var(--border)", paddingTop: 14, fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
                        {score > 70
                          ? "Great financial mindfulness! You're spending intentionally."
                          : score > 45
                          ? "Caution — stress and boredom are driving some spends."
                          : "Your emotions are controlling your wallet. Let's fix this."}
                      </div>
                    </div>
                    <DoctorCard tip={doctorTip} />
                  </div>

                  {/* Recent emotional spend feed */}
                  <div className="glass slide-up" style={{ padding: 20, borderRadius: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
                          EMOTIONAL SPEND FEED
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>Recent Transactions</div>
                      </div>
                      <button className="btn-ghost" style={{ fontSize: 11, padding: "6px 12px" }} onClick={() => setPage("feed")}>
                        View All →
                      </button>
                    </div>
                    <div className="feed-scroll stagger">
                      {expenses.slice(0, 6).map((e) => (
                        <FeedItem key={e.id} expense={e} onClick={setSelectedFeed} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* -- NEW FEATURES QUICK-NAV -- */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
                  {[
                    {id:"streaks",  icon:"🔥", title:"Streaks & XP",   sub:"4-day no-stress streak",  color:"#f59e0b"},
                    {id:"heatmap",  icon:"📅", title:"Heatmap",         sub:"84-day spend history",          color:"var(--teal)"},
                    {id:"whatif",   icon:"💡", title:"What-If",          sub:"Simulate habit changes",        color:"var(--green)"},
                    {id:"fincard",  icon:"🎴", title:"Finance Card",    sub:"Share your money persona",      color:"var(--violet)"},
                    {id:"regret",   icon:"😔", title:"Regret Score",    sub:`${Object.values(regrets).filter(Boolean).length} regretted purchases`, color:"var(--rose)"},
                  ].map(f=>(
                    <div key={f.id} className="glass slide-up" style={{
                      padding:"14px 16px", borderRadius:14, cursor:"pointer",
                      border:`1px solid ${f.color}22`, transition:"all 0.2s",
                    }}
                      onClick={()=>setPage(f.id)}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
                    >
                      <div style={{fontSize:22, marginBottom:6}}>{f.icon}</div>
                      <div style={{fontSize:12,fontWeight:600,color:f.color}}>{f.title}</div>
                      <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{f.sub}</div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ── FEED ── */}
            {page === "feed" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="glass" style={{ padding: 16, borderRadius: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {EMOTIONS.map((e) => (
                    <span key={e.id} className="emotion-pill" style={{ background: `${e.color}1a`, color: e.color, cursor: "pointer", padding: "5px 12px" }}>
                      {e.emoji} {e.label}
                    </span>
                  ))}
                </div>
                <div className="glass" style={{ padding: 20, borderRadius: 16 }}>
                  <div style={{ marginBottom: 14, fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
                    ALL TRANSACTIONS · {expenses.length} entries
                  </div>
                  <div className="stagger">
                    {expenses.map((e) => <FeedItem key={e.id} expense={e} onClick={setSelectedFeed} />)}
                  </div>
                </div>
              </div>
            )}

            {/* -- GOALS -- */}
            {page === "goals" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <div style={{ flex: 1 }}>
                    <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Future Goals</h2>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>Turn today's savings into tomorrow's rewards</p>
                  </div>
                  <button onClick={() => setShowGoalForm(v => !v)} style={{
                    padding: "8px 16px", borderRadius: 10, fontSize: 12, cursor: "pointer",
                    background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", color: "var(--gold)", fontWeight: 600
                  }}>+ Add Goal</button>
                </div>

                {/* Add goal form */}
                {showGoalForm && (
                  <div className="glass" style={{ padding: 18, borderRadius: 14, border: "1px solid rgba(245,200,66,0.2)" }}>
                    <div style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, marginBottom: 12 }}>NEW GOAL</div>
                    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <input value={newGoal.emoji} onChange={e => setNewGoal(g => ({...g, emoji: e.target.value}))} placeholder="🎯" style={{ padding: "7px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 18, textAlign: "center" }} />
                      <input value={newGoal.label} onChange={e => setNewGoal(g => ({...g, label: e.target.value}))} placeholder="Goal name (e.g. New Phone)" style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
                      <input value={newGoal.target} onChange={e => setNewGoal(g => ({...g, target: e.target.value}))} type="number" placeholder="Target amount (₹)" style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                      <input value={newGoal.saved} onChange={e => setNewGoal(g => ({...g, saved: e.target.value}))} type="number" placeholder="Already saved (₹)" style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
                      <input value={newGoal.daily} onChange={e => setNewGoal(g => ({...g, daily: e.target.value}))} type="number" placeholder="Daily saving (₹)" style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
                      <input value={newGoal.months} onChange={e => setNewGoal(g => ({...g, months: e.target.value}))} type="number" placeholder="Timeline (months)" style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border2)", background: "var(--panel2)", color: "var(--text)", fontSize: 12 }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => {
                        if (!newGoal.label || !newGoal.target) return;
                        setGoals(prev => [...prev, { id: Date.now(), label: `${newGoal.emoji} ${newGoal.label}`, emoji: newGoal.emoji, target: parseFloat(newGoal.target)||0, saved: parseFloat(newGoal.saved)||0, daily: parseFloat(newGoal.daily)||50, months: parseInt(newGoal.months)||6 }]);
                        setNewGoal({ label: "", emoji: "🎯", target: "", saved: "", daily: "", months: "" });
                        setShowGoalForm(false);
                      }} style={{ padding: "7px 16px", borderRadius: 9, fontSize: 12, cursor: "pointer", background: "rgba(245,200,66,0.2)", border: "1px solid rgba(245,200,66,0.35)", color: "var(--gold)", fontWeight: 600 }}>Save Goal</button>
                      <button onClick={() => setShowGoalForm(false)} style={{ padding: "7px 12px", borderRadius: 9, fontSize: 12, cursor: "pointer", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)" }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }} className="stagger">
                  {goals.map((g) => (
                    <div key={g.id} style={{ position: "relative" }}>
                      <GoalCard goal={g} />
                      <button onClick={() => setGoals(prev => prev.filter(x => x.id !== g.id))} style={{
                        position: "absolute", top: 10, right: 10,
                        width: 24, height: 24, borderRadius: 99, fontSize: 11,
                        background: "rgba(255,77,141,0.12)", border: "1px solid rgba(255,77,141,0.25)",
                        color: "var(--rose)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                      }}>✕</button>
                    </div>
                  ))}
                  {goals.length === 0 && (
                    <div style={{ gridColumn: "1/-1", padding: 32, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                      No goals yet. Add one to start tracking! 🎯
                    </div>
                  )}
                </div>

                {/* Daily saving visualizer */}
                <div className="glass" style={{ padding: 22, borderRadius: 16 }}>
                  <div style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, marginBottom: 12 }}>
                    DAILY SAVINGS VISUALIZER
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                    {goals.map((item) => {
                      const saved = item.daily * item.months * 30;
                      const pct = Math.min(100, Math.round(((item.saved + saved) / item.target) * 100));
                      return (
                        <div key={item.id} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(245,200,66,0.05)", border: "1px solid rgba(245,200,66,0.12)" }}>
                          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{item.label}</div>
                          <div className="font-mono" style={{ fontSize: 11, color: "var(--gold)", marginBottom: 8 }}>
                            ₹{item.daily}/day × {item.months}mo = {fmt(saved)}
                          </div>
                          <div className="goal-bar-track">
                            <div className="goal-bar-fill fill-bar" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f5c842, #fde68a)" }} />
                          </div>
                          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 5 }}>
                            {pct >= 100 ? "✅ Goal Reached!" : `${pct}% of ₹${item.target.toLocaleString("en-IN")}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── COLLEGE ── */}
            {page === "college" && <CollegeMode expenses={expenses} />}

            {/* ── INSIGHTS ── */}
            {page === "insights" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <PersonalityCard expenses={expenses} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {/* Emotion × Amount heatmap */}
                  <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, marginBottom: 14 }}>
                      EMOTION → MONEY MAP
                    </div>
                    {EMOTIONS.map((em) => {
                      const amt = expenses.filter((e) => e.emotion === em.id).reduce((s, e) => s + e.amount, 0);
                      const total = expenses.reduce((s, e) => s + e.amount, 0);
                      const pct = total ? Math.round((amt / total) * 100) : 0;
                      return (
                        <div key={em.id} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12 }}>{em.emoji} {em.label}</span>
                            <span className="font-mono" style={{ fontSize: 12, color: em.color }}>{fmt(amt)}</span>
                          </div>
                          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
                            <div className="fill-bar" style={{ width: `${pct}%`, height: "100%", background: em.color, borderRadius: 99, opacity: 0.85 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Weekly pattern */}
                  <div className="glass" style={{ padding: 20, borderRadius: 14 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, marginBottom: 14 }}>
                      WEEKLY PATTERN
                    </div>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                      const vals = [120, 40, 230, 80, 499, 340, 180];
                      const max = Math.max(...vals);
                      const pct = Math.round((vals[i] / max) * 100);
                      const isToday = i === 5;
                      return (
                        <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <span style={{ width: 28, fontSize: 11, color: isToday ? "var(--gold)" : "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{day}</span>
                          <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
                            <div className="fill-bar" style={{
                              width: `${pct}%`, height: "100%", borderRadius: 99,
                              background: isToday ? "var(--gold)" : "rgba(245,200,66,0.4)"
                            }} />
                          </div>
                          <span className="font-mono" style={{ width: 50, fontSize: 11, color: "var(--muted)", textAlign: "right" }}>₹{vals[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips panel */}
                <div className="glass" style={{ padding: 20, borderRadius: 14, borderLeft: "3px solid var(--teal)" }}>
                  <div style={{ fontSize: 11, color: "var(--teal)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, marginBottom: 12 }}>
                    PERSONALIZED NUDGES
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { tip: "You spend 3× more on Fridays. Consider setting a Friday budget cap.", icon: "📅" },
                      { tip: "Boredom spends peak after 9 PM. Lock the UPI app after 9 PM tonight?", icon: "🌙" },
                      { tip: "Your Canteen spend is 40% of budget. Try the mess for one week.", icon: "🍛" },
                      { tip: "You've avoided 2 peer-pressure spends this week. 🎉 Well done!", icon: "🏆" },
                    ].map((n, i) => (
                      <div key={i} style={{
                        padding: "12px 14px", borderRadius: 12,
                        background: "rgba(45,212,191,0.06)",
                        border: "1px solid rgba(45,212,191,0.12)",
                        fontSize: 12, lineHeight: 1.5
                      }}>
                        <span style={{ fontSize: 18, display: "block", marginBottom: 4 }}>{n.icon}</span>
                        {n.tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STREAKS ── */}
            {page === "streaks" && <StreakSystem expenses={expenses} score={score}/>}

            {/* ── HEATMAP ── */}
            {page === "heatmap" && <HeatmapCalendar/>}

            {/* ── WHAT-IF ── */}
            {page === "whatif" && <WhatIfSimulator expenses={expenses}/>}

            {/* ── FINANCE CARD ── */}
            {page === "fincard" && <FinanceCard expenses={expenses} score={score}/>}

            {/* ── REGRET SCORE ── */}
            {page === "regret" && <RegretScore expenses={expenses} regrets={regrets} onToggle={onToggleRegret}/>}

          </div>
        </main>

        {/* ── MOBILE NAV ── */}
        <nav className="mobile-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                color: page === n.id ? "var(--gold)" : "var(--muted)",
                fontFamily: "'Sora',sans-serif", fontSize: 9, padding: "0 8px"
              }}
            >
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              {n.label.split(" ")[0]}
            </button>
          ))}
        </nav>
      </div>

      {/* ── MODALS ── */}
      {showAdd && (
        <AddExpense
          onAdd={addExpense}
          onClose={() => setShowAdd(false)}
          collegeMode={collegeMode}
        />
      )}

      {selectedFeed && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}
          onClick={() => setSelectedFeed(null)}
        >
          <div className="glass mood-overlay" style={{ maxWidth: 380, width: "100%", padding: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 11, color: "var(--gold)", fontFamily: "'DM Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>
              TRANSACTION DETAIL
            </div>
            <h2 className="font-display" style={{ fontSize: 20, marginBottom: 4 }}>{selectedFeed.desc}</h2>
            <div className="font-mono" style={{ fontSize: 28, color: "#fb7185", marginBottom: 14 }}>{fmt(selectedFeed.amount)}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--muted)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Emotion</span><EmotionPill emotionId={selectedFeed.emotion} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Time</span><span>{selectedFeed.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Mode</span><span>{selectedFeed.college ? "🎓 College" : "🏠 Personal"}</span>
              </div>
            </div>
            <div style={{
              marginTop: 14, padding: "12px 14px", borderRadius: 12,
              background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.15)",
              fontSize: 12, color: "var(--text)"
            }}>
              💡 {ALTERNATIVES[selectedFeed.emotion]?.[1] || "Keep tracking your emotional spends!"}
            </div>
            <button className="btn-gold" style={{ width: "100%", marginTop: 14 }} onClick={() => setSelectedFeed(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
