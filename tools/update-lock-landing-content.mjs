#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;

const STYLE_RE = /<style>[\s\S]*?<\/style>/;
const CSS_LINK = '<link rel="stylesheet" href="/locks/lock-page.css">';

const LOCKS = {
  'ruined-tower-door': {
    code: 'aUkAACUBAAJikA',
    ru: {
      lead: 'Дверь у основания Разрушенной башни  -  один из длиннейших замков раннего прохождения: 57 ходов и 6 плиток. В старых гайдах встречался ошибочный код без стартовых штифтов; здесь полная проверенная конфигурация, сверенная с игрой.',
      where: 'Выходишь к башне по тропе мимо Старого лагеря. За дверью  -  склеп с трупом и сундуком: добротное снаряжение, которое многие ищут по запросу «дверь разрушенной башни Gothic Remake».',
      inside: 'Склеп с трупом и сундуком  -  снаряжение для раннего этапа. У этого замка плитка 5 имеет четыре исходящие связи; именно на нём в решателе ловили баг BFS-помощника.',
      faq: `<details><summary>Почему в старых гайдах другой код?</summary><p>Популярный код <code>YHayiAREIAIABE</code> (45 ходов, другие штифты) оказался неверным для этой двери. Актуальная конфигурация  -  <code>aUkAACUBAAJikA</code>, 57 ходов.</p></details><details><summary>Сколько ходов нужно?</summary><p>Кратчайший безопасный путь  -  57 ходов (6 плиток, 10 связей). Решатель показывает их по шагам.</p></details><details><summary>Что если позиции штифтов не совпадают?</summary><p>Значит у тебя другой экземпляр замка. Введи свои штифты в решателе  -  он найдёт путь для твоей расстановки.</p></details>`,
    },
    en: {
      lead: 'The door at the base of the Ruined Tower is one of the longest early-game locks: 57 moves across 6 plates. Old guides often listed the wrong code without pin positions; this page has the full verified configuration from in-game checks.',
      where: 'Follow the trail past the Old Camp to the tower base. Behind the door is a crypt with a corpse and chest  -  solid early gear that players search for as "Ruined Tower door Gothic Remake".',
      inside: 'A crypt with a corpse and chest  -  early-game equipment. Plate 5 has four outgoing links; this is the lock where the solver\'s BFS helper bug was first caught.',
      faq: `<details><summary>Why do old guides show a different code?</summary><p>The popular code <code>YHayiAREIAIABE</code> (45 moves, different pins) turned out wrong for this door. The correct config is <code>aUkAACUBAAJikA</code>, 57 moves.</p></details><details><summary>How many moves?</summary><p>The shortest safe path is 57 moves (6 plates, 10 links). The solver shows them step by step.</p></details><details><summary>What if my pin positions differ?</summary><p>You have a different lock instance. Enter your pins in the solver  -  it will find a path for your layout.</p></details>`,
    },
  },
  'scatty-chest': {
    code: 'SojAgCBDQA',
    ru: {
      lead: 'Самый знаменитый замок Gothic  -  сундук Скатти с кольцом для квеста «Кольцо для Фингерса». Старые walkthrough\'ы давали ~29 нажатий без стартовых штифтов и связей; здесь полная конфигурация на 31 ход.',
      where: 'Сундук Скатти в Старом лагере. Скатти  -  теневик; сундук завязан на квест «Кольцо для Фингерса», который выдаёт Фингерс.',
      inside: 'Кольцо, которое нужно отдать Фингерсу. Без него квест не продвинется  -  поэтому этот замок один из самых частых в поиске.',
      faq: `<details><summary>Почему в гайдах только ~29 нажатий?</summary><p>Старые walkthrough'ы давали последовательность кликов без стартовых позиций штифтов и связей между плитками. Полная конфигурация  -  31 ход при 5 плитках.</p></details><details><summary>Это сундук у Фингерса?</summary><p>Да  -  кольцо для одноимённого квеста. Скатти живёт в Старом лагере, сундук привязан к заданию Фингерса.</p></details><details><summary>Сколько ходов нужно?</summary><p>Кратчайший безопасный путь  -  31 ход (5 плиток, 6 связей).</p></details>`,
    },
    en: {
      lead: 'The most famous lock in Gothic  -  Scatty\'s chest with the ring for the "A Ring for Fingers" quest. Old walkthroughs listed ~29 clicks without starting pin positions or links; this page has the full 31-move configuration.',
      where: 'Scatty\'s chest in the Old Camp. Scatty is a shadow; the chest is tied to Fingers\' "A Ring for Fingers" quest.',
      inside: 'The ring you must deliver to Fingers. Without it the quest cannot progress  -  which is why this lock tops search results.',
      faq: `<details><summary>Why do guides only list ~29 clicks?</summary><p>Old walkthroughs gave a click sequence without starting pin positions or plate links. The full config is 31 moves across 5 plates.</p></details><details><summary>Is this Fingers' quest chest?</summary><p>Yes  -  the ring for the same-named quest. Scatty lives in the Old Camp; the chest is tied to Fingers' assignment.</p></details><details><summary>How many moves?</summary><p>The shortest safe path is 31 moves (5 plates, 6 links).</p></details>`,
    },
  },
  'cor-galom-chest': {
    code: 'LagFFgA',
    ru: {
      lead: 'Самый короткий замок каталога  -  всего 15 ходов. Сундук Кор Галома в лаборатории Болотного лагеря: внутри рецепт для квеста Декстера.',
      where: 'Лаборатория Кор Галома в Болотном лагере. Сундук стоит в комнате сектантов  -  один из первых «коротких» замков, который проще открыть с решателем, чем методом тыка.',
      inside: 'Рецепт сектантов, нужный для квеста Декстера. Без него сюжет Болотного лагеря не сдвинется.',
      faq: `<details><summary>Нужен ли квест Декстера?</summary><p>Да  -  рецепт внутри нужен для квеста Декстера. Сам замок короткий: 15 ходов, 4 плитки, 5 связей.</p></details><details><summary>Где лаборатория?</summary><p>В Болотном лагере, в здании Кор Галома. Это не сундук Старого или Нового лагеря.</p></details><details><summary>Сколько ходов?</summary><p>15 ходов  -  рекорд каталога по краткости.</p></details>`,
    },
    en: {
      lead: 'The shortest lock in the catalog  -  just 15 moves. Cor Galom\'s chest in the Swamp Camp laboratory holds the recipe for Dexter\'s quest.',
      where: 'Cor Galom\'s laboratory in the Swamp Camp. The chest sits in the sectarians\' room  -  one of the first "short" locks that\'s easier with a solver than trial and error.',
      inside: 'The sectarians\' recipe required for Dexter\'s quest. Without it the Swamp Camp storyline won\'t advance.',
      faq: `<details><summary>Do I need Dexter's quest?</summary><p>Yes  -  the recipe inside is for Dexter's quest. The lock itself is short: 15 moves, 4 plates, 5 links.</p></details><details><summary>Where is the laboratory?</summary><p>In the Swamp Camp, in Cor Galom's building. Not an Old or New Camp chest.</p></details><details><summary>How many moves?</summary><p>15 moves  -  the catalog's shortest record.</p></details>`,
    },
  },
  'rice-lord-storeroom': {
    code: 'RY2VUBQAiA',
    ru: {
      lead: 'Склад на 3-м этаже над рисовыми полями Нового лагеря. Гайды Game8 и rutab предупреждают: на 2-м этаже той же постройки  -  другой замок, не путай.',
      where: 'Постройка Рисового лорда над рисовыми полями Нового лагеря. Эта дверь  -  на 3-м этаже (склад). На 2-м этаже стоит отдельный замок с другой конфигурацией.',
      inside: 'Склад с припасами и лутом. Открывается ключом Рисового лорда или отмычкой.',
      faq: `<details><summary>Чем отличается от замка на 2-м этаже?</summary><p>В одной постройке два замка: на 2-м этаже  -  другой конфиг, этот  -  склад на 3-м. Гайды по рисовым полям часто путают эти двери.</p></details><details><summary>Как попасть на склад?</summary><p>Ключ Рисового лорда или отмычка. Рисовый лорд  -  НПЦ Нового лагеря, надзирает за полями.</p></details><details><summary>Сколько ходов?</summary><p>30 ходов (5 плиток, 9 связей).</p></details>`,
    },
    en: {
      lead: 'The storeroom on the 3rd floor above the New Camp rice fields. Game8 and rutab guides warn: the 2nd floor of the same building has a different lock  -  don\'t mix them up.',
      where: 'The Rice Lord\'s building above the New Camp rice fields. This door is on the 3rd floor (storeroom). The 2nd floor has a separate lock with a different configuration.',
      inside: 'A storeroom with supplies and loot. Opens with the Rice Lord\'s key or a lockpick.',
      faq: `<details><summary>How is this different from the 2nd-floor lock?</summary><p>One building, two locks: the 2nd floor has a different config; this one is the 3rd-floor storeroom. Rice-field guides often confuse these doors.</p></details><details><summary>How do I reach the storeroom?</summary><p>Rice Lord's key or a lockpick. The Rice Lord is a New Camp NPC overseeing the fields.</p></details><details><summary>How many moves?</summary><p>30 moves (5 plates, 9 links).</p></details>`,
    },
  },
  'gomez-bedside-chest': {
    code: 'SgjQQDUgCI',
    ru: {
      lead: '68 ходов  -  рекорд каталога. Сундук у кровати в ногах Гомеза в замке Старого лагеря; вручную почти нереально, решатель выдаёт путь по шагам.',
      where: 'Замок Старого лагеря, комната Гомеза  -  сундук стоит у кровати в ногах босса. Один из самых длинных замков, который игроки ищут после прохождения к сокровищам лагеря.',
      inside: 'Личный тайник Гомеза  -  босса Старого лагеря.',
      credit: 'Конфигурацию нашёл: <b>Влад · DTF</b>',
      faq: `<details><summary>Почему 68 ходов?</summary><p>Это рекорд каталога по длине. Вручную запомнить последовательность почти нереально  -  решатель показывает каждый шаг без ударов в стену.</p></details><details><summary>Где точно сундук?</summary><p>У кровати в ногах Гомеза, в его комнате в замке Старого лагеря.</p></details><details><summary>Откуда взялась конфигурация?</summary><p>Нашёл и прислал Влад с DTF (<a href="https://dtf.ru/id644393">dtf.ru/id644393</a>), сверено с игрой и решателем.</p></details>`,
    },
    en: {
      lead: '68 moves  -  the catalog record. The chest at the foot of Gomez\'s bed in the Old Camp castle; nearly impossible by hand, the solver gives you the path step by step.',
      where: 'Old Camp castle, Gomez\'s room  -  the chest sits at the foot of the boss\'s bed. One of the longest locks players hunt after pushing into the camp\'s treasures.',
      inside: 'Gomez\'s personal stash  -  the Old Camp boss.',
      credit: 'Config found by: <b>Vlad · DTF</b>',
      faq: `<details><summary>Why 68 moves?</summary><p>It's the catalog's length record. Memorizing the sequence by hand is nearly impossible  -  the solver shows each step without wall hits.</p></details><details><summary>Where exactly is the chest?</summary><p>At the foot of Gomez's bed, in his room in the Old Camp castle.</p></details><details><summary>Where did this config come from?</summary><p>Found and submitted by Vlad from DTF (<a href="https://dtf.ru/id644393">dtf.ru/id644393</a>), verified in-game and in the solver.</p></details>`,
    },
  },
  'silas-tavern-basement-chest': {
    code: 'RrGUCRKQIQ',
    ru: {
      lead: 'Подводный сундук в затопленном подвале под таверной Силаса  -  топор Брана для квеста «По шею». Не путать со сундуком в складе за дверью за барменом.',
      where: 'Затопленный подвал под таверной Силаса в Новом лагере. Добраться можно через подводный туннель с озера за таверной или спустившись в подвал за дверью в склад (дверь #9 за Силасом).',
      inside: 'Топор Брана  -  нужен для квеста «По шею».',
      faq: `<details><summary>Это не сундук в складе за баром?</summary><p>Нет. За Силасом  -  дверь в склад таверны, там справа другой сундук. Этот  -  в затопленном подвале ниже, под водой.</p></details><details><summary>Как добраться?</summary><p>Нырнуть: подводный туннель с озера за таверной или спуск в подвал из склада.</p></details><details><summary>Сколько ходов?</summary><p>30 ходов (5 плиток, 10 связей).</p></details>`,
    },
    en: {
      lead: 'An underwater chest in the flooded basement under Silas\'s tavern  -  Bran\'s axe for the "Up to His Neck" quest. Don\'t confuse it with the storeroom chest behind the door past the bartender.',
      where: 'Flooded basement under Silas\'s tavern in the New Camp. Reach it via an underwater tunnel from the lake behind the tavern, or descend from the storeroom (door #9 past Silas).',
      inside: 'Bran\'s axe  -  required for the "Up to His Neck" quest.',
      faq: `<details><summary>Isn't this the storeroom chest behind the bar?</summary><p>No. Past Silas is a door to the tavern storeroom with a different chest on the right. This one is in the flooded basement below, underwater.</p></details><details><summary>How do I get there?</summary><p>Swim: underwater tunnel from the lake behind the tavern, or descend from the storeroom.</p></details><details><summary>How many moves?</summary><p>30 moves (5 plates, 10 links).</p></details>`,
    },
  },
  'graham-chest': {
    code: 'bE0IBAAQkBCAEg',
    ru: {
      lead: 'Грэхэм продаёт карту колонии у Северных ворот  -  его личный сундук часто ищут по запросу «Graham chest combination». 40 ходов, 6 плиток, одна из длинных конфигураций Старого лагеря.',
      where: 'Хижина картографа Грэхэма слева от Северных ворот Старого лагеря, перед первым котлом. Грэхэм продаёт карту колонии и карту Старого лагеря за руду (game8, colony-guide).',
      inside: 'Запас старателя-картографа: руда, припасы и полезный лут для раннего прохождения.',
      faq: `<details><summary>Где хижина относительно ворот?</summary><p>Слева от Северных ворот, перед первым котлом. Рядом с Грэхэмом, который торгует картами.</p></details><details><summary>Почему ищут Graham chest combination?</summary><p>40 ходов и 6 плиток  -  длинный замок; в текстовых гайдах редко дают полную конфигурацию штифтов и связей.</p></details><details><summary>Сколько ходов?</summary><p>40 ходов (6 плиток, 8 связей).</p></details>`,
    },
    en: {
      lead: 'Graham sells the colony map by the North Gate  -  players often search for "Graham chest combination". 40 moves, 6 plates, one of the longer Old Camp configurations.',
      where: 'Cartographer Graham\'s hut left of the Old Camp North Gate, before the first cauldron. Graham sells the colony map and Old Camp map for ore (game8, colony-guide).',
      inside: 'A prospector-cartographer\'s stash: ore, supplies, and useful early-game loot.',
      faq: `<details><summary>Where is the hut relative to the gate?</summary><p>Left of the North Gate, before the first cauldron. Next to Graham, who trades maps.</p></details><details><summary>Why do people search Graham chest combination?</summary><p>40 moves and 6 plates  -  a long lock; text guides rarely give full pin positions and links.</p></details><details><summary>How many moves?</summary><p>40 moves (6 plates, 8 links).</p></details>`,
    },
  },
  'diego-chest': {
    code: 'Yix4ABIAASCSAE',
    ru: {
      lead: 'Сундук самого узнаваемого NPC серии  -  Диего, Тени, которого встречаешь в первых часах. В гайдах (game8) перечисляют лут: отмычки, эссенции, руда; 40 ходов, 6 плиток.',
      where: 'Хижина Диего юго-восточнее ворот замка Старого лагеря. Узнаётся по красной ткани и шкурам у входа  -  один из первых ориентиров в лагере.',
      inside: 'По гайдам game8: 5 эссенций исцеления, 3 отмычки, 22 руды и припасы  -  отличный ранний тайник.',
      faq: `<details><summary>Как найти хижину по внешнему виду?</summary><p>Юго-восточнее ворот замка; у входа красная ткань и шкуры. Диего  -  Тень, помогает герою в начале игры.</p></details><details><summary>Почему так часто ищут этот замок?</summary><p>«Gothic 1 Remake сундук Диего» и «Diego chest combination»  -  один из самых частых запросов: Диего самый узнаваемый персонаж серии.</p></details><details><summary>Сколько ходов?</summary><p>40 ходов (6 плиток, 8 связей).</p></details>`,
    },
    en: {
      lead: 'The chest of the series\' most recognizable NPC  -  Diego, the Shadow you meet in the first hours. Guides (game8) list the loot: lockpicks, essences, ore; 40 moves, 6 plates.',
      where: 'Diego\'s hut southeast of the Old Camp castle gates. Recognizable by the red cloth and hides at the entrance  -  one of the first landmarks in the camp.',
      inside: 'Per game8 guides: 5 healing essences, 3 lockpicks, 22 ore, and supplies  -  an excellent early stash.',
      faq: `<details><summary>How do I spot the hut?</summary><p>Southeast of the castle gates; red cloth and hides at the entrance. Diego is the Shadow who helps you early on.</p></details><details><summary>Why is this lock searched so often?</summary><p>"Gothic 1 Remake Diego chest" and "Diego chest combination" are top queries  -  Diego is the most recognizable character in the series.</p></details><details><summary>How many moves?</summary><p>40 moves (6 plates, 8 links).</p></details>`,
    },
  },
};

