#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const LOCKS = [
  {
    slug: 'gomez-throne-hall-chest',
    code: 'IIAKWgA',
    pins: [1, 3, 1, 1],
    n: 4, moves: 16, links: 6, fp: '4.1311',
    ru: {
      name: 'Сундук в тронном зале у Гомеза',
      title: 'Как открыть сундук в тронном зале у Гомеза в Gothic 1 Remake',
      desc: 'Сундук справа от Гомеза в тронном зале замка. Чертёж королевского оружия, рубины. 16 ходов, кража не считается.',
      lead: 'Сундук справа от Гомеза в тронном зале Старого лагеря. Всего 16 ходов - короткий замок; внутри чертёж королевского оружия и рубины. Можно взламывать спокойно - за кражу не считается.',
      where: 'Тронный зал замка Старого лагеря - сундук стоит справа от Гомеза на троне. Не путать с <a href="/locks/gomez-chambers-door/">дверью в покои</a> и <a href="/locks/gomez-bedside-chest/">сундуком у кровати</a> в спальне.',
      inside: 'Чертёж королевского оружия, 42 руды, 2 рубина, кубок.',
      faq: `<details><summary>Это кража?</summary><p>Нет - этот сундук можно взламывать спокойно, за кражу не считается.</p></details><details><summary>Это сундук в покоях?</summary><p>Нет. Покои Гомеза - за отдельной дверью (<a href="/locks/gomez-chambers-door/">дверь в покои</a>). Этот сундук в тронном зале, рядом с боссом.</p></details><details><summary>Сколько ходов?</summary><p>16 ходов (4 плитки, 6 связей) - один из коротких в каталоге.</p></details>`,
    },
    en: {
      name: "Chest in Gomez's throne hall",
      title: "How to open the chest in Gomez's throne hall in Gothic 1 Remake",
      desc: "Chest to Gomez's right in the castle throne hall. Royal Weapon blueprint, rubies. 16 moves, picking it doesn't count as theft.",
      lead: "Chest to Gomez's right in the Old Camp throne hall. Only 16 moves - a short lock; Royal Weapon blueprint and rubies inside. Safe to pick - doesn't count as theft.",
      where: 'Throne hall of the Old Camp castle - chest stands to Gomez\'s right on the throne. Not the <a href="/en/locks/gomez-chambers-door/">chamber door</a> or <a href="/en/locks/gomez-bedside-chest/">bedside chest</a> in his bedroom.',
      inside: 'Royal Weapon blueprint, 42 ore, 2 rubies, goblet.',
      faq: `<details><summary>Does this count as theft?</summary><p>No - you can pick this chest safely; it doesn't count as theft.</p></details><details><summary>Is this the chamber chest?</summary><p>No. Gomez's chambers are behind a separate door (<a href="/en/locks/gomez-chambers-door/">chamber door</a>). This chest is in the throne hall next to the boss.</p></details><details><summary>How many moves?</summary><p>16 moves (4 plates, 6 links) - one of the shorter locks in the catalog.</p></details>`,
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
