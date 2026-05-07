'use strict';

// ============================================================
// CONFIG
// ============================================================

const N  = 8;
const CX = 200, CY = 200;
const OUTER_R = 150;
const INNER_R = 90;
const NODE_OR = 28;
const NODE_IR = 19;

// ============================================================
// PRNG — Mulberry32
// ============================================================

function mkRng(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

// ============================================================
// DATE UTILS
// ============================================================

function dailySeed() {
  const d = new Date();
  const str = `seeds-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dateLabel(d = new Date()) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

// ============================================================
// PUZZLE GENERATION
// ============================================================

function diffParams(diff) {
  return {
    seeds:  16 + diff * 2,
    steps:  2 + diff,
    buffer: Math.max(1, 3 - Math.floor(diff / 2)),
  };
}

function genPuzzle(rng, diff) {
  const { seeds: total, steps, buffer } = diffParams(Math.min(diff, 10));

  // Build starting board — all nodes get at least 1 seed
  const start = Array(N).fill(1);
  let rem = total - N;
  while (rem > 0) {
    start[Math.floor(rng() * N)]++;
    rem--;
  }

  // Shuffle starting board
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [start[i], start[j]] = [start[j], start[i]];
  }

  // Apply forward moves to derive target — record each move
  const target = [...start];
  const moves = [];
  let applied = 0;

  for (let s = 0; s < steps; s++) {
    const cands = target.reduce((a, v, i) => (v > 0 ? [...a, i] : a), []);
    if (!cands.length) break;
    const idx = cands[Math.floor(rng() * cands.length)];
    const cnt = target[idx];
    target[idx] = 0;
    for (let k = 1; k <= cnt; k++) target[(idx + k) % N]++;
    moves.push({ node: idx, seeds: cnt });
    applied++;
  }

  // Sanity: ensure start !== target
  if (applied === 0 || start.every((v, i) => v === target[i])) {
    const idx = start.findIndex(v => v > 0);
    const cnt = start[idx];
    target[idx] = 0;
    for (let k = 1; k <= cnt; k++) target[(idx + k) % N]++;
    moves.push({ node: idx, seeds: cnt });
    applied = 1;
  }

  return { startBoard: start, target, movesAllowed: applied + buffer, solutionMoves: moves, puzzleType: 'pattern' };
}

// Equal-style puzzle: target is [k,k,…,k,0] — one empty node, rest balanced.
// Guaranteed solvable via one backward step from target (target has a 0, so backward moves work).
function genEqualPuzzle(rng, diff) {
  const k      = diff === 0 ? 2 : 3;
  const buffer = 3;

  // Target: k everywhere except one randomly placed 0
  const zeroPos = Math.floor(rng() * N);
  const target  = Array(N).fill(k);
  target[zeroPos] = 0;

  // Backward step: "un-tap" zeroPos with v seeds.
  // Valid because all non-zero target nodes have value k >= 1.
  // After: board[zeroPos] = v, board[zeroPos+1..zeroPos+v] each -= 1
  const maxV = Math.min(k + diff, N - 1);
  const v    = 1 + Math.floor(rng() * maxV);

  const board = [...target];
  board[zeroPos] = v;
  for (let j = 1; j <= v; j++) board[(zeroPos + j) % N]--;

  return {
    startBoard:    board,
    target,
    movesAllowed:  1 + buffer,
    solutionMoves: [{ node: zeroPos, seeds: v }],
    puzzleType:    'equal',
  };
}

// ============================================================
// STORAGE
// ============================================================

const STORE = 'seeds_v2';

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch { return {}; }
}

function saveStore(data) {
  try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {}
}

// ============================================================
// GAME STATE
// ============================================================

const G = {
  screen:    'menu',    // menu | game | end
  mode:      'daily',   // daily | practice
  board:     [],
  target:    [],
  moves:     0,
  maxMoves:  0,
  score:     0,
  pIdx:      0,
  history:   [],        // array of true (solved) | false (failed)
  rng:       null,
  animating:   false,
  winState:    false,
  flashIdx:    -1,
  tapIdx:      -1,
  puzzleType:  '',   // 'equal' | 'pattern'
  // Persisted
  streak:    0,
  best:      0,
  todayKey:  '',
  todayScore: -1,

  init() {
    const s = loadStore();
    this.streak    = s.streak    || 0;
    this.best      = s.best      || 0;
    this.todayKey  = s.todayKey  || '';
    this.todayScore = (s.todayKey === dateKey()) ? (s.todayScore ?? -1) : -1;
    render();
  },

  startDaily() {
    this.mode    = 'daily';
    this.score   = 0;
    this.pIdx    = 0;
    this.history = [];
    this.rng     = mkRng(dailySeed());
    this.screen  = 'game';
    this.nextPuzzle();
  },

  startPractice() {
    this.mode    = 'practice';
    this.score   = 0;
    this.pIdx    = 0;
    this.history = [];
    this.rng     = mkRng((Math.random() * 0xFFFFFFFF) >>> 0);
    this.screen  = 'game';
    this.nextPuzzle();
  },

  nextPuzzle() {
    clearTimers();
    // pIdx 0-2: easy equal-style puzzles. pIdx 3+: pattern puzzles.
    const puzzle = this.pIdx < 3
      ? genEqualPuzzle(this.rng, this.pIdx)
      : genPuzzle(this.rng, Math.min(this.pIdx - 2, 10));
    this.board         = [...puzzle.startBoard];
    this.target        = [...puzzle.target];
    this.moves         = puzzle.movesAllowed;
    this.maxMoves      = puzzle.movesAllowed;
    this.solutionMoves = puzzle.solutionMoves;
    this.puzzleType    = puzzle.puzzleType;
    this.winState      = false;
    this.animating     = false;
    this.tapIdx        = -1;
    this.flashIdx      = -1;
    showGame();
  },

  tap(i) {
    if (this.animating) return;
    if (this.board[i] === 0) {
      shakeBoard(); return;
    }
    if (this.moves <= 0) return;

    if (navigator.vibrate) navigator.vibrate(8);

    const cnt = this.board[i];
    this.board[i] = 0;
    this.moves--;
    this.tapIdx = i;
    this.animating = true;
    updateBoard();

    animate(i, cnt, () => {
      this.tapIdx    = -1;
      this.animating = false;

      if (this.checkWin()) {
        this.score++;
        this.history.push(true);
        this.winState = true;
        setWinAnim(true);
        addTimer(setTimeout(() => {
          this.pIdx++;
          this.nextPuzzle();
        }, 1300));
      } else if (this.moves === 0) {
        this.history.push(false);
        addTimer(setTimeout(() => this.endRun(), 420));
      } else {
        updateBoard();
      }
    });
  },

  checkWin() {
    return this.board.every((v, i) => v === this.target[i]);
  },

  endRun() {
    this.screen = 'end';
    if (this.mode === 'daily') this.saveDaily();
    showEnd();
  },

  saveDaily() {
    const s   = loadStore();
    const key = dateKey();
    const prevBest = (s.todayKey === key) ? (s.todayScore ?? -1) : -1;
    const newScore = Math.max(prevBest, this.score);

    let newStreak = s.streak || 0;
    if (s.todayKey === yesterdayKey()) {
      newStreak = (s.streak || 0) + 1;
    } else if (s.todayKey !== key) {
      newStreak = 1;
    }

    this.streak     = newStreak;
    this.best       = Math.max(s.best || 0, newScore);
    this.todayScore = newScore;
    this.todayKey   = key;

    saveStore({
      streak:     this.streak,
      best:       this.best,
      todayKey:   key,
      todayScore: newScore,
    });
  },
};

// ============================================================
// ANIMATION TIMERS
// ============================================================

const timers = [];

function addTimer(t) { timers.push(t); }

function clearTimers() {
  timers.forEach(clearTimeout);
  timers.length = 0;
}

function animate(srcIdx, count, done) {
  let k = 0;
  const step = () => {
    k++;
    if (k > count) { done(); return; }
    const tgt = (srcIdx + k) % N;
    G.board[tgt]++;
    G.flashIdx = tgt;
    updateBoard();
    const t = setTimeout(() => {
      G.flashIdx = -1;
      step();
    }, 115);
    addTimer(t);
  };
  step();
}

// ============================================================
// NODE GEOMETRY
// ============================================================

function nodeXY(i, r) {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

// ============================================================
// SVG BOARD GENERATION
// ============================================================

function makeBoardSVG() {
  const isEqual = G.puzzleType === 'equal';
  const kVal    = isEqual ? G.target.find(v => v > 0) : null;
  const parts   = [];
  parts.push(`<svg id="bsvg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">`);

  // Outer ring guide always shown
  parts.push(`<circle cx="${CX}" cy="${CY}" r="${OUTER_R}" class="ring-guide"/>`);

  if (isEqual) {
    // Equal mode: no inner ring, show balance hint in centre
    parts.push(`<text x="${CX}" y="${CY - 10}" class="equal-hint-label">aim for</text>`);
    parts.push(`<text x="${CX}" y="${CY + 15}" class="equal-hint-num">≈ ${kVal}</text>`);
    parts.push(`<text x="${CX}" y="${CY + 33}" class="equal-hint-sub">per node</text>`);
  } else {
    // Pattern mode: inner ring with target numbers
    parts.push(`<circle cx="${CX}" cy="${CY}" r="${INNER_R}" class="ring-guide"/>`);
    parts.push(`<text x="${CX}" y="${CY - 9}" class="inner-label">target</text>`);
    parts.push(`<text x="${CX}" y="${CY + 9}" class="center-sym">↻</text>`);
    for (let i = 0; i < N; i++) {
      const [x, y] = nodeXY(i, INNER_R);
      parts.push(`
        <g class="inner-node" id="in${i}">
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${NODE_IR}"/>
          <text x="${x.toFixed(1)}" y="${(y + 0.5).toFixed(1)}">${G.target[i]}</text>
        </g>`);
    }
  }

  // Outer nodes (player board — interactive)
  for (let i = 0; i < N; i++) {
    const [x, y] = nodeXY(i, OUTER_R);
    const matched = G.board[i] === G.target[i];
    const zero    = G.board[i] === 0;
    const cls = ['outer-node', matched ? 'matched' : '', zero ? 'zero' : ''].join(' ').trim();
    parts.push(`
      <g class="${cls}" id="on${i}" data-idx="${i}">
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${NODE_OR}"/>
        <text x="${x.toFixed(1)}" y="${(y + 1).toFixed(1)}">${G.board[i]}</text>
      </g>`);
  }

  parts.push(`</svg>`);
  return parts.join('');
}

// ============================================================
// BOARD UPDATE (in-place, no full redraw)
// ============================================================

function updateBoard() {
  for (let i = 0; i < N; i++) {
    const node = document.getElementById(`on${i}`);
    if (!node) continue;
    const txt = node.querySelector('text');
    if (txt) txt.textContent = G.board[i];

    const matched  = G.board[i] === G.target[i];
    const flashing = G.flashIdx === i;
    const tapped   = G.tapIdx   === i;
    const zero     = G.board[i] === 0;

    node.classList.toggle('matched',  matched  && !flashing);
    node.classList.toggle('flash',    flashing);
    node.classList.toggle('tapped',   tapped);
    node.classList.toggle('zero',     zero && !tapped && !flashing);
  }

  const mv = document.getElementById('moves-display');
  if (mv) mv.innerHTML = movesDotsHTML();
}

function setWinAnim(on) {
  const wrap = document.querySelector('.board-inner');
  if (!wrap) return;

  if (on) {
    wrap.classList.add('win-state');
    // Add overlay
    const ov = document.createElement('div');
    ov.className = 'win-overlay';
    ov.id = 'win-overlay';
    ov.innerHTML = `<div class="win-check">✓</div><div class="win-next">Next puzzle</div>`;
    wrap.appendChild(ov);
    // Mark all as matched
    for (let i = 0; i < N; i++) {
      const node = document.getElementById(`on${i}`);
      if (node) node.classList.add('matched');
    }
  } else {
    wrap.classList.remove('win-state');
    const ov = document.getElementById('win-overlay');
    if (ov) ov.remove();
  }
}

function shakeBoard() {
  const wrap = document.querySelector('.board-inner');
  if (!wrap) return;
  wrap.classList.remove('fail-state');
  void wrap.offsetWidth;
  wrap.classList.add('fail-state');
  addTimer(setTimeout(() => wrap.classList.remove('fail-state'), 500));
}

// ============================================================
// MOVES DOTS HTML
// ============================================================

function movesDotsHTML() {
  const dots = [];
  for (let i = 0; i < G.maxMoves; i++) {
    const used = i >= G.moves;
    let cls = 'mdot used';
    if (!used) {
      if (G.moves === 1)      cls = 'mdot crit';
      else if (G.moves === 2) cls = 'mdot warn';
      else                    cls = 'mdot rem';
    }
    dots.push(`<span class="${cls}"></span>`);
  }
  return dots.join('');
}

// ============================================================
// SCREEN: MENU
// ============================================================

function showMenu() {
  const s = G;
  const played = s.mode === 'daily' && s.todayScore >= 0 && s.todayKey === dateKey();

  document.getElementById('app').innerHTML = `
    <div class="screen menu-screen">
      <div class="menu-meta">
        ${s.streak > 0 ? `
          <div class="streak-badge">
            <span class="streak-num">${s.streak}</span>
            <span>day streak</span>
          </div>` : '<div></div>'}
      </div>

      <div class="menu-hero">
        <h1 class="menu-title">Seeds</h1>
        <p class="menu-subtitle">a daily sowing puzzle</p>
        <svg class="menu-diagram" viewBox="0 0 140 140" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
          ${Array.from({length: 8}, (_, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const ox = 70 + 58 * Math.cos(a), oy = 70 + 58 * Math.sin(a);
            const ix = 70 + 34 * Math.cos(a), iy = 70 + 34 * Math.sin(a);
            return `
              <circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
              <circle cx="${ix.toFixed(1)}" cy="${iy.toFixed(1)}" r="5.5" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
          }).join('')}
          <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="3 5"/>
          <circle cx="70" cy="70" r="34" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="2 5"/>
          <text x="70" y="73" fill="rgba(255,255,255,0.2)" font-size="10" font-family="sans-serif" text-anchor="middle">↻</text>
        </svg>
      </div>

      <div class="menu-actions">
        ${played ? `
          <button class="btn btn-secondary" disabled style="opacity:0.5;cursor:default">
            Today: ${s.todayScore} solved
          </button>` : `
          <button id="btn-daily" class="btn btn-primary">
            Daily Run
            <span class="btn-sub">${dateLabel()}</span>
          </button>`}
        <button id="btn-practice" class="btn btn-secondary">Practice</button>
      </div>

      <p class="menu-rules">tap nodes · sow clockwise · match the pattern</p>
    </div>`;

  if (!played) {
    document.getElementById('btn-daily')?.addEventListener('click', () => G.startDaily());
  }
  document.getElementById('btn-practice')?.addEventListener('click', () => G.startPractice());
}

// ============================================================
// SCREEN: GAME
// ============================================================

function showGame() {
  const modeLabel = G.mode === 'daily' ? 'Daily' : 'Practice';

  document.getElementById('app').innerHTML = `
    <div class="screen game-screen">
      <div class="game-topbar">
        <span class="game-mode-tag">${modeLabel}</span>
        <span class="game-wordmark">Seeds</span>
        <div class="game-score-badge">
          <span class="game-score-num" id="score-val">${G.score}</span>
          <span class="game-score-label">solved</span>
        </div>
      </div>

      <div class="puzzle-infobar">
        <span class="puzzle-label">Puzzle ${G.pIdx + 1}</span>
        <div class="moves-dots" id="moves-display">${movesDotsHTML()}</div>
      </div>

      <div class="board-wrap">
        <div class="board-inner" id="board-inner">
          ${makeBoardSVG()}
        </div>
      </div>

      <div class="game-hint ${G.pIdx === 3 ? 'hint-unlocked' : ''}" id="game-hint">
        ${G.pIdx === 0 && G.score === 0
          ? 'tap a node · seeds sow clockwise'
          : G.puzzleType === 'equal'
            ? 'balance the nodes · one will be empty'
            : G.pIdx === 3
              ? '✦ now match the inner ring exactly'
              : ''}
      </div>

      <div class="debug-panel">
        <div class="debug-label">⚙ debug — ${G.puzzleType} · solution (${G.solutionMoves.length} moves, ${G.maxMoves} allowed)</div>
        <div class="debug-steps">
          ${G.solutionMoves.map((m, i) =>
            `<span class="debug-step">
              <span class="debug-step-num">${i + 1}</span>
              Node&nbsp;<strong>${m.node}</strong>
              <span class="debug-seeds">(${m.seeds} seed${m.seeds !== 1 ? 's' : ''})</span>
            </span>`
          ).join('<span class="debug-arrow">→</span>')}
        </div>
        <div class="debug-boards">
          <span class="debug-board-label">start</span>
          <span class="debug-board">[${G.board.join(', ')}]</span>
          <span class="debug-board-label" style="margin-left:10px">target</span>
          <span class="debug-board">[${G.target.join(', ')}]</span>
        </div>
      </div>
    </div>`;

  document.getElementById('bsvg')?.addEventListener('click', (e) => {
    const node = e.target.closest('[data-idx]');
    if (!node) return;
    G.tap(parseInt(node.dataset.idx, 10));
  });
}

// ============================================================
// SCREEN: END
// ============================================================

function showEnd() {
  const histIcons = G.history.map((won, i) =>
    `<span class="hist-dot ${won ? 'won' : 'lost'}" title="Puzzle ${i+1}">${won ? '◉' : '✕'}</span>`
  ).join('');

  const isPractice = G.mode === 'practice';
  const scoreWord  = G.score === 1 ? 'puzzle' : 'puzzles';

  document.getElementById('app').innerHTML = `
    <div class="screen end-screen">
      <div class="end-topbar">
        <div class="end-wordmark">Seeds</div>
        <div class="end-date">${dateLabel()}</div>
      </div>

      <div class="end-score-area">
        <div class="end-score-num">${G.score}</div>
        <div class="end-score-label">${scoreWord} solved</div>
        <div class="end-history" style="margin-top:18px">${histIcons}</div>
      </div>

      <div class="end-stats">
        <div class="stat">
          <span class="stat-val">${G.best}</span>
          <span class="stat-label">best</span>
        </div>
        ${G.mode === 'daily' ? `
        <div class="stat">
          <span class="stat-val">${G.streak}</span>
          <span class="stat-label">streak</span>
        </div>` : ''}
      </div>

      <div class="end-actions">
        <button id="btn-share" class="btn btn-primary">Share Result</button>
        ${isPractice
          ? `<button id="btn-again" class="btn btn-secondary">Play Again</button>`
          : `<button id="btn-practice" class="btn btn-secondary">Practice</button>`}
        <button id="btn-menu" class="btn btn-ghost">Menu</button>
      </div>

      ${!isPractice ? `<p class="end-tomorrow">New run tomorrow</p>` : ''}
    </div>`;

  document.getElementById('btn-share')?.addEventListener('click', doShare);
  document.getElementById('btn-menu')?.addEventListener('click', () => render());
  document.getElementById('btn-again')?.addEventListener('click', () => G.startPractice());
  document.getElementById('btn-practice')?.addEventListener('click', () => G.startPractice());
}

// ============================================================
// RENDER ROUTER
// ============================================================

function render() {
  G.screen = 'menu';
  showMenu();
}

// ============================================================
// SHARE
// ============================================================

function shareTextContent() {
  const icons = G.history.map(w => w ? '◉' : '✕').join('');
  const lines = [
    `SEEDS — ${dateLabel()}`,
    '',
    icons,
    `${G.score} solved`,
  ];
  return lines.join('\n');
}

function doShare() {
  const text = shareTextContent();
  if (navigator.share) {
    navigator.share({ text }).catch(() => copyFallback(text));
  } else {
    copyFallback(text);
  }
}

function copyFallback(text) {
  navigator.clipboard?.writeText(text).then(() => showToast('Copied!')).catch(() => {
    showToast('Could not copy');
  });
}

function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1700);
}

// ============================================================
// INIT
// ============================================================

window.addEventListener('DOMContentLoaded', () => G.init());
