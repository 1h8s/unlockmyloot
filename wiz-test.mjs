// Тест ядра мастера связей: извлекает /* wiz-core */ из html и гоняет против симулятора игры.
// Механика: если связанная плитка упёрлась бы в стену, ВЕСЬ ход не происходит -
// она дёргается на месте, позиции не меняются, отмычка теряет прочность.
// Иначе ход проходит и связанные съезжают на link[i][j]*d.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const files = process.argv.slice(2);
if (!files.length) files.push('index.html', 'en/index.html');

function loadCore(file) {
  const html = readFileSync(file, 'utf8');
  const m = html.match(/\/\* wiz-core-start[\s\S]*?\/\* wiz-core-end \*\//);
  if (!m) throw new Error('wiz-core markers not found in ' + file);
  const ctx = { N: 0, link: null };
  vm.createContext(ctx);
  vm.runInContext(m[0], ctx);
  return ctx;
}

function gameMove(pins, hidden, i, d) {
  const jerks = [];
  for (let j = 0; j < pins.length; j++) {
    if (j === i) continue;
    const L = hidden[i][j];
    if (!L) continue;
    const p = pins[j] + L * d;
    if (p < 1 || p > 7) jerks.push(j);
  }
  if (jerks.length)
    return { pins: pins.slice(), failed: true, reacted: jerks.map((j) => ({ plate: j, pos: pins[j], jerk: true })) };
  const nxt = pins.slice();
  nxt[i] += d;
  const reacted = [];
  for (let j = 0; j < pins.length; j++) {
    if (j === i) continue;
    const L = hidden[i][j];
    if (!L) continue;
    nxt[j] = pins[j] + L * d;
    reacted.push({ plate: j, pos: nxt[j], jerk: false });
  }
  return { pins: nxt, failed: false, reacted };
}

function rnd(n) { return Math.floor(Math.random() * n); }

function runLock(ctx, N, startPins, hidden, preset, label, expectCmds) {
  ctx.N = N;
  ctx.link = preset.map((r) => r.slice());
  const wiz = { sim: startPins.slice(), cmd: null, step: 0, confirmedZero: null, rows0: 0 };
  wiz.confirmedZero = ctx.wizMk2d(false);
  wiz.rows0 = ctx.wizRowsLeft(wiz);
  let game = startPins.slice();
  let guard = 0;
  let failures = 0;
  const probed = new Set();
  const cmds = [];

  while (true) {
    const cmd = ctx.wizNextCmd(wiz);
    if (!cmd) break;
    if (++guard > 5 * N + N * N) throw new Error(label + ': too many steps (' + guard + ')');
    const { driver: i, d } = cmd;
    cmds.push([i, d]);
    if (!cmd.helper) probed.add(i);
    if (game[i] + d < 1 || game[i] + d > 7)
      throw new Error(label + ': illegal driver move plate' + (i + 1) + ' d=' + d + ' pin=' + game[i]);
    if (ctx.wizKnownJerksAt(wiz.sim, i, d) > 0)
      throw new Error(label + ': commanded a KNOWN wall hit, wasted pick life');
    if (JSON.stringify(wiz.sim) !== JSON.stringify(game))
      throw new Error(label + ': sim desync before move\nsim ' + wiz.sim + '\ngame ' + game);

    const res = gameMove(game, hidden, i, d);
    game = res.pins;
    if (res.failed) failures++;
    let movers;
    if (cmd.helper) {
      movers = ctx.wizPredictKnownMovers(wiz, cmd);
      for (const m of movers) {
        const r = res.reacted.find((x) => x.plate === m.plate);
        if (!r || r.jerk !== m.jerk)
          throw new Error(label + ': helper predict mismatch plate' + (m.plate + 1));
        const opts = ctx.wizMoverOptions(wiz.sim[m.plate], d);
        const hit = opts.filter((o) => o.pos === r.pos && o.jerk === r.jerk);
        if (hit.length !== 1 || hit[0].link !== m.link)
          throw new Error(label + ': helper link mismatch plate' + (m.plate + 1));
      }
    } else {
      movers = res.reacted.map((r) => {
        const opts = ctx.wizMoverOptions(wiz.sim[r.plate], d);
        const hit = opts.filter((o) => o.pos === r.pos && o.jerk === r.jerk);
        if (hit.length !== 1)
          throw new Error(label + ': option mismatch plate' + (r.plate + 1) + ' pos ' + r.pos + ' jerk ' + r.jerk +
            ' opts ' + JSON.stringify(opts));
        return { plate: r.plate, link: hit[0].link, jerk: r.jerk };
      });
    }
    const failed = ctx.wizApplyOutcome(wiz, cmd, movers);
    if (failed !== res.failed) throw new Error(label + ': failure flag mismatch');
    if (JSON.stringify(wiz.sim) !== JSON.stringify(game))
      throw new Error(label + ': sim desync after move\nsim ' + wiz.sim + '\ngame ' + game);
  }

  if (expectCmds && JSON.stringify(cmds) !== JSON.stringify(expectCmds))
    throw new Error(label + ': command sequence mismatch\ngot  ' + JSON.stringify(cmds) + '\nwant ' + JSON.stringify(expectCmds));

  // корректность: всё записанное должно совпадать с истиной
  const left = ctx.wizRowsLeft(wiz);
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      if (wiz.confirmedZero[i][j] && hidden[i][j] !== 0)
        throw new Error(label + ': confirmed zero but hidden link ' + (i + 1) + '->' + (j + 1));
      if (ctx.link[i][j] !== 0 && probed.has(i) && ctx.link[i][j] !== hidden[i][j])
        throw new Error(label + ': wrong link ' + (i + 1) + '->' + (j + 1) +
          ' got ' + ctx.link[i][j] + ' want ' + hidden[i][j]);
    }
  // полнота: если мастер дошёл до конца, все пробованные строки = истина
  if (left === 0)
    for (const i of probed)
      for (let j = 0; j < N; j++)
        if (i !== j && ctx.link[i][j] !== hidden[i][j])
          throw new Error(label + ': incomplete row ' + (i + 1));
  return { steps: wiz.step, failures, stuck: left > 0 };
}

