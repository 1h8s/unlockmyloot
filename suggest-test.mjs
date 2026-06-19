// Тесты подсказок: merge applySuggestedLinks, lockBasePins, linkCellKnown.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function loadSuggest(file) {
  const html = readFileSync(file, 'utf8');
  const grab = (re) => {
    const m = html.match(re);
    if (!m) throw new Error('block not found in ' + file + ': ' + re);
    return m[0];
  };
  const src = [
    grab(/var CODE_ABC[\s\S]*?function decodeConfigV2\(code, silent\)[\s\S]*?\n  return true;\n\}/),
    grab(/function normalizeConfigCode[\s\S]*?\n\}/),
    grab(/function decodeConfig\(code, silent\)[\s\S]*?\n  return true;\n\}/),
    grab(/function wizEnsureZero[\s\S]*?function syncLinkManualZero[\s\S]*?\n\}/),
    grab(/function lockBasePins[\s\S]*?function applySuggestedLinks[\s\S]*?\n  return applied;\n\}/),
  ].join('\n');
  const ctx = {
    N: 0, pins: [], link: [], FLIP: false, pinsTouched: false,
    WIZ_MEM: { zero: null, base: null },
    SUGGESTED_CODE: null,
    localStorage: { setItem() {}, getItem() { return null; } },
    wizMemReset() { ctx.WIZ_MEM.zero = null; ctx.WIZ_MEM.base = null; },
    wizMk2d(fill) {
      const a = [];
      for (let i = 0; i < ctx.N; i++) {
        a[i] = [];
        for (let j = 0; j < ctx.N; j++) a[i][j] = fill;
      }
      return a;
    },
    updateFlipLabel() {}, renderCount() {}, renderPins() {}, renderDeps() {},
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(
    src + '\n;this.encodeConfig=encodeConfig;this.decodeConfig=decodeConfig;' +
    'this.applySuggestedLinks=applySuggestedLinks;this.lockBasePins=lockBasePins;' +
    'this.linkCellKnown=linkCellKnown;this.matrixUnknownCount=matrixUnknownCount;' +
    'this.syncLinkManualZero=syncLinkManualZero;',
    ctx,
  );
  return ctx;
}

for (const file of ['index.html', 'en/index.html']) {
  const ctx = loadSuggest(file);

  // encodeConfig(base) не включает сдвинутые штифты
  ctx.N = 4;
  ctx.pins = [2, 3, 4, 5];
  ctx.WIZ_MEM.base = [7, 6, 5, 4];
  ctx.link = Array.from({ length: 4 }, () => new Array(4).fill(0));
  ctx.link[0][1] = 1;
  ctx.FLIP = false;
  ctx.pinsTouched = true;
  const baseCode = ctx.encodeConfig(ctx.lockBasePins());
  const curCode = ctx.encodeConfig();
  if (baseCode === curCode) throw new Error(file + ': base and shifted pins should differ');
  ctx.decodeConfig(baseCode);
  if (JSON.stringify(ctx.pins) !== '[7,6,5,4]')
    throw new Error(file + ': base code should encode original pins');

  // merge: ручные ячейки не перезаписываются
  ctx.N = 3;
  ctx.pins = [4, 4, 4];
  ctx.WIZ_MEM.base = null;
  ctx.WIZ_MEM.zero = null;
  ctx.link = [
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 0],
  ];
  ctx.syncLinkManualZero(2, 0, 0); // подтверждённое «нет связи»
  const full = ctx.encodeConfig();
  ctx.link = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  ctx.WIZ_MEM.zero = null;
  const n = ctx.applySuggestedLinks(full);
  if (n !== 6) throw new Error(file + ': expected 6 filled cells, got ' + n);
  if (ctx.link[0][1] !== 1) throw new Error(file + ': should fill 0->1');
  if (ctx.link[1][2] !== -1) throw new Error(file + ': should fill 1->2');
  if (!ctx.WIZ_MEM.zero[2][0]) throw new Error(file + ': zero cell should be marked');
  // уже известная ячейка до merge — не трогаем (симулируем ручной ввод)
  ctx.link = [[0, -1, 0], [0, 0, 0], [0, 0, 0]];
  ctx.WIZ_MEM.zero = null;
  ctx.syncLinkManualZero(0, 1, -1);
  const n2 = ctx.applySuggestedLinks(full);
  if (ctx.link[0][1] !== -1) throw new Error(file + ': manual cell overwritten');
  if (n2 !== 5) throw new Error(file + ': expected 5 merges with one preset, got ' + n2);

  // matrixUnknownCount
  ctx.link = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  ctx.WIZ_MEM.zero = null;
  if (ctx.matrixUnknownCount() !== 6) throw new Error(file + ': all unknown');
  ctx.syncLinkManualZero(0, 1, 0);
  if (ctx.matrixUnknownCount() !== 5) throw new Error(file + ': zero counts as known');

  console.log(file + ': suggest merge + lockBasePins OK');
}
console.log('OK');
