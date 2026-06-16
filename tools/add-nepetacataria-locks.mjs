#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const DTF_USER = 'https://dtf.ru/id3493234';
const DTF_COMMENT = 'https://dtf.ru/games/5121406-kak-vskryt-zamki-v-gothic-1-remake?comment=65516715';

const LOCKS = [
  {
    slug: 'alberto-mine-hut-chest',
    code: 'ULWBAQhAKg',
    pins: [1, 3, 7, 6, 5],
    n: 5, moves: 36, links: 7, fp: '5.13765',
    ru: {
      name: 'Сундук в хижине шахты Альберто',
      title: 'Как открыть сундук в хижине шахты Альберто в Gothic 1 Remake',
      desc: 'Сундук на 1-м этаже в хижине у шахты Альберто. 5 плиток, 36 ходов.',
      lead: 'Сундук в хижине у шахты Альберто - первый этаж. 36 ходов, 5 плиток; один из трёх замков в этой шахте.',
      where: 'Шахта Альберто - сундук в хижине на <strong>1-м этаже</strong>. Наверху по лестнице ещё два: <a href="/locks/alberto-mine-upstairs-left-chest/">левый</a> и <a href="/locks/alberto-mine-upstairs-right-chest/">правый</a> сундуки.',
      inside: 'Лут в сундуке на первом этаже хижины у шахты.',
      faq: `<details><summary>Где ещё сундуки в шахте?</summary><p>Наверху по лестнице - <a href="/locks/alberto-mine-upstairs-left-chest/">левый</a> (20 ходов) и <a href="/locks/alberto-mine-upstairs-right-chest/">правый</a> (13 ходов).</p></details><details><summary>Откуда конфигурация?</summary><p>Прислала <a href="${DTF_USER}">nepetacataria · DTF</a> в <a href="${DTF_COMMENT}">комментарии</a> к гайду по взлому.</p></details><details><summary>Сколько ходов?</summary><p>36 ходов (5 плиток, 7 связей).</p></details>`,
      credit: `Конфигурацию прислала: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
    en: {
      name: "Chest in Alberto's mine hut",
      title: "How to open the chest in Alberto's mine hut in Gothic 1 Remake",
      desc: "Chest on the 1st floor in the hut by Alberto's mine. 5 plates, 36 moves.",
      lead: "Chest in the hut by Alberto's mine - ground floor. 36 moves, 5 plates; one of three locks in this mine.",
      where: 'Alberto\'s mine - chest in the hut on the <strong>1st floor</strong>. Up the ladder: <a href="/en/locks/alberto-mine-upstairs-left-chest/">left</a> and <a href="/en/locks/alberto-mine-upstairs-right-chest/">right</a> chests.',
      inside: 'Loot in the chest on the hut\'s ground floor by the mine.',
      faq: `<details><summary>Any other chests in the mine?</summary><p>Up the ladder - <a href="/en/locks/alberto-mine-upstairs-left-chest/">left</a> (20 moves) and <a href="/en/locks/alberto-mine-upstairs-right-chest/">right</a> (13 moves).</p></details><details><summary>Where is this config from?</summary><p>Submitted by <a href="${DTF_USER}">nepetacataria · DTF</a> in a <a href="${DTF_COMMENT}">comment</a> on the lockpicking guide.</p></details><details><summary>How many moves?</summary><p>36 moves (5 plates, 7 links).</p></details>`,
      credit: `Config submitted by: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
  },
  {
    slug: 'alberto-mine-upstairs-left-chest',
    code: 'MEAIAho',
    pins: [1, 2, 1, 1],
    n: 4, moves: 20, links: 5, fp: '4.1211',
    ru: {
      name: 'Левый сундук наверху в шахте Альберто',
      title: 'Как открыть левый сундук наверху в шахте Альберто в Gothic 1 Remake',
      desc: 'Левый сундук наверху по лестнице в шахте Альберто. 4 плитки, 20 ходов.',
      lead: 'Левый сундук наверху в шахте Альберто - после подъёма по лестнице из хижины. 20 ходов, 4 плитки.',
      where: 'Шахта Альберто - наверху по лестнице из <a href="/locks/alberto-mine-hut-chest/">хижины (1-й этаж)</a>. Это <strong>левый</strong> сундук; справа - <a href="/locks/alberto-mine-upstairs-right-chest/">отдельный замок</a> (13 ходов).',
      inside: 'Лут в левом сундуке наверху шахты.',
      faq: `<details><summary>Это сундук внизу?</summary><p>Нет. Внизу в хижине - <a href="/locks/alberto-mine-hut-chest/">другой сундук</a> (36 ходов).</p></details><details><summary>Откуда конфигурация?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">комментарий на DTF</a>.</p></details><details><summary>Сколько ходов?</summary><p>20 ходов (4 плитки, 5 связей).</p></details>`,
      credit: `Конфигурацию прислала: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
    en: {
      name: "Left chest upstairs in Alberto's mine",
      title: "How to open the left chest upstairs in Alberto's mine in Gothic 1 Remake",
      desc: "Left chest at the top of the ladder in Alberto's mine. 4 plates, 20 moves.",
      lead: "Left chest upstairs in Alberto's mine - after climbing from the hut. 20 moves, 4 plates.",
      where: 'Alberto\'s mine - upstairs from the <a href="/en/locks/alberto-mine-hut-chest/">hut (ground floor)</a>. This is the <strong>left</strong> chest; on the right - <a href="/en/locks/alberto-mine-upstairs-right-chest/">a separate lock</a> (13 moves).',
      inside: 'Loot in the left upstairs chest in the mine.',
      faq: `<details><summary>Is this the downstairs chest?</summary><p>No. Downstairs in the hut - <a href="/en/locks/alberto-mine-hut-chest/">another chest</a> (36 moves).</p></details><details><summary>Where is this config from?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">DTF comment</a>.</p></details><details><summary>How many moves?</summary><p>20 moves (4 plates, 5 links).</p></details>`,
      credit: `Config submitted by: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
  },
  {
    slug: 'alberto-mine-upstairs-right-chest',
    code: 'UZ1wAFAKxU',
    pins: [1, 7, 4, 6, 4],
    n: 5, moves: 13, links: 10, fp: '5.17464',
    ru: {
      name: 'Правый сундук наверху в шахте Альберто',
      title: 'Как открыть правый сундук наверху в шахте Альберто в Gothic 1 Remake',
      desc: 'Правый сундук наверху по лестнице в шахте Альберто. 5 плиток, 13 ходов - короткий замок.',
      lead: 'Правый сундук наверху в шахте Альберто - всего 13 ходов, один из коротких в каталоге. 5 плиток; слева - <a href="/locks/alberto-mine-upstairs-left-chest/">левый сундук</a> (20 ходов).',
      where: 'Шахта Альберто - наверху по лестнице. <strong>Правый</strong> сундук; слева <a href="/locks/alberto-mine-upstairs-left-chest/">левый</a>. Внизу в хижине - <a href="/locks/alberto-mine-hut-chest/">сундук 1-го этажа</a>.',
      inside: 'Лут в правом сундуке наверху.',
      faq: `<details><summary>Почему так мало ходов?</summary><p>13 ходов - короткий замок (5 плиток, 10 связей). Левый сундук рядом - 20 ходов.</p></details><details><summary>Откуда конфигурация?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">комментарий на DTF</a>.</p></details><details><summary>Сколько ходов?</summary><p>13 ходов.</p></details>`,
      credit: `Конфигурацию прислала: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
    en: {
      name: "Right chest upstairs in Alberto's mine",
      title: "How to open the right chest upstairs in Alberto's mine in Gothic 1 Remake",
      desc: "Right chest at the top of the ladder in Alberto's mine. 5 plates, 13 moves - a short lock.",
      lead: 'Right chest upstairs in Alberto\'s mine - only 13 moves, one of the shorter locks in the catalog. 5 plates; on the left - <a href="/en/locks/alberto-mine-upstairs-left-chest/">left chest</a> (20 moves).',
      where: 'Alberto\'s mine - upstairs by the ladder. <strong>Right</strong> chest; on the left the <a href="/en/locks/alberto-mine-upstairs-left-chest/">left chest</a>. Downstairs in the hut - <a href="/en/locks/alberto-mine-hut-chest/">ground-floor chest</a>.',
      inside: 'Loot in the right upstairs chest.',
      faq: `<details><summary>Why so few moves?</summary><p>13 moves - a short lock (5 plates, 10 links). The left chest nearby is 20 moves.</p></details><details><summary>Where is this config from?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">DTF comment</a>.</p></details><details><summary>How many moves?</summary><p>13 moves.</p></details>`,
      credit: `Config submitted by: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
  },
  {
    slug: 'cavalorn-storeroom-door',
    code: 'cuaSQAAQgoQJQA',
    pins: [2, 4, 5, 7, 5, 5],
    n: 6, moves: 41, links: 10, fp: '6.245755',
    ru: {
      name: 'Дверь на склад охотника Кавалорна',
      title: 'Как открыть дверь на склад охотника Кавалорна в Gothic 1 Remake',
      desc: 'Дверь на склад охотника Кавалорна. 6 плиток, 41 ход.',
      lead: 'Дверь на склад охотника Кавалорна - 41 ход, 6 плиток. Отдельный замок у охотника, не путать с шахтой Альберто.',
      where: 'Лагерь охотников - дверь на <strong>склад Кавалорна</strong> (охотник). Не сундуки в <a href="/locks/alberto-mine-hut-chest/">шахте Альберто</a>.',
      inside: 'Склад охотника Кавалорна - припасы и лут за дверью.',
      faq: `<details><summary>Это шахта Альберто?</summary><p>Нет. Три сундука в шахте Альберто - отдельные карточки в каталоге (<a href="/locks/alberto-mine-hut-chest/">хижина</a>, <a href="/locks/alberto-mine-upstairs-left-chest/">левый</a>, <a href="/locks/alberto-mine-upstairs-right-chest/">правый</a>).</p></details><details><summary>Откуда конфигурация?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">комментарий на DTF</a>.</p></details><details><summary>Сколько ходов?</summary><p>41 ход (6 плиток, 10 связей).</p></details>`,
      credit: `Конфигурацию прислала: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
    en: {
      name: "Hunter Cavalorn's storeroom door",
      title: "How to open hunter Cavalorn's storeroom door in Gothic 1 Remake",
      desc: "Door to hunter Cavalorn's storeroom. 6 plates, 41 moves.",
      lead: "Door to hunter Cavalorn's storeroom - 41 moves, 6 plates. A separate lock at the hunter's camp, not Alberto's mine.",
      where: 'Hunters\' camp - door to <strong>Cavalorn\'s storeroom</strong>. Not the chests in <a href="/en/locks/alberto-mine-hut-chest/">Alberto\'s mine</a>.',
      inside: "Cavalorn's storeroom - supplies and loot behind the door.",
      faq: `<details><summary>Is this Alberto's mine?</summary><p>No. The three chests in Alberto's mine are separate catalog entries (<a href="/en/locks/alberto-mine-hut-chest/">hut</a>, <a href="/en/locks/alberto-mine-upstairs-left-chest/">left</a>, <a href="/en/locks/alberto-mine-upstairs-right-chest/">right</a>).</p></details><details><summary>Where is this config from?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">DTF comment</a>.</p></details><details><summary>How many moves?</summary><p>41 moves (6 plates, 10 links).</p></details>`,
      credit: `Config submitted by: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
  },
  {
    slug: 'old-to-new-camp-bandits-chest',
    code: 'cOEMSCgBGIQAAA',
    pins: [1, 4, 5, 2, 1, 4],
    n: 6, moves: 33, links: 9, fp: '6.145214',
    ru: {
      name: 'Сундук у разбойников на пути в Новый лагерь',
      title: 'Как открыть сундук у разбойников на пути в Новый лагерь в Gothic 1 Remake',
      desc: 'Сундук у двоих разбойников на тропе из Старого лагеря в Новый. 6 плиток, 33 хода. Можно облутать, не подходя к ним.',
      lead: 'Сундук рядом с двумя разбойниками на пути из Старого лагеря в Новый - 33 хода. К ним можно не подходить: подойти к сундуку и взломать отдельно.',
      where: 'Тропа <strong>из Старого лагеря в Новый</strong> - стоят двое разбойников (при разговоре хотят ограбить). Сундук рядом; можно обойти и взломать, не заговаривая.',
      inside: 'Лут в сундуке у разбойников на дороге между лагерями.',
      faq: `<details><summary>Обязательно драться?</summary><p>Нет - можно не подходить к разбойникам и просто взломать сундук.</p></details><details><summary>Это путь в Старый лагерь?</summary><p>Нет, наоборот: из <strong>Старого</strong> в <strong>Новый</strong> лагерь (исправление от автора конфигурации).</p></details><details><summary>Откуда конфигурация?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">комментарий на DTF</a>.</p></details><details><summary>Сколько ходов?</summary><p>33 хода (6 плиток, 9 связей).</p></details>`,
      credit: `Конфигурацию прислала: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
    },
    en: {
      name: 'Chest by bandits on the path to the New Camp',
      title: 'How to open the chest by bandits on the path to the New Camp in Gothic 1 Remake',
      desc: 'Chest by two bandits on the trail from the Old Camp to the New Camp. 6 plates, 33 moves. Can be looted without talking to them.',
      lead: 'Chest next to two bandits on the path from the Old Camp to the New Camp - 33 moves. You can skip talking to them and pick the chest separately.',
      where: 'Trail <strong>from the Old Camp to the New Camp</strong> - two bandits (they want to rob you if you talk). Chest nearby; walk up and pick it without engaging.',
      inside: 'Loot in the chest by the bandits on the road between camps.',
      faq: `<details><summary>Do I have to fight?</summary><p>No - you can avoid the bandits and just pick the chest.</p></details><details><summary>Is this the path to the Old Camp?</summary><p>No - the other way: from the <strong>Old</strong> to the <strong>New</strong> Camp (author correction).</p></details><details><summary>Where is this config from?</summary><p><a href="${DTF_USER}">nepetacataria · DTF</a>, <a href="${DTF_COMMENT}">DTF comment</a>.</p></details><details><summary>How many moves?</summary><p>33 moves (6 plates, 9 links).</p></details>`,
      credit: `Config submitted by: <b><a href="${DTF_USER}">nepetacataria · DTF</a></b>`,
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
  const creditLine = c.credit ? `\n    <p class="credit">${c.credit}</p>` : '';

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
    <p class="pinnote">${pinNote}</p>${creditLine}
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