function patchMain(html, lang, slug, data) {
  const c = data[lang];
  const lockPrefix = lang === 'en' ? '/en' : '';
  const catalogHref = `${lockPrefix}/locks/`;
  const solverHref = `${lockPrefix}/?lock=${data.code}`;

  // lead
  html = html.replace(
    /<p class="lead">[\s\S]*?<\/p>/,
    `<p class="lead">${c.lead}</p>`
  );

  // where + inside (first two h2 sections after cta)
  html = html.replace(
    /(<h2>Где находится<\/h2>\s*<p>)[\s\S]*?(<\/p>\s*<h2>Что внутри<\/h2>\s*<p>)[\s\S]*?(<\/p>)/,
    `$1${c.where}$2${c.inside}$3`
  );
  html = html.replace(
    /(<h2>Where it is<\/h2>\s*<p>)[\s\S]*?(<\/p>\s*<h2>What's inside<\/h2>\s*<p>)[\s\S]*?(<\/p>)/,
    `$1${c.where}$2${c.inside}$3`
  );

  // credit line for gomez
  if (c.credit) {
    if (html.includes('class="credit"')) {
      html = html.replace(/<p class="credit">[\s\S]*?<\/p>/, `<p class="credit">${c.credit}</p>`);
    } else if (html.includes('Found by:')) {
      html = html.replace(/<p class="pinnote">Found by:[\s\S]*?<\/p>/, `<p class="credit">${c.credit}</p>`);
    } else if (html.includes('Конфигурацию нашёл')) {
      html = html.replace(/<p class="pinnote">Конфигурацию нашёл[\s\S]*?<\/p>/, `<p class="credit">${c.credit}</p>`);
    } else {
      html = html.replace(
        /(<p class="pinnote">(?:Стартовые позиции|Starting pin)[\s\S]*?<\/p>)/,
        `$1\n    <p class="credit">${c.credit}</p>`
      );
    }
  }

  // faq
  const faqLabel = lang === 'ru' ? 'Частые вопросы' : 'FAQ';
  html = html.replace(
    new RegExp(`<h2>${faqLabel}<\\/h2>\\s*<div class="faq">[\\s\\S]*?<\\/div>`),
    `<h2>${faqLabel}</h2>\n    <div class="faq">${c.faq}</div>`
  );

  // footer: remove duplicate cta
  html = html.replace(
    /\s*<a class="cta cta2" href="[^"]*">[\s\S]*?<\/a>\s*<p class="back"><a href="[^"]*">[\s\S]*?<\/a><\/p>/,
    `\n    <p class="footacts"><a href="${solverHref}">${lang === 'ru' ? 'Открыть в решателе &rarr;' : 'Open in solver &rarr;'}</a><span>·</span><a href="${catalogHref}">${lang === 'ru' ? 'Все замки каталога' : 'All catalog locks'}</a></p>`
  );

  return html;
}

for (const [slug, data] of Object.entries(LOCKS)) {
  for (const [lang, subdir] of [
    ['ru', `locks/${slug}/index.html`],
    ['en', `en/locks/${slug}/index.html`],
  ]) {
    const path = join(ROOT, subdir);
    let html = readFileSync(path, 'utf8');
    html = html.replace(STYLE_RE, CSS_LINK);
    html = patchMain(html, lang, slug, data);
    writeFileSync(path, html);
    console.log('updated', subdir);
  }
}

console.log('done');
