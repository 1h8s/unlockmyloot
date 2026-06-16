#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const LOCKS = [
  {
    slug: 'gomez-wine-cellar',
    code: 'bI02qgAAIBgEAg',
    pins: [7, 3, 2, 6, 2, 6],
    n: 6, moves: 31, links: 10, fp: '6.732626',
    ru: {
      name: 'Винный погреб Гомеза',
      title: 'Как открыть винный погреб Гомеза в Gothic 1 Remake',
      desc: 'Склад под Гомезом в замке Старого лагеря - винный погреб за дверью внизу вертикальной лестницы. 6 плиток, 31 ход.',
      lead: 'Винный погреб Гомеза - склад под замком, дверь внизу вертикальной лестницы (как подвал). 31 ход, 6 плиток; не путать с темницей и тронным залом.',
      where: 'Замок Старого лагеря, уровень под Гомезом. Спуститься по вертикальной лестнице вниз - дверь в конце. Это склад / винный погреб, не <a href="/locks/old-camp-dungeon-door/">темница с призраком</a> (другой путь) и не <a href="/locks/gomez-throne-hall-chest/">тронный зал</a>.',
      inside: 'Винный погреб - вино и запасы в складе под замком.',
      faq: `<details><summary>Это темница?</summary><p>Нет. Темница - через коридор к <a href="/locks/old-camp-dungeon-door/">двери с расстрелянным призраком</a> (68 ходов). Погреб - вертикальная лестница под Гомезом.</p></details><details><summary>Где лестница?</summary><p>В замке Старого лагеря, спуск вниз к складу под Гомезом - дверь внизу лестницы.</p></details><details><summary>Сколько ходов?</summary><p>31 ход (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: "Gomez's wine cellar",
      title: "How to open Gomez's wine cellar in Gothic 1 Remake",
      desc: "Storage under Gomez in the Old Camp castle - wine cellar behind the door at the bottom of a vertical ladder. 6 plates, 31 moves.",
      lead: "Gomez's wine cellar - storeroom beneath the castle, door at the bottom of a vertical ladder (basement-style). 31 moves, 6 plates; not the dungeon or throne hall.",
      where: 'Old Camp castle, level below Gomez. Climb down the vertical ladder - door at the bottom. This storeroom / wine cellar is not the <a href="/en/locks/old-camp-dungeon-door/">dungeon by the ghost</a> (different route) or the <a href="/en/locks/gomez-throne-hall-chest/">throne hall</a>.',
      inside: 'Wine cellar - wine and supplies in the storeroom under the castle.',
      faq: `<details><summary>Is this the dungeon?</summary><p>No. The dungeon is via the corridor to the <a href="/en/locks/old-camp-dungeon-door/">door by the executed ghost</a> (68 moves). The cellar is a vertical ladder down under Gomez.</p></details><details><summary>Where is the ladder?</summary><p>In the Old Camp castle - climb down to the storeroom under Gomez; the lock is on the door at the bottom.</p></details><details><summary>How many moves?</summary><p>31 moves (6 plates, 10 links).</p></details>`,
    },
  },
  {
    slug: 'popular-lock',
    code: 'TAmBLEwMAE',
    pins: [7, 1, 2, 2, 5],
    n: 5, moves: 46, links: 10, fp: '5.71225',
    ru: {
      name: 'Популярный замок',
      title: 'Как открыть популярный замок (5 плиток) в Gothic 1 Remake',
      desc: 'Один из самых частых замков в копилке UnlockMyLoot - 5 плиток, 46 ходов, полный набор из 10 связей в коде.',
      lead: 'Популярный замок из копилки игроков - расстановка 7-1-2-2-5, 46 ходов. Ссылка ?lock= несёт все 10 связей; без одной связи решение не сходится.',
      where: 'Локация в игре пока не опознана - замок добавлен по копилке UnlockMyLoot (сотни открытий). Если узнаете, где он в колонии, напишите.',
      inside: 'Лут зависит от локации - название уточним, когда замок опознают в игре.',
      faq: `<details><summary>Почему «популярный»?</summary><p>Одна из самых частых расстановок в копилке. Игроки жаловались, что вручную не хватало одной связи - в коде <code>TAmBLEwMAE</code> все 10 связей уже зашиты.</p></details><details><summary>Чем отличается от TAmALEwMAE?</summary><p>Та же расстановка штифтов (5.71225), но другой набор связей в коде. Для этого замка нужен именно <code>TAmBLEwMAE</code> (10 связей, 46 ходов).</p></details><details><summary>Сколько ходов?</summary><p>46 ходов (5 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: 'Popular lock',
      title: 'How to open the popular lock (5 plates) in Gothic 1 Remake',
      desc: 'One of the most opened locks in the UnlockMyLoot pool - 5 plates, 46 moves, full set of 10 links in the code.',
      lead: 'Popular lock from the player pool - pin layout 7-1-2-2-5, 46 moves. The ?lock= URL carries all 10 links; missing one link breaks the solution.',
      where: 'In-game location not identified yet - added from the UnlockMyLoot pool (hundreds of opens). Let us know if you recognise it in the colony.',
      inside: 'Loot depends on the location - we will name it once the lock is identified in-game.',
      faq: `<details><summary>Why «popular»?</summary><p>One of the most frequent pin layouts in the pool. Players reported missing one link when entering manually - code <code>TAmBLEwMAE</code> includes all 10 links.</p></details><details><summary>How is this different from TAmALEwMAE?</summary><p>Same pin layout (5.71225), different links in the code. This lock needs <code>TAmBLEwMAE</code> specifically (10 links, 46 moves).</p></details><details><summary>How many moves?</summary><p>46 moves (5 plates, 10 links).</p></details>`,
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
