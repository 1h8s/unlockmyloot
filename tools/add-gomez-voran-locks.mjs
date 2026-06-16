#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const LOCKS = [
  {
    slug: 'gomez-chambers-door',
    code: 'YiNAIJpEEAiAAA',
    pins: [2, 1, 5, 4, 3, 1],
    n: 6, moves: 28, links: 10, fp: '6.215431',
    ru: {
      name: 'Дверь в покои Гомеза',
      title: 'Как открыть дверь в покои Гомеза в Gothic 1 Remake',
      desc: 'Дверь в покои Гомеза в замке Старого лагеря. 6 плиток, 28 ходов, 10 связей.',
      lead: 'Дверь в покои Гомеза в замке Старого лагеря - 28 ходов и 6 плиток. Путь к комнате босса и сундукам вокруг неё.',
      where: 'Замок Старого лагеря - дверь в покои Гомеза. За ней комната босса, сундук у кровати и замки из комнаты Ворона справа.',
      inside: 'Доступ в покои Гомеза - к сундуку у кровати, сундуку у стены и двери в комнату Ворона.',
      faq: `<details><summary>Это не сундук у кровати?</summary><p>Нет. Сундук в ногах Гомеза - отдельный замок (<code>SgjQQDUgCI</code>, 68 ходов). Это дверь в покои.</p></details><details><summary>Сколько ходов?</summary><p>28 ходов (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: "Door to Gomez's chambers",
      title: "How to open the door to Gomez's chambers in Gothic 1 Remake",
      desc: "Door to Gomez's chambers in the Old Camp castle. 6 plates, 28 moves, 10 links.",
      lead: "The door to Gomez's chambers in the Old Camp castle - 28 moves across 6 plates. The path to the boss room and chests around it.",
      where: "Old Camp castle - the door to Gomez's chambers. Beyond it are the boss room, the bedside chest, the wall chest, and locks from Voran's room on the right.",
      inside: "Access to Gomez's chambers - the bedside chest, wall chest, and door to Voran's room.",
      faq: `<details><summary>Is this the bedside chest?</summary><p>No. Gomez's bedside chest is a separate lock (<code>SgjQQDUgCI</code>, 68 moves). This is the chamber door.</p></details><details><summary>How many moves?</summary><p>28 moves (6 plates, 10 links).</p></details>`,
    },
  },
  {
    slug: 'gomez-wall-chest',
    code: 'ZDAkKqACQECQAA',
    pins: [3, 1, 7, 1, 2, 2],
    n: 6, moves: 75, links: 10, fp: '6.317122',
    ru: {
      name: 'Сундук у стены в покоях Гомеза',
      title: 'Как открыть сундук у стены в покоях Гомеза в Gothic 1 Remake',
      desc: 'Сундук у стены в комнате Гомеза. Со стороны комнаты Ворона. 6 плиток, 75 ходов - рекорд каталога.',
      lead: '75 ходов - новый рекорд каталога. Сундук у стены в покоях Гомеза; замок со стороны комнаты Ворона справа. На первом уровне взлома не открыть.',
      where: 'Покои Гомеза в замке Старого лагеря - сундук у стены. Это замок из комнаты Ворона (справа в покоях Гомеза), не сундук у кровати босса.',
      inside: 'Лут в сундуке у стены - отдельно от сундука в ногах Гомеза.',
      faq: `<details><summary>Можно ли на первом уровне взлома?</summary><p>Нет - замок слишком сложный для стартового навыка. Нужен прокачанный взлом или решатель после сбора связей.</p></details><details><summary>Чем отличается от сундука у кровати?</summary><p>У кровати Гомеза другой код (<code>SgjQQDUgCI</code>, 68 ходов). Этот сундук у стены - <code>ZDAkKqACQECQAA</code>, 75 ходов.</p></details><details><summary>Сколько ходов?</summary><p>75 ходов - рекорд каталога (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: "Wall chest in Gomez's chambers",
      title: "How to open the wall chest in Gomez's chambers in Gothic 1 Remake",
      desc: "Wall chest in Gomez's room. From Voran's side. 6 plates, 75 moves - catalog record.",
      lead: "75 moves - the new catalog record. The wall chest in Gomez's chambers; the lock from Voran's room on the right. Cannot be picked at lockpicking level 1.",
      where: "Gomez's chambers in the Old Camp castle - chest against the wall. This is the lock from Voran's room (right in Gomez's chambers), not the chest at the boss's bed.",
      inside: "Loot in the wall chest - separate from Gomez's bedside chest.",
      faq: `<details><summary>Can I pick it at lockpicking level 1?</summary><p>No - the lock is too hard for starter skill. You need higher lockpicking or the solver after mapping links.</p></details><details><summary>How is this different from the bedside chest?</summary><p>Gomez's bedside chest uses <code>SgjQQDUgCI</code> (68 moves). This wall chest is <code>ZDAkKqACQECQAA</code> (75 moves).</p></details><details><summary>How many moves?</summary><p>75 moves - catalog record (6 plates, 10 links).</p></details>`,
    },
  },
  {
    slug: 'voran-bedside-chest',
    code: 'jV46BEAAIAAAJLASAAA',
    pins: [7, 6, 4, 7, 2, 7, 5],
    n: 7, moves: 38, links: 10, fp: '7.7647275',
    ru: {
      name: 'Сундук у кровати Ворона',
      title: 'Как открыть сундук у кровати Ворона в Gothic 1 Remake',
      desc: 'Сундук у кровати Ворона - первый замок на 7 плиток в каталоге. Ключ от башни, кольцо от огня. 38 ходов.',
      lead: 'Первый замок каталога на 7 плиток. Сундук у кровати Ворона в покоях Гомеза: ключ от башни Ворона, кольцо защиты от огня и расходники.',
      where: 'Комната Ворона справа в покоях Гомеза, замок Старого лагеря. Сундук у его кровати.',
      inside: 'Кольцо защиты от огня, 2 целебных экстракта (исцеление 70 HP), зов сна, подсвечник, 2 столовых прибора, ключ от башни Ворона, 40 монет. Ключ открывает дверь в ногах Ворона при входе в башню (справа) - её взламывать не нужно.',
      faq: `<details><summary>Почему 7 плиток?</summary><p>Это первый проверенный замок каталога с 7 плитками. Решатель поддерживает до 8.</p></details><details><summary>Нужен ли ключ от башни?</summary><p>Ключ лежит в этом сундуке. Им открывается дверь в башню у ног Ворона - взламывать её не надо.</p></details><details><summary>Сколько ходов?</summary><p>38 ходов (7 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: "Voran's bedside chest",
      title: "How to open Voran's bedside chest in Gothic 1 Remake",
      desc: "Chest at Voran's bed - first 7-plate lock in the catalog. Raven Tower key, fire protection ring. 38 moves.",
      lead: "The catalog's first 7-plate lock. Chest at Voran's bed in Gomez's chambers: Raven Tower key, fire protection ring, and supplies.",
      where: "Voran's room on the right in Gomez's chambers, Old Camp castle. Chest at his bed.",
      inside: "Fire protection ring, 2 healing extracts (70 HP heal), sleep call, candlestick, 2 cutlery, Raven Tower key, 40 coins. The key opens the door at Voran's feet when entering the tower (on the right) - no need to pick that door.",
      faq: `<details><summary>Why 7 plates?</summary><p>This is the first verified catalog lock with 7 plates. The solver supports up to 8.</p></details><details><summary>Do I need the tower key?</summary><p>The key is inside this chest. It opens the tower door at Voran's feet - you don't need to pick that lock.</p></details><details><summary>How many moves?</summary><p>38 moves (7 plates, 10 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-left-chest',
    code: 'bVyMKQAAGQAAWA',
    pins: [7, 6, 4, 5, 5, 4],
    n: 6, moves: 35, links: 9, fp: '6.764554',
    ru: {
      name: 'Левый сундук в башне Ворона',
      title: 'Как открыть левый сундук в башне Ворона в Gothic 1 Remake',
      desc: 'Первый сундук слева в башне Ворона после входа из покоев. 6 кубков, 2500 монет, руда. 35 ходов.',
      lead: 'Первый сундук слева в башне Ворона (их в комнате два). После входа из покоев Ворона ключом - 35 ходов, внутри монеты и серебро.',
      where: 'Башня Ворона в замке Старого лагеря. Первый сундук слева после входа из покоев (дверь в ногах Ворона открывается ключом из его сундука).',
      inside: '6 кубков, 10 столовых приборов, 29 руды, 2500 монет.',
      faq: `<details><summary>Где второй сундук?</summary><p>Справа в той же комнате - <a href="/locks/raven-tower-right-chest/">правый сундук башни Ворона</a> (<code>bEhYigAEVCQEAA</code>, 23 хода).</p></details><details><summary>Нужно ли взламывать дверь в башню?</summary><p>Нет. Ключ от башни лежит в <a href="/locks/voran-bedside-chest/">сундуке у кровати Ворона</a>.</p></details><details><summary>Сколько ходов?</summary><p>35 ходов (6 плиток, 9 связей).</p></details>`,
    },
    en: {
      name: 'Raven Tower left chest',
      title: 'How to open the left chest in Raven Tower in Gothic 1 Remake',
      desc: 'First chest on the left in Raven Tower after entering from the chambers. 6 cups, 2500 coins, ore. 35 moves.',
      lead: 'The first chest on the left in Raven Tower (two in the room). After entering from Voran\'s chambers with the key - 35 moves, coins and silver inside.',
      where: 'Raven Tower in the Old Camp castle. First chest on the left after entering from the chambers (door at Voran\'s feet opens with the key from his chest).',
      inside: '6 cups, 10 cutlery, 29 ore, 2500 coins.',
      faq: `<details><summary>Where is the second chest?</summary><p>On the right in the same room - <a href="/en/locks/raven-tower-right-chest/">Raven Tower right chest</a> (<code>bEhYigAEVCQEAA</code>, 23 moves).</p></details><details><summary>Do I need to pick the tower door?</summary><p>No. The tower key is in <a href="/en/locks/voran-bedside-chest/">Voran's bedside chest</a>.</p></details><details><summary>How many moves?</summary><p>35 moves (6 plates, 9 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-right-chest',
    code: 'bEhYigAEVCQEAA',
    pins: [7, 2, 2, 1, 3, 7],
    n: 6, moves: 23, links: 10, fp: '6.722137',
    ru: {
      name: 'Правый сундук в башне Ворона',
      title: 'Как открыть правый сундук в башне Ворона в Gothic 1 Remake',
      desc: 'Сундук справа в башне Ворона. Иззубренные топоры и ржавые мечи. 6 плиток, 23 хода.',
      lead: 'Сундук справа в башне Ворона - короче левого: 23 хода. Внутри оружие для раннего и среднего этапа.',
      where: 'Башня Ворона, та же комната что и левый сундук - этот стоит справа.',
      inside: '3 иззубренных топора (13 урона рассечением, 9 силы), 2 ржавых меча (10 урона рассечением, 5 силы).',
      faq: `<details><summary>Где левый сундук?</summary><p>Слева в той же комнате - <a href="/locks/raven-tower-left-chest/">левый сундук башни Ворона</a> (<code>bVyMKQAAGQAAWA</code>, 35 ходов, монеты и руда).</p></details><details><summary>Сколько ходов?</summary><p>23 хода (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: 'Raven Tower right chest',
      title: 'How to open the right chest in Raven Tower in Gothic 1 Remake',
      desc: 'Chest on the right in Raven Tower. Serrated axes and rusty swords. 6 plates, 23 moves.',
      lead: 'Chest on the right in Raven Tower - shorter than the left one: 23 moves. Weapons for early to mid game inside.',
      where: 'Raven Tower, same room as the left chest - this one is on the right.',
      inside: '3 serrated axes (13 slash damage, 9 Strength), 2 rusty swords (10 slash damage, 5 Strength).',
      faq: `<details><summary>Where is the left chest?</summary><p>On the left in the same room - <a href="/en/locks/raven-tower-left-chest/">Raven Tower left chest</a> (<code>bVyMKQAAGQAAWA</code>, 35 moves, coins and ore).</p></details><details><summary>How many moves?</summary><p>23 moves (6 plates, 10 links).</p></details>`,
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
  const plateWord = lang === 'ru' ? 'плиток' : 'plates';
  const moveWord = lang === 'ru' ? 'ходов' : 'moves';
  const linkWord = lang === 'ru' ? 'связей' : 'links';
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

console.log('done pages');
