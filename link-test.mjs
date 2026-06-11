import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadCodec(file) {
  const html = readFileSync(file, 'utf8');
  const grab = (re) => {
    const m = html.match(re);
    if (!m) throw new Error('block not found in ' + file + ': ' + re);
    return m[0];
  };
  const src = [
    grab(/var CODE_ABC[\s\S]*?function decodeConfigV2[\s\S]*?\n  return true;\n\}/),
    grab(/function normalizeConfigCode[\s\S]*?\n\}/),
    grab(/function decodeConfig\(code\)[\s\S]*?\n  return true;\n\}/),
  ].join('\n');
  const ctx = {
    N: 0, pins: [], link: [], FLIP: false,
    pinsTouched: false,
    localStorage: { setItem() {}, getItem() { return null; } },
    wizMemReset() {}, updateFlipLabel() {}, renderCount() {}, renderPins() {}, renderDeps() {},
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(src + '\n;this.encodeConfig=encodeConfig;this.decodeConfig=decodeConfig;', ctx);
  return ctx;
}

let seed = 777;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000);

for (const file of ['index.html', 'en/index.html']) {
  const ctx = loadCodec(file);
  let maxLen = 0;
  for (let t = 0; t < 2000; t++) {
    const n = 3 + Math.floor(rnd() * 6);
    ctx.N = n;
    ctx.pins = Array.from({ length: n }, () => 1 + Math.floor(rnd() * 7));
    ctx.link = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const r = rnd();
        ctx.link[i][j] = r < 0.2 ? 1 : r < 0.4 ? -1 : 0;
      }
    ctx.FLIP = rnd() < 0.5;
    const want = { n, pins: ctx.pins.slice(), link: ctx.link.map((r) => r.slice()), flip: ctx.FLIP };
    const code = ctx.encodeConfig();
    if (!/^[A-Za-z0-9_-]+$/.test(code)) throw new Error(file + ': ugly chars in code ' + code);
    maxLen = Math.max(maxLen, code.length);
    ctx.N = 0; ctx.pins = []; ctx.link = []; ctx.FLIP = !want.flip;
    if (ctx.decodeConfig(code) !== true) throw new Error(file + ': decode failed for ' + code);
    if (ctx.N !== want.n || ctx.FLIP !== want.flip) throw new Error(file + ': N/flip mismatch ' + code);
    if (JSON.stringify(ctx.pins) !== JSON.stringify(want.pins)) throw new Error(file + ': pins mismatch ' + code);
    if (JSON.stringify(ctx.link) !== JSON.stringify(want.link)) throw new Error(file + ': link mismatch ' + code);
  }
  // обратная совместимость: старый v1-код из старых ссылок
  const v1 = 'v1.5.76753.--O--OO----O----O---.f1';
  if (ctx.decodeConfig(v1) !== true) throw new Error(file + ': v1 decode failed');
  if (ctx.N !== 5 || JSON.stringify(ctx.pins) !== '[7,6,7,5,3]' || ctx.FLIP !== true)
    throw new Error(file + ': v1 decode wrong values');
  // и полный URL тоже
  if (ctx.decodeConfig('https://unlockmyloot.com/?lock=' + ctx.encodeConfig()) !== true)
    throw new Error(file + ': URL decode failed');
  // мусор не должен проходить
  for (const junk of ['', 'v3.zzz', 'ABC', 'A'.repeat(25), '!!bad!!']) {
    if (ctx.decodeConfig(junk) === true) throw new Error(file + ': junk accepted: ' + junk);
  }
  console.log(`${file}: 2000 round-trips OK, v1 compat OK, max code length ${maxLen}`);
  ctx.N = 6; ctx.pins = [4,4,4,4,4,4]; ctx.link = Array.from({length:6},()=>new Array(6).fill(0)); ctx.FLIP = true;
  console.log('  sample 6-plate link: ?lock=' + ctx.encodeConfig());
}
console.log('OK');
