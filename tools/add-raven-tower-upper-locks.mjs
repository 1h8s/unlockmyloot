#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const LOCKS = [
  {
    slug: 'raven-tower-floor2-stairs-chest',
    code: 'YqahUKAAACIIAA',
    pins: [2, 3, 5, 7, 6, 1],
    n: 6, moves: 48, links: 8, fp: '6.235761',
    ru: {
      name: 'Сундук у лестницы на 2-м этаже башни Ворона',
      title: 'Как открыть сундук у лестницы на 2-м этаже башни Ворона в Gothic 1 Remake',
      desc: 'Сундук сразу после лестницы на 2-м этаже башни Ворона. Вино, крепкое вино, пиво. 6 плиток, 48 ходов.',
      lead: 'Первый сундук на 2-м этаже башни Ворона - сразу после подъёма по лестнице с 1-го. 48 ходов; внутри запас алкоголя.',
      where: 'Башня Ворона, 2-й этаж. Поднимаетесь с <a href="/locks/raven-tower-left-chest/">1-го этажа</a> (9 сундуков у входа) по лестнице - этот сундук прямо у лестничного проёма.',
      inside: '12 вина, 8 крепкого вина, 26 пива.',
      faq: `<details><summary>Где следующий сундук на этаже?</summary><p>Рядом на том же 2-м этаже - <a href="/locks/raven-tower-floor2-chest-2/">второй сундук</a> (12 приборов и 8897 монет).</p></details><details><summary>Как попасть в башню?</summary><p>Ключ из <a href="/locks/voran-bedside-chest/">сундука у кровати Ворона</a> открывает дверь в ногах босса без взлома.</p></details><details><summary>Сколько ходов?</summary><p>48 ходов (6 плиток, 8 связей).</p></details>`,
    },
    en: {
      name: 'Chest by the stairs on Raven Tower floor 2',
      title: 'How to open the chest by the stairs on Raven Tower floor 2 in Gothic 1 Remake',
      desc: 'Chest right after the stairs on Raven Tower floor 2. Wine, strong wine, beer. 6 plates, 48 moves.',
      lead: 'The first chest on Raven Tower floor 2 - right after climbing from floor 1. 48 moves; a stash of alcohol inside.',
      where: 'Raven Tower, 2nd floor. Climb from <a href="/en/locks/raven-tower-left-chest/">floor 1</a> (nine chests by the entrance) - this chest is right at the stairwell.',
      inside: '12 wine, 8 strong wine, 26 beer.',
      faq: `<details><summary>Where is the next chest on this floor?</summary><p>On the same 2nd floor - <a href="/en/locks/raven-tower-floor2-chest-2/">the second chest</a> (12 cutlery and 8897 coins).</p></details><details><summary>How do I reach the tower?</summary><p>The key from <a href="/en/locks/voran-bedside-chest/">Voran's bedside chest</a> opens the door at his feet without lockpicking.</p></details><details><summary>How many moves?</summary><p>48 moves (6 plates, 8 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-floor2-chest-2',
    code: 'Q6XCAhAglI',
    pins: [2, 7, 5, 6, 7],
    n: 5, moves: 27, links: 8, fp: '5.27567',
    ru: {
      name: 'Второй сундук на 2-м этаже башни Ворона',
      title: 'Как открыть второй сундук на 2-м этаже башни Ворона в Gothic 1 Remake',
      desc: 'Второй сундук на 2-м этаже башни Ворона. 12 столовых приборов и 8897 монет. 5 плиток, 27 ходов.',
      lead: 'Следующий сундук на 2-м этаже после сундука у лестницы. 27 ходов - один из самых жирных по монетам в башне.',
      where: 'Башня Ворона, 2-й этаж. После <a href="/locks/raven-tower-floor2-stairs-chest/">сундука у лестницы</a> - следующий по маршруту вверх.',
      inside: '12 столовых приборов и 8897 монет.',
      faq: `<details><summary>Что было на этаже раньше?</summary><p>У лестницы - <a href="/locks/raven-tower-floor2-stairs-chest/">сундук с вином и пивом</a>. Дальше лестница на 3-й этаж.</p></details><details><summary>Сколько ходов?</summary><p>27 ходов (5 плиток, 8 связей).</p></details>`,
    },
    en: {
      name: 'Second chest on Raven Tower floor 2',
      title: 'How to open the second chest on Raven Tower floor 2 in Gothic 1 Remake',
      desc: 'Second chest on Raven Tower floor 2. 12 cutlery and 8897 coins. 5 plates, 27 moves.',
      lead: 'The next chest on floor 2 after the one by the stairs. 27 moves - one of the tower\'s richest coin stashes.',
      where: 'Raven Tower, 2nd floor. After the <a href="/en/locks/raven-tower-floor2-stairs-chest/">chest by the stairs</a> - the next one on the way up.',
      inside: '12 cutlery and 8897 coins.',
      faq: `<details><summary>What came before on this floor?</summary><p>By the stairs - <a href="/en/locks/raven-tower-floor2-stairs-chest/">the wine and beer chest</a>. Then stairs to floor 3.</p></details><details><summary>How many moves?</summary><p>27 moves (5 plates, 8 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-floor3-entrance-chest',
    code: 'QmzSSoBAAg',
    pins: [2, 2, 6, 5, 7],
    n: 5, moves: 44, links: 8, fp: '5.22657',
    ru: {
      name: 'Сундук у входа на 3-м этаже башни Ворона',
      title: 'Как открыть сундук у входа на 3-м этаже башни Ворона в Gothic 1 Remake',
      desc: 'Сундук сразу перед вами на 3-м этаже башни Ворона. Волчьи когти, зубы, приборы. 44 хода.',
      lead: 'Поднялись на 3-й этаж - сундук прямо перед вами у лестницы. 44 хода; внутри трофеи и столовые приборы.',
      where: 'Башня Ворона, 3-й этаж. Сразу после подъёма с 2-го - первый сундук в лицо.',
      inside: '11 волчьих когтей, 8 зубов, 13 столовых приборов.',
      faq: `<details><summary>Есть ещё сундуки на этаже?</summary><p>Да - <a href="/locks/raven-tower-floor3-empty-chest/">следующий сундук</a> на этом же 3-м этаже (пустой).</p></details><details><summary>Сколько ходов?</summary><p>44 хода (5 плиток, 8 связей).</p></details>`,
    },
    en: {
      name: 'Chest at the entrance on Raven Tower floor 3',
      title: 'How to open the chest at the entrance on Raven Tower floor 3 in Gothic 1 Remake',
      desc: 'Chest right in front of you on Raven Tower floor 3. Wolf claws, teeth, cutlery. 44 moves.',
      lead: 'You reach floor 3 - this chest is right in front of you at the stairs. 44 moves; trophies and cutlery inside.',
      where: 'Raven Tower, 3rd floor. Right after climbing from floor 2 - the first chest you see.',
      inside: '11 wolf claws, 8 teeth, 13 cutlery.',
      faq: `<details><summary>Are there more chests on this floor?</summary><p>Yes - the <a href="/en/locks/raven-tower-floor3-empty-chest/">next chest</a> on the same 3rd floor (empty).</p></details><details><summary>How many moves?</summary><p>44 moves (5 plates, 8 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-floor3-empty-chest',
    code: 'RYIBEylAIA',
    pins: [3, 7, 1, 3, 1],
    n: 5, moves: 37, links: 9, fp: '5.37131',
    ru: {
      name: 'Пустой сундук на 3-м этаже башни Ворона',
      title: 'Как открыть пустой сундук на 3-м этаже башни Ворона в Gothic 1 Remake',
      desc: 'Следующий сундук на 3-м этаже башни Ворона. Пустой. 5 плиток, 37 ходов.',
      lead: 'Следующий сундук на 3-м этаже после сундука у входа. 37 ходов - внутри ничего, но конфигурация в каталоге на случай, если лут изменят патчем.',
      where: 'Башня Ворона, 3-й этаж. После <a href="/locks/raven-tower-floor3-entrance-chest/">сундука у лестницы</a> - следующий на этаже.',
      inside: 'Пусто.',
      faq: `<details><summary>Зачем каталог для пустого сундука?</summary><p>Чтобы не тратить отмычки на угадывание - решатель даёт путь. Если в патче положат лут, страницу обновим.</p></details><details><summary>Сколько ходов?</summary><p>37 ходов (5 плиток, 9 связей).</p></details>`,
    },
    en: {
      name: 'Empty chest on Raven Tower floor 3',
      title: 'How to open the empty chest on Raven Tower floor 3 in Gothic 1 Remake',
      desc: 'Next chest on Raven Tower floor 3. Empty. 5 plates, 37 moves.',
      lead: 'The next chest on floor 3 after the entrance chest. 37 moves - nothing inside, but the config is cataloged in case a patch adds loot.',
      where: 'Raven Tower, 3rd floor. After the <a href="/en/locks/raven-tower-floor3-entrance-chest/">entrance chest</a> - the next one on this floor.',
      inside: 'Empty.',
      faq: `<details><summary>Why catalog an empty chest?</summary><p>So you don\'t waste lockpicks guessing - the solver gives the path. If a patch adds loot, we\'ll update the page.</p></details><details><summary>How many moves?</summary><p>37 moves (5 plates, 9 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-floor4-elixirs-chest',
    code: 'h24ZgUAAEAQgAwAKQAA',
    pins: [4, 6, 6, 7, 1, 7, 4],
    n: 7, moves: 36, links: 10, fp: '7.4667174',
    ru: {
      name: 'Сундук с эликсирами на 4-м этаже башни Ворона',
      title: 'Как открыть сундук с эликсирами на 4-м этаже башни Ворона в Gothic 1 Remake',
      desc: 'Сундук за лестницей на 4-м этаже башни Ворона. Эликсиры и экстракты. 7 плиток, 36 ходов.',
      lead: '4-й этаж башни Ворона - сундук сразу за лестницей. 7 плиток и 36 ходов; внутри сильные зелья и экстракты.',
      where: 'Башня Ворона, 4-й этаж. Поднялись с 3-го - сундук за лестницей. Слева от него - <a href="/locks/raven-tower-floor4-food-chest/">сундук с едой</a>.',
      inside: '3 эликсира магической энергии, 2 целебных эликсира, 2 экстракта магической энергии, целебный экстракт.',
      faq: `<details><summary>Почему 7 плиток?</summary><p>Второй замок башни на 7 плитках (первый - <a href="/locks/voran-bedside-chest/">сундук Ворона</a>). Решатель поддерживает до 8.</p></details><details><summary>Где сундук с едой?</summary><p>Слева на том же этаже - <a href="/locks/raven-tower-floor4-food-chest/">сундук с вином и мясом</a>.</p></details><details><summary>Сколько ходов?</summary><p>36 ходов (7 плиток, 10 связей).</p></details>`,
    },
    en: {
      name: 'Elixir chest on Raven Tower floor 4',
      title: 'How to open the elixir chest on Raven Tower floor 4 in Gothic 1 Remake',
      desc: 'Chest past the stairs on Raven Tower floor 4. Elixirs and extracts. 7 plates, 36 moves.',
      lead: 'Raven Tower floor 4 - chest right past the stairs. 7 plates and 36 moves; strong potions and extracts inside.',
      where: 'Raven Tower, 4th floor. Climbed from floor 3 - chest past the stairwell. To its left - the <a href="/en/locks/raven-tower-floor4-food-chest/">food chest</a>.',
      inside: '3 magic energy elixirs, 2 healing elixirs, 2 magic energy extracts, healing extract.',
      faq: `<details><summary>Why 7 plates?</summary><p>The tower\'s second 7-plate lock (first is <a href="/en/locks/voran-bedside-chest/">Voran\'s chest</a>). The solver supports up to 8.</p></details><details><summary>Where is the food chest?</summary><p>On the left on the same floor - <a href="/en/locks/raven-tower-floor4-food-chest/">wine and meat chest</a>.</p></details><details><summary>How many moves?</summary><p>36 moves (7 plates, 10 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-floor4-food-chest',
    code: 'aYqYiAQgCACABA',
    pins: [5, 7, 2, 3, 5, 7],
    n: 6, moves: 43, links: 7, fp: '6.572357',
    ru: {
      name: 'Сундук с едой на 4-м этаже башни Ворона',
      title: 'Как открыть сундук с едой на 4-м этаже башни Ворона в Gothic 1 Remake',
      desc: 'Сундук слева от эликсиров на 4-м этаже башни Ворона. Вино, пиво, мясо. 43 хода.',
      lead: '4-й этаж башни Ворона - сундук слева от сундука с эликсирами. 43 хода; запас еды и выпивки.',
      where: 'Башня Ворона, 4-й этаж. Слева от <a href="/locks/raven-tower-floor4-elixirs-chest/">сундука с эликсирами</a> за лестницей.',
      inside: '6 вина, 11 пива, 6 окороков, 9 жареного мяса.',
      faq: `<details><summary>Где сундук с эликсирами?</summary><p>Справа на том же этаже - <a href="/locks/raven-tower-floor4-elixirs-chest/">сундук с зельями</a> (7 плиток, 36 ходов).</p></details><details><summary>Сколько ходов?</summary><p>43 хода (6 плиток, 7 связей).</p></details>`,
    },
    en: {
      name: 'Food chest on Raven Tower floor 4',
      title: 'How to open the food chest on Raven Tower floor 4 in Gothic 1 Remake',
      desc: 'Chest to the left of the elixir chest on Raven Tower floor 4. Wine, beer, meat. 43 moves.',
      lead: 'Raven Tower floor 4 - chest to the left of the elixir chest. 43 moves; food and drink stash.',
      where: 'Raven Tower, 4th floor. Left of the <a href="/en/locks/raven-tower-floor4-elixirs-chest/">elixir chest</a> past the stairs.',
      inside: '6 wine, 11 beer, 6 hams, 9 roasted meat.',
      faq: `<details><summary>Where is the elixir chest?</summary><p>On the right on the same floor - <a href="/en/locks/raven-tower-floor4-elixirs-chest/">the potion chest</a> (7 plates, 36 moves).</p></details><details><summary>How many moves?</summary><p>43 moves (6 plates, 7 links).</p></details>`,
    },
  },
  {
    slug: 'raven-tower-top-chest',
    code: 'aMCmkAAGBBYAAA',
    pins: [5, 4, 1, 1, 6, 2],
    n: 6, moves: 48, links: 9, fp: '6.541162',
    ru: {
      name: 'Сундук на вершине башни Ворона',
      title: 'Как открыть сундук на вершине башни Ворона в Gothic 1 Remake',
      desc: 'Единственный сундук на вершине башни Ворона. Кольцо ловкости, зов сна, велайис. 48 ходов.',
      lead: 'Верх башни Ворона - один сундук на самой вершине. 48 ходов; кольцо ловкости и редкие расходники.',
      where: 'Вершина башни Ворона в замке Старого лагеря. Подъём через все этажи от <a href="/locks/voran-bedside-chest/">ключа Ворона</a> до самого верха.',
      inside: 'Кольцо ловкости, 4 зова сна, 8 велайис (трава).',
      faq: `<details><summary>Это конец башни?</summary><p>Да - на вершине один сундук. Ниже по этажам ещё <a href="/locks/raven-tower-floor4-elixirs-chest/">эликсиры</a>, <a href="/locks/raven-tower-floor3-entrance-chest/">3-й</a> и <a href="/locks/raven-tower-floor2-stairs-chest/">2-й</a> этажи.</p></details><details><summary>Сколько ходов?</summary><p>48 ходов (6 плиток, 9 связей).</p></details>`,
    },
    en: {
      name: 'Chest at the top of Raven Tower',
      title: 'How to open the chest at the top of Raven Tower in Gothic 1 Remake',
      desc: 'The only chest at the top of Raven Tower. Agility ring, sleep call, velaiis herb. 48 moves.',
      lead: 'The top of Raven Tower - a single chest at the summit. 48 moves; agility ring and rare consumables.',
      where: 'The summit of Raven Tower in the Old Camp castle. Climb all floors from <a href="/en/locks/voran-bedside-chest/">Voran\'s key</a> to the very top.',
      inside: 'Agility ring, 4 sleep calls, 8 velaiis (herb).',
      faq: `<details><summary>Is this the end of the tower?</summary><p>Yes - one chest at the top. Below are more on <a href="/en/locks/raven-tower-floor4-elixirs-chest/">floor 4</a>, <a href="/en/locks/raven-tower-floor3-entrance-chest/">floor 3</a>, and <a href="/en/locks/raven-tower-floor2-stairs-chest/">floor 2</a>.</p></details><details><summary>How many moves?</summary><p>48 moves (6 plates, 9 links).</p></details>`,
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
