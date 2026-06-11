import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadSolver(file) {
  const html = readFileSync(file, 'utf8');
  const m = html.match(/\/\* solver-start[\s\S]*?\/\* solver-end \*\//);
  if (!m) throw new Error('solver markers not found in ' + file);
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(m[0] + '; this.solveLock = solveLock;', ctx);
  return ctx.solveLock;
}

function verify(start, link, seq) {
  const n = start.length;
  let cur = start.slice();
  for (const { plate: i, d } of seq) {
    const nxt = cur.slice();
    nxt[i] += d;
    for (let j = 0; j < n; j++) if (j !== i && link[i][j]) nxt[j] += link[i][j] * d;
    if (nxt.some((p) => p < 1 || p > 7)) return false;
    cur = nxt;
  }
  return cur.every((p) => p === 4);
}

function switches(seq) {
  let s = 0;
  for (let i = 1; i < seq.length; i++) if (seq[i].plate !== seq[i - 1].plate) s++;
  return s;
}

// эталон: BFS по состоянию (позиции, последняя плитка), лексикографически (ходы, переключения)
function bruteBest(start, link) {
  const n = start.length;
  const key = (s, last) => s.join('') + '|' + last;
  let frontier = new Map([[key(start, -1), { pins: start.slice(), last: -1, sw: 0 }]]);
  const seen = new Map([[key(start, -1), 0]]);
  if (start.every((p) => p === 4)) return { moves: 0, sw: 0 };
  for (let depth = 1; depth <= 2000; depth++) {
    const next = new Map();
    let goalSw = Infinity;
    for (const { pins, last, sw } of frontier.values()) {
      for (let p = 0; p < n; p++) {
        for (const d of [-1, 1]) {
          const nxt = pins.slice();
          nxt[p] += d;
          for (let j = 0; j < n; j++) if (j !== p && link[p][j]) nxt[j] += link[p][j] * d;
          if (nxt.some((v) => v < 1 || v > 7)) continue;
          const nsw = sw + (last === -1 || p === last ? 0 : 1);
          if (nxt.every((v) => v === 4)) { goalSw = Math.min(goalSw, nsw); continue; }
          const k = key(nxt, p);
          const old = seen.get(k);
          if (old !== undefined && old <= nsw) continue;
          seen.set(k, nsw);
          next.set(k, { pins: nxt, last: p, sw: nsw });
        }
      }
    }
    if (goalSw < Infinity) return { moves: depth, sw: goalSw };
    frontier = next;
    if (!frontier.size) return null;
  }
  return null;
}

function randLock(rnd) {
  const n = 3 + Math.floor(rnd() * 3); // 3..5, чтобы эталон не взорвался
  const pins = Array.from({ length: n }, () => 1 + Math.floor(rnd() * 7));
  const link = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const r = rnd();
      link[i][j] = r < 0.18 ? 1 : r < 0.36 ? -1 : 0;
    }
  return { pins, link };
}

let seed = 1234567;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000);

for (const file of ['index.html', 'en/index.html']) {
  const solveLock = loadSolver(file);

  // тот же пример из мастера: [7,6,7,5,3]; 1->{3,4,5} opp, 2->3 opp, 3->1 opp.
  // Замок нерешаемый (1 и 3 взаимно противоположные - жёсткая сцепка), решатель обязан вернуть null.
  const pins = [7, 6, 7, 5, 3];
  const link = [
    [0, 0, -1, -1, -1],
    [0, 0, -1, 0, 0],
    [-1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  if (solveLock(pins.slice(), link) !== null) throw new Error(file + ': unsolvable lock got a solution');
  console.log(`${file} walkthrough lock: correctly reported unsolvable`);

  // решаемый вариант того же примера: связи только односторонние, 1 -> {3,4,5} opp
  const pins2 = [7, 6, 7, 5, 3];
  const link2 = [
    [0, 0, -1, -1, -1],
    [0, 0, -1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const seq = solveLock(pins2.slice(), link2);
  if (!seq || !verify(pins2, link2, seq)) throw new Error(file + ': variant solution invalid');
  const ref = bruteBest(pins2, link2);
  if (seq.length !== ref.moves) throw new Error(file + `: moves ${seq.length} != optimal ${ref.moves}`);
  if (switches(seq) !== ref.sw) throw new Error(file + `: switches ${switches(seq)} != optimal ${ref.sw}`);
  console.log(`  solvable variant: ${seq.length} moves, ${switches(seq)} switches (both optimal)`);
  console.log('  ' + seq.map((s) => `${s.plate + 1}${s.d > 0 ? 'R' : 'L'}`).join(' '));

  // фузз против эталона
  let solved = 0;
  for (let t = 0; t < 300; t++) {
    const { pins: p2, link: l2 } = randLock(rnd);
    const got = solveLock(p2.slice(), l2);
    const want = bruteBest(p2, l2);
    if (want === null) {
      if (got !== null) throw new Error(file + ': solver found solution where none exists ' + JSON.stringify({ p2, l2 }));
      continue;
    }
    if (got === null) throw new Error(file + ': solver missed solution ' + JSON.stringify({ p2, l2 }));
    if (!verify(p2, l2, got)) throw new Error(file + ': invalid solution ' + JSON.stringify({ p2, l2 }));
    if (got.length !== want.moves)
      throw new Error(file + `: moves ${got.length} != ${want.moves} for ` + JSON.stringify({ p2, l2 }));
    if (switches(got) !== want.sw)
      throw new Error(file + `: switches ${switches(got)} != ${want.sw} for ` + JSON.stringify({ p2, l2 }));
    solved++;
  }
  console.log(`  fuzz: 300 locks, ${solved} solvable, all move- and switch-optimal`);
}
console.log('OK');