const zero = (n) => Array.from({ length: n }, () => Array(n).fill(0));

for (const file of files) {
  const ctx = loadCore(file);

  // Сценарий пользователя дословно: штифты 7 6 7 5 3.
  // Скрытые связи: 1->{3,4,5} противоположные, 2->3 противоположная, 3->1 противоположная.
  {
    const N = 5;
    const hidden = zero(N);
    hidden[0][2] = hidden[0][3] = hidden[0][4] = -1;
    hidden[1][2] = -1;
    hidden[2][0] = -1;
    const r = runLock(ctx, N, [7, 6, 7, 5, 3], hidden, zero(N), file + ' user-walkthrough', [
      [0, -1], // плитка 1 вправо - 3-я дёрнулась у стены, ход не прошёл
      [1, -1], // плитка 2 вправо - 3-я снова дёрнулась, ход не прошёл
      [1, 1],  // плитка 2 влево - прошёл, 3-я съехала на 6
      [0, -1], // снова плитка 1 вправо - теперь 3,4,5 съехали: строка известна
      [2, -1], // плитка 3 - тянет 1-ю противоположно
      [3, -1],
      [4, 1],
    ]);
    if (r.failures !== 2 || r.stuck) throw new Error('user-walkthrough: unexpected outcome ' + JSON.stringify(r));
  }

  // Взаимная блокировка у стены: 1 и 3 на штифте 7, связи 1<->3 противоположные.
  // Обе пробы упрутся, но вспомогательных ходов нет - мастер должен честно закончить.
  {
    const N = 3;
    const hidden = zero(N);
    hidden[0][2] = hidden[2][0] = -1;
    const r = runLock(ctx, N, [7, 4, 7], hidden, zero(N), file + ' mutual-wall');
    if (!r.stuck) throw new Error('mutual-wall: expected stuck finish');
  }

  // Фузз: случайные замки, включая заранее (и иногда неверно) заполненную матрицу
  let stuck = 0, totalFail = 0;
  const TRIALS = 700;
  for (let t = 0; t < TRIALS; t++) {
    const N = 3 + rnd(4); // 3..6
    const pins = Array.from({ length: N }, () => 1 + rnd(7));
    const hidden = zero(N);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++)
        if (i !== j && Math.random() < 0.25) hidden[i][j] = Math.random() < 0.5 ? 1 : -1;
    const preset = zero(N);
    if (t % 3 === 0)
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
          if (i !== j && Math.random() < 0.1) preset[i][j] = hidden[i][j]; // ручные отметки честные
    const r = runLock(ctx, N, pins, hidden, preset, file + ' fuzz#' + t + ' N=' + N + ' pins=' + pins);
    if (r.stuck) stuck++;
    totalFail += r.failures;
  }
  console.log('OK', file, '- walkthrough + mutual-wall +', TRIALS, 'fuzz locks;',
    'stuck:', stuck, 'avg wall hits:', (totalFail / TRIALS).toFixed(2));
}
