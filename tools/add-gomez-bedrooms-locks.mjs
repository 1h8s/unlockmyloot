#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const LOCKS = [
  {
    slug: 'gomez-bedrooms-door',
    code: 'YHayiAREIAIABE',
    pins: [1, 2, 7, 7, 6, 5],
    n: 6, moves: 45, links: 10, fp: '6.127765',
    ru: {
      name: 'Дверь на этаже спален покоев',
      title: 'Как открыть дверь на этаже спален покоев в Gothic 1 Remake',
      desc: 'Первая дверь на этаже спален покоев Гомеза - комнаты Ворона, Гомеза и Арто. 6 плиток, 45 ходов.',
      lead: 'Первая дверь на этаже спален в покоях Гомеза. 45 ходов, 6 плиток - за ней спальня с двумя сундуками у кроватей (хозяин комнаты пока неизвестен).',
      where: 'Этаж спален покоев Гомеза, замок Старого лагеря - тот же уровень, что <a href="/locks/voran-bedside-chest/">комната Ворона</a>, <a href="/locks/gomez-bedside-chest/">спальня Гомеза</a> и <a href="/locks/arto-room-door/">комната Арто</a>. Это первая дверь на этаже.',
      inside: 'Доступ в неизвестную спальню - к сундукам у ближней и дальней кровати.',
      faq: `<details><summary>Это не комната Ворона или Арто?</summary><p>Нет. Ворон справа, Арто слева - у них свои двери. Это другая дверь на том же этаже спален.</p></details><details><summary>Сколько ходов?</summary><p>45 ходов (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: "Door on Gomez's bedrooms floor",
      title: "How to open the door on Gomez's bedrooms floor in Gothic 1 Remake",
      desc: "First door on the bedrooms floor in Gomez's chambers - Voran, Gomez, and Arto rooms. 6 plates, 45 moves.",
      lead: "The first door on the bedrooms floor in Gomez's chambers. 45 moves, 6 plates - beyond it, a bedroom with two bedside chests (room owner unknown so far).",
      where: 'Bedrooms floor in Gomez\'s chambers, Old Camp castle - same level as <a href="/en/locks/voran-bedside-chest/">Voran\'s room</a>, <a href="/en/locks/gomez-bedside-chest/">Gomez\'s bedroom</a>, and <a href="/en/locks/arto-room-door/">Arto\'s room</a>. This is the first door on that floor.',
      inside: 'Access to an unknown bedroom - chests by the near and far beds.',
      faq: `<details><summary>Isn't this Voran's or Arto's room?</summary><p>No. Voran is on the right, Arto on the left - they have their own doors. This is a different door on the same bedrooms floor.</p></details><details><summary>How many moves?</summary><p>45 moves (6 plates, 10 links).</p></details>`,
    },
  },
  {
    slug: 'gomez-bedrooms-far-chest',
    code: 'RzbBFITEQQ',
    pins: [4, 5, 7, 7, 7],
    n: 5, moves: 39, links: 10, fp: '5.45777',
    ru: {
      name: 'Сундук у дальней кровати (этаж спален)',
      title: 'Как открыть дальний сундук на этаже спален покоев в Gothic 1 Remake',
      desc: 'Дальний сундук в ногах кровати в спальне этажа спален. Кольцо рудной кожи, экстракты, алкоголь. 39 ходов.',
      lead: 'Сундук в ногах у дальней кровати в спальне на этаже спален покоев. 39 ходов; кольцо рудной кожи, экстракты жизни и запас вина с пивом.',
      where: 'Спальня за <a href="/locks/gomez-bedrooms-door/">первой дверью на этаже спален</a>. Сундук у дальней кровати - не путать с <a href="/locks/gomez-bedrooms-near-chest/">ближним сундуком</a>.',
      inside: 'Кольцо рудной кожи, 3 экстракта жизни, 5 вина, 7 пива.',
      faq: `<details><summary>Где ближний сундук?</summary><p>У ближней кровати - <a href="/locks/gomez-bedrooms-near-chest/">другой замок</a> (кольцо великой жизненной силы, 56 ходов).</p></details><details><summary>Как попасть в комнату?</summary><p>Через <a href="/locks/gomez-bedrooms-door/">дверь на этаже спален</a> из покоев Гомеза.</p></details><details><summary>Сколько ходов?</summary><p>39 ходов (5 плиток, 10 связей). Первая плитка уже в центре.</p></details>`,
    },
    en: {
      name: 'Far bed chest (bedrooms floor)',
      title: "How to open the far bed chest on Gomez's bedrooms floor in Gothic 1 Remake",
      desc: "Far chest at the foot of the bed in the bedrooms-floor room. Ore skin ring, extracts, alcohol. 39 moves.",
      lead: "Chest at the foot of the far bed in the bedroom on Gomez's bedrooms floor. 39 moves; ore skin ring, life extracts, wine and beer.",
      where: 'Bedroom beyond the <a href="/en/locks/gomez-bedrooms-door/">first door on the bedrooms floor</a>. Chest at the far bed - not the <a href="/en/locks/gomez-bedrooms-near-chest/">near chest</a>.',
      inside: 'Ore skin ring, 3 life extracts, 5 wine, 7 beer.',
      faq: `<details><summary>Where is the near bed chest?</summary><p>At the near bed - <a href="/en/locks/gomez-bedrooms-near-chest/">a different lock</a> (ring of great vitality, 56 moves).</p></details><details><summary>How do I reach the room?</summary><p>Through the <a href="/en/locks/gomez-bedrooms-door/">door on the bedrooms floor</a> in Gomez\'s chambers.</p></details><details><summary>How many moves?</summary><p>39 moves (5 plates, 10 links). Plate 1 is already centred.</p></details>`,
    },
  },
  {
    slug: 'gomez-bedrooms-near-chest',
    code: 'ZVbYAEKEBgECAA',
    pins: [3, 6, 3, 7, 7, 7],
    n: 6, moves: 56, links: 8, fp: '6.363777',
    ru: {
      name: 'Сундук у ближней кровати (этаж спален)',
      title: 'Как открыть ближний сундук на этаже спален покоев в Gothic 1 Remake',
      desc: 'Ближний сундук в ногах кровати в спальне этажа спален. Кольцо великой жизненной силы, экстракты. 56 ходов.',
      lead: 'Сундук у ближней кровати в спальне на этаже спален покоев. 56 ходов - длинный замок; кольцо великой жизненной силы и экстракты.',
      where: 'Спальня за <a href="/locks/gomez-bedrooms-door/">дверью на этаже спален</a>. Сундук у ближней кровати (ближе к двери). Дальний - <a href="/locks/gomez-bedrooms-far-chest/">у другой кровати</a>.',
      inside: 'Кольцо великой жизненной силы, экстракт жизни, целебный экстракт, столовые приборы.',
      faq: `<details><summary>Почему 56 ходов?</summary><p>Длинный 6-плиточный замок на этаже спален. Решатель показывает путь по шагам.</p></details><details><summary>Где дальний сундук?</summary><p>У дальней кровати - <a href="/locks/gomez-bedrooms-far-chest/">сундук с кольцом рудной кожи</a> (39 ходов).</p></details><details><summary>Сколько ходов?</summary><p>56 ходов (6 плиток, 8 связей).</p></details>`,
    },
    en: {
      name: 'Near bed chest (bedrooms floor)',
      title: "How to open the near bed chest on Gomez's bedrooms floor in Gothic 1 Remake",
      desc: "Near chest at the foot of the bed in the bedrooms-floor room. Ring of great vitality, extracts. 56 moves.",
      lead: "Chest at the near bed in the bedroom on Gomez's bedrooms floor. 56 moves - a long lock; ring of great vitality and extracts.",
      where: 'Bedroom beyond the <a href="/en/locks/gomez-bedrooms-door/">door on the bedrooms floor</a>. Chest at the near bed (closer to the door). Far bed - <a href="/en/locks/gomez-bedrooms-far-chest/">other chest</a>.',
      inside: 'Ring of great vitality, life extract, healing extract, cutlery.',
      faq: `<details><summary>Why 56 moves?</summary><p>A long 6-plate lock on the bedrooms floor. The solver shows each step.</p></details><details><summary>Where is the far bed chest?</summary><p>At the far bed - <a href="/en/locks/gomez-bedrooms-far-chest/">ore skin ring chest</a> (39 moves).</p></details><details><summary>How many moves?</summary><p>56 moves (6 plates, 8 links).</p></details>`,
    },
  },
];

