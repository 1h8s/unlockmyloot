#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const LOCKS = [
  {
    slug: 'arto-room-door',
    code: 'TbYwABSyBC',
    pins: [7, 7, 7, 7, 2],
    n: 5, moves: 31, links: 9, fp: '5.77772',
    ru: {
      name: 'Дверь в комнату Арто',
      title: 'Как открыть дверь в комнату Арто в Gothic 1 Remake',
      desc: 'Дверь в комнату Арто в покоях Гомеза - напротив комнаты Ворона. 5 плиток, 31 ход.',
      lead: 'Комната Арто в покоях Гомеза - противоположная комнате Ворона справа. Дверь: 31 ход, 5 плиток.',
      where: 'Покои Гомеза, замок Старого лагеря. Комната Арто слева (напротив <a href="/locks/voran-bedside-chest/">комнаты Ворона</a> справа). За дверью два сундука у кроватей.',
      inside: 'Доступ в комнату Арто - к сундукам у ближней и дальней кровати.',
      faq: `<details><summary>Это не комната Ворона?</summary><p>Нет. Ворон справа (<a href="/locks/voran-bedside-chest/">сундук у его кровати</a>, 7 плиток). Арто - слева, эта дверь.</p></details><details><summary>Сколько ходов?</summary><p>31 ход (5 плиток, 9 связей).</p></details>`,
    },
    en: {
      name: "Door to Arto's room",
      title: "How to open the door to Arto's room in Gothic 1 Remake",
      desc: "Door to Arto's room in Gomez's chambers - opposite Voran's room. 5 plates, 31 moves.",
      lead: "Arto's room in Gomez's chambers - opposite Voran's room on the right. Door: 31 moves, 5 plates.",
      where: 'Gomez\'s chambers, Old Camp castle. Arto\'s room on the left (opposite <a href="/en/locks/voran-bedside-chest/">Voran\'s room</a> on the right). Two bedside chests beyond.',
      inside: "Access to Arto's room - chests by the near and far beds.",
      faq: `<details><summary>Isn't this Voran's room?</summary><p>No. Voran is on the right (<a href="/en/locks/voran-bedside-chest/">his bedside chest</a>, 7 plates). Arto is on the left - this door.</p></details><details><summary>How many moves?</summary><p>31 moves (5 plates, 9 links).</p></details>`,
    },
  },
  {
    slug: 'arto-far-bed-chest',
    code: 'ZpEUEAAAgASIAk',
    pins: [4, 3, 3, 2, 1, 6],
    n: 6, moves: 40, links: 7, fp: '6.433216',
    ru: {
      name: 'Сундук у дальней кровати Арто',
      title: 'Как открыть сундук у дальней кровати Арто в Gothic 1 Remake',
      desc: 'Сундук в ногах у дальней кровати в комнате Арто. Кольцо защиты от оружия, экстракты. 40 ходов.',
      lead: 'Сундук в ногах у дальней кровати в комнате Арто. 40 ходов; кольцо защиты от оружия и экстракты жизни.',
      where: 'Комната Арто в покоях Гомеза (слева, напротив Ворона). Сундук у дальней кровати - не путать с <a href="/locks/arto-near-bed-chest/">сундуком у ближней</a>.',
      inside: 'Кольцо защиты от оружия, 2 экстракта жизни, столовые приборы.',
      faq: `<details><summary>Где ближний сундук?</summary><p>У ближней кровати - <a href="/locks/arto-near-bed-chest/">другой замок</a> (кольцо мощи, руда, 52 хода).</p></details><details><summary>Как попасть в комнату?</summary><p>Через <a href="/locks/arto-room-door/">дверь в комнату Арто</a> или из покоев Гомеза после <a href="/locks/gomez-chambers-door/">двери в покои</a>.</p></details><details><summary>Сколько ходов?</summary><p>40 ходов (6 плиток, 7 связей).</p></details>`,
    },
    en: {
      name: "Chest at Arto's far bed",
      title: "How to open the chest at Arto's far bed in Gothic 1 Remake",
      desc: "Chest at the foot of the far bed in Arto's room. Weapon protection ring, extracts. 40 moves.",
      lead: "Chest at the foot of the far bed in Arto's room. 40 moves; weapon protection ring and life extracts.",
      where: 'Arto\'s room in Gomez\'s chambers (left, opposite Voran). Chest at the far bed - not the <a href="/en/locks/arto-near-bed-chest/">near bed chest</a>.',
      inside: 'Weapon protection ring, 2 life extracts, cutlery.',
      faq: `<details><summary>Where is the near bed chest?</summary><p>At the near bed - <a href="/en/locks/arto-near-bed-chest/">a different lock</a> (ring of power, ore, 52 moves).</p></details><details><summary>How do I reach the room?</summary><p>Through the <a href="/en/locks/arto-room-door/">door to Arto's room</a> or via Gomez's chambers after the <a href="/en/locks/gomez-chambers-door/">chamber door</a>.</p></details><details><summary>How many moves?</summary><p>40 moves (6 plates, 7 links).</p></details>`,
    },
  },
  {
    slug: 'arto-near-bed-chest',
    code: 'Y2WYAEGAAIGEAY',
    pins: [2, 6, 5, 6, 5, 7],
    n: 6, moves: 52, links: 9, fp: '6.265657',
    ru: {
      name: 'Сундук у ближней кровати Арто',
      title: 'Как открыть сундук у ближней кровати Арто в Gothic 1 Remake',
      desc: 'Сундук у ближней кровати в комнате Арто. Кольцо мощи, руда, 52 хода - длинный замок.',
      lead: 'Сундук у ближней кровати в комнате Арто. 52 хода - один из длинных в покоях Гомеза; кольцо мощи и 22 руды.',
      where: 'Комната Арто, покои Гомеза. Сундук у ближней кровати (ближе к двери). Дальний - <a href="/locks/arto-far-bed-chest/">у другой кровати</a>.',
      inside: 'Кольцо мощи, экстракт жизни, столовые приборы, 22 руды.',
      faq: `<details><summary>Почему 52 хода?</summary><p>Длинный 6-плиточный замок. Решатель показывает путь по шагам - вручную запомнить тяжело.</p></details><details><summary>Где дальний сундук?</summary><p>У дальней кровати - <a href="/locks/arto-far-bed-chest/">сундук с кольцом защиты от оружия</a> (40 ходов).</p></details><details><summary>Сколько ходов?</summary><p>52 хода (6 плиток, 9 связей).</p></details>`,
    },
    en: {
      name: "Chest at Arto's near bed",
      title: "How to open the chest at Arto's near bed in Gothic 1 Remake",
      desc: "Chest at the near bed in Arto's room. Ring of power, ore, 52 moves - a long lock.",
      lead: "Chest at the near bed in Arto's room. 52 moves - one of the longer locks in Gomez's chambers; ring of power and 22 ore.",
      where: 'Arto\'s room, Gomez\'s chambers. Chest at the near bed (closer to the door). Far bed - <a href="/en/locks/arto-far-bed-chest/">other chest</a>.',
      inside: 'Ring of power, life extract, cutlery, 22 ore.',
      faq: `<details><summary>Why 52 moves?</summary><p>A long 6-plate lock. The solver shows each step - hard to memorize by hand.</p></details><details><summary>Where is the far bed chest?</summary><p>At the far bed - <a href="/en/locks/arto-far-bed-chest/">weapon protection ring chest</a> (40 moves).</p></details><details><summary>How many moves?</summary><p>52 moves (6 plates, 9 links).</p></details>`,
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