function pinsHtml(pins) {
  let html = '<div class="lc-pins">';
  for (let i = 0; i < pins.length; i++) {
    html += '<div class="lc-row"><span class="n">' + (i + 1) + '</span>';
    for (let p = 1; p <= 7; p++) {
      const cls = 'lc-hole' + (p === 4 ? ' c' : '') + (pins[i] === p ? (p === 4 ? ' pg' : ' p') : '');
      html += '<span class="' + cls + '"></span>';
    }
    html += '</div>';
  }
  return html + '</div>';
}

function pageHtml(lang, L) {
  const c = L[lang];
  const prefix = lang === 'en' ? '/en' : '';
  const solver = lang === 'en' ? '/en/?lock=' : '/?lock=';
  const catalog = prefix + '/locks/';
  const canonical = `https://unlockmyloot.com${prefix}/locks/${L.slug}/`;
  const params = lang === 'ru'
    ? `<span>${L.n} плиток</span><span>${L.moves} ходов</span><span>${L.links} связей</span>`
    : `<span>${L.n} plates</span><span>${L.moves} moves</span><span>${L.links} links</span>`;
  const pinNote = lang === 'ru'
    ? 'Стартовые позиции штифтов (1-7 слева направо, цель - центр, 4). Зелёный - уже в центре.'
    : 'Starting pin positions (1-7 left to right, goal is the centre, 4). Green = already centred.';
  const faqH = lang === 'ru' ? 'Частые вопросы' : 'FAQ';
  const footSolver = lang === 'ru' ? 'Открыть в решателе &rarr;' : 'Open in solver &rarr;';
  const footAll = lang === 'ru' ? 'Все замки каталога' : 'All catalog locks';
  const cta = lang === 'ru' ? 'Открыть этот замок в решателе &rarr;' : 'Open this lock in the solver &rarr;';
  const navCat = lang === 'ru' ? 'Каталог' : 'Catalog';
  const navSol = lang === 'ru' ? 'Решатель' : 'Solver';
  const crumbSol = lang === 'ru' ? 'Решатель' : 'Solver';
  const crumbCat = lang === 'ru' ? 'Каталог' : 'Catalog';
  const foot = lang === 'ru'
    ? 'UnlockMyLoot - решатель и каталог замков Gothic 1 Remake.'
    : 'UnlockMyLoot - Gothic 1 Remake lockpick solver and lock catalog.';
  const home = prefix || '/';

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: crumbSol, item: `https://unlockmyloot.com${home}` },
          { '@type': 'ListItem', position: 2, name: crumbCat, item: `https://unlockmyloot.com${catalog}` },
          { '@type': 'ListItem', position: 3, name: c.name, item: canonical },
        ],
      },
      {
        '@type': 'Article',
        headline: c.title,
        description: c.desc,
        inLanguage: lang,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: 'UnlockMyLoot', url: 'https://unlockmyloot.com/' },
        about: 'Gothic 1 Remake',
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.title} | UnlockMyLoot</title>
<meta name="description" content="${c.desc}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="ru" href="https://unlockmyloot.com/locks/${L.slug}/">
<link rel="alternate" hreflang="en" href="https://unlockmyloot.com/en/locks/${L.slug}/">
<link rel="alternate" hreflang="x-default" href="https://unlockmyloot.com/locks/${L.slug}/">
<meta property="og:type" content="article">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${c.desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://unlockmyloot.com/og.png">
<meta property="og:site_name" content="UnlockMyLoot">
<meta name="theme-color" content="#101214">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48 64x64">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script>(function(){var t=null;try{t=localStorage.getItem('uml-theme');}catch(e){}document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/locks/lock-page.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<div class="pagebg" id="pagebg" aria-hidden="true"></div>
<div class="wrap page">
  <header class="top">
    <a class="wordmark" href="${home}"><span class="dot"></span>UnlockMyLoot</a>
    <nav class="nav"><a href="${catalog}">${navCat}</a><a href="${home}">${navSol}</a></nav>
  </header>
  <nav class="crumb" aria-label="breadcrumb"><a href="${home}">${crumbSol}</a><span>/</span><a href="${catalog}">${crumbCat}</a><span>/</span><span>${c.name}</span></nav>
  <main class="article">
    <h1>${c.title}</h1>
    <p class="lead">${c.lead}</p>
    <a class="cta" href="${solver}${L.code}">${cta}</a>
    <h2>${lang === 'ru' ? 'Где находится' : 'Where it is'}</h2>
    <p>${c.where}</p>
    <h2>${lang === 'ru' ? 'Что внутри' : "What's inside"}</h2>
    <p>${c.inside}</p>
    <h2>${lang === 'ru' ? 'Параметры замка' : 'Lock stats'}</h2>
    <div class="params">${params}</div>
    ${pinsHtml(L.pins)}
    <p class="pinnote">${pinNote}</p>
    <h2>${faqH}</h2>
    <div class="faq">${c.faq}</div>
    <p class="footacts"><a href="${solver}${L.code}">${footSolver}</a><span>·</span><a href="${catalog}">${footAll}</a></p>
  </main>
  <footer class="foot">${foot}</footer>
</div>
<script src="/locks/lock-page.js" defer></script>
</body>
</html>
`;
}

for (const L of LOCKS) {
  mkdirSync(join(ROOT, 'locks', L.slug), { recursive: true });
  mkdirSync(join(ROOT, 'en/locks', L.slug), { recursive: true });
  writeFileSync(join(ROOT, 'locks', L.slug, 'index.html'), pageHtml('ru', L));
  writeFileSync(join(ROOT, 'en/locks', L.slug, 'index.html'), pageHtml('en', L));
  console.log('wrote', L.slug);
}

console.log('done', LOCKS.length, 'locks');
