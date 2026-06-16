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
      lead: 'Самый короткий замок каталога - всего 15 ходов. Сундук с рецептом для квеста Декстера стоит между лабораторными столами в лаборатории Кор Галома.',
      where: 'Между лабораторными столами на первом этаже лаборатории Кор Галома в Болотном лагере. Это сундук с рецептом - не путать со сундуком в спальне на втором этаже.',
      inside: 'Рецепт сектантов, нужный для квеста Декстера. Без него сюжет Болотного лагеря не сдвинется.',
      faq: `<details><summary>Нужен ли квест Декстера?</summary><p>Да - рецепт внутри нужен для квеста Декстера. Сам замок короткий: 15 ходов, 4 плитки, 5 связей.</p></details><details><summary>Это не сундук в спальне на втором этаже?</summary><p>Нет. Рецепт лежит в сундуке между столами на первом этаже (<code>LagFFgA</code>). В спальне на втором этаже - другой замок с кольцом очищения и лутом.</p></details><details><summary>Сколько ходов?</summary><p>15 ходов - рекорд каталога по краткости.</p></details>`,
    },
    en: {
      lead: 'The shortest lock in the catalog - just 15 moves. The recipe chest between laboratory tables in Cor Galom\'s lab holds the item for Dexter\'s quest.',
      where: 'Between the laboratory tables on the ground floor of Cor Galom\'s lab in the Swamp Camp. This is the recipe chest - not the bedroom chest on the second floor.',
      inside: 'The sectarians\' recipe required for Dexter\'s quest. Without it the Swamp Camp storyline won\'t advance.',
      faq: `<details><summary>Do I need Dexter's quest?</summary><p>Yes - the recipe inside is for Dexter's quest. The lock itself is short: 15 moves, 4 plates, 5 links.</p></details><details><summary>Is this the second-floor bedroom chest?</summary><p>No. The recipe is in the chest between tables on the ground floor (<code>LagFFgA</code>). The bedroom upstairs has a different lock with a purification ring and other loot.</p></details><details><summary>How many moves?</summary><p>15 moves - the catalog's shortest record.</p></details>`,
    },
  },
  'cor-galom-bedroom-chest': {
    code: 'a2YMQAAIiECEAA',
    ru: {
      lead: 'Сундук в спальне на втором этаже лаборатории Кор Галома - там, где он спит. 60 ходов, 6 плиток; внутри кольцо очищения и алхимический лут. Не путать со сундуком с рецептом между столами внизу.',
      where: 'Второй этаж лаборатории Кор Галома в Болотном лагере - спальня, где спит Кор Галом. Рецепт для квеста Декстера лежит в другом сундуке между лабораторными столами на первом этаже.',
      inside: 'Кольцо очищения (защита от огня +5, от ветра +3, от льда +3, от энергии +3), свиток пиромантии, 3 серы, 3 тёмных цветка, 2 флакона и изваяние.',
      faq: `<details><summary>Это сундук с рецептом для Декстера?</summary><p>Нет. Рецепт - в сундуке между лабораторными столами на первом этаже (<code>LagFFgA</code>, 15 ходов). Этот сундук в спальне - отдельный замок с кольцом и алхимией.</p></details><details><summary>Что даёт кольцо очищения?</summary><p>Защита от огня +5, от ветра +3, от льда +3, от энергии +3.</p></details><details><summary>Сколько ходов?</summary><p>60 ходов (6 плиток, 7 связей). Решатель показывает путь по шагам.</p></details>`,
    },
    en: {
      lead: 'The chest in Cor Galom\'s bedroom on the second floor of his laboratory - where he sleeps. 60 moves across 6 plates; inside are a purification ring and alchemy loot. Not the recipe chest between the tables downstairs.',
      where: 'Second floor of Cor Galom\'s laboratory in the Swamp Camp - his bedroom where he sleeps. The recipe for Dexter\'s quest is in a different chest between the laboratory tables on the ground floor.',
      inside: 'Purification ring (fire protection +5, wind +3, ice +3, energy +3), pyromancy scroll, 3 brimstones, 3 dark flowers, 2 flasks, and a figurine.',
      faq: `<details><summary>Is this the recipe chest for Dexter's quest?</summary><p>No. The recipe is in the chest between laboratory tables on the ground floor (<code>LagFFgA</code>, 15 moves). This bedroom chest is a separate lock with a ring and alchemy items.</p></details><details><summary>What does the purification ring give?</summary><p>Fire protection +5, wind +3, ice +3, energy +3.</p></details><details><summary>How many moves?</summary><p>60 moves (6 plates, 7 links). The solver shows the path step by step.</p></details>`,
    },
  },
  'swamp-camp-forge-chest': {
    code: 'YQY0gBgAAGACIE',
    ru: {
      lead: 'Сундук в кузнице Болотного лагеря: 41 ход и 6 плиток. Внутри одноручный топор на 29 урона (рассечением) и пачка кузнечных материалов - сталь, дуб, кожа, железо и ива.',
      where: 'Кузница в Болотном лагере - сундук стоит прямо в кузнечной. Это не сундуки лаборатории Кор Галома и не кладовые Нового лагеря.',
      inside: 'Одноручный топор - 29 урона рассечением, требует 23 силы. Плюс 2 стали, 3 древесины дуба, 3 полоски кожи, 3 железа и 4 древесины ивы.',
      faq: `<details><summary>Какой топор внутри?</summary><p>Одноручный топор на 29 урона рассечением. Чтобы экипировать, нужно 23 силы.</p></details><details><summary>Где кузница в Болотном лагере?</summary><p>В самом Болотном лагере - отдельное здание кузницы, не лаборатория Кор Галома.</p></details><details><summary>Сколько ходов?</summary><p>41 ход (6 плиток, 8 связей). Решатель показывает путь по шагам.</p></details>`,
    },
    en: {
      lead: 'The chest in the Swamp Camp forge: 41 moves across 6 plates. Inside are a one-handed axe with 29 slash damage and a bundle of smithing materials - steel, oak, leather, iron, and willow wood.',
      where: 'The forge in the Swamp Camp - the chest sits right in the smithy. Not the Cor Galom laboratory chests or New Camp storerooms.',
      inside: 'A one-handed axe - 29 slash damage, requires 23 Strength. Plus 2 steel, 3 oak wood, 3 leather strips, 3 iron, and 4 willow wood.',
      faq: `<details><summary>What axe is inside?</summary><p>A one-handed axe with 29 slash damage. You need 23 Strength to equip it.</p></details><details><summary>Where is the forge in the Swamp Camp?</summary><p>In the Swamp Camp itself - a separate forge building, not Cor Galom's laboratory.</p></details><details><summary>How many moves?</summary><p>41 moves (6 plates, 8 links). The solver shows the path step by step.</p></details>`,
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
      lead: '68 ходов - один из длиннейших замков каталога. Сундук у кровати в ногах Гомеза в замке Старого лагеря; вручную почти нереально, решатель выдаёт путь по шагам.',
      where: 'Замок Старого лагеря, комната Гомеза - сундук стоит у кровати в ногах босса. Не путать со сундуком у стены со стороны комнаты Ворона.',
      inside: 'Амулет защиты от пламени, экстракт силы (+2 к силе постоянно), целебный элексир (исцеление 100 HP) и 2 северных тёмных цветка.',
      credit: 'Конфигурацию нашёл: <b>Влад · DTF</b>',
      faq: `<details><summary>Почему 68 ходов?</summary><p>Один из самых длинных замков каталога. Рекорд сейчас у <a href="/locks/gomez-wall-chest/">сундука у стены</a> - 75 ходов. Решатель показывает каждый шаг без ударов в стену.</p></details><details><summary>Где точно сундук?</summary><p>У кровати в ногах Гомеза, в его комнате в замке Старого лагеря.</p></details><details><summary>Откуда взялась конфигурация?</summary><p>Нашёл и прислал Влад с DTF (<a href="https://dtf.ru/id644393">dtf.ru/id644393</a>), сверено с игрой и решателем.</p></details>`,
    },
    en: {
      lead: '68 moves - one of the catalog\'s longest locks. The chest at the foot of Gomez\'s bed in the Old Camp castle; nearly impossible by hand, the solver gives you the path step by step.',
      where: 'Old Camp castle, Gomez\'s room - the chest sits at the foot of the boss\'s bed. Not the wall chest on the Voran room side.',
      inside: 'Fire protection amulet, strength extract (+2 Strength permanently), healing elixir (100 HP heal), and 2 northern dark flowers.',
      credit: 'Config found by: <b>Vlad · DTF</b>',
      faq: `<details><summary>Why 68 moves?</summary><p>One of the catalog's longest locks. The record is now the <a href="/en/locks/gomez-wall-chest/">wall chest</a> at 75 moves. The solver shows each step without wall hits.</p></details><details><summary>Where exactly is the chest?</summary><p>At the foot of Gomez's bed, in his room in the Old Camp castle.</p></details><details><summary>Where did this config come from?</summary><p>Found and submitted by Vlad from DTF (<a href="https://dtf.ru/id644393">dtf.ru/id644393</a>), verified in-game and in the solver.</p></details>`,
    },
  },
  'gomez-chambers-door': {
    code: 'YiNAIJpEEAiAAA',
    ru: {
      lead: 'Дверь в покои Гомеза в замке Старого лагеря - 28 ходов и 6 плиток. Путь к комнате босса и сундукам вокруг неё.',
      where: 'Замок Старого лагеря - дверь в покои Гомеза. За ней комната босса, сундук у кровати, комната Ворона справа и <a href="/locks/arto-room-door/">комната Арто</a> слева.',
      inside: 'Доступ в покои Гомеза - к сундуку у кровати, сундуку у стены, двери в комнату Ворона, двери в комнату Арто и <a href="/locks/gomez-bedrooms-door/">двери на этаже спален</a>.',
      faq: `<details><summary>Это не сундук у кровати?</summary><p>Нет. Сундук в ногах Гомеза - отдельный замок (<code>SgjQQDUgCI</code>, 68 ходов). Это дверь в покои.</p></details><details><summary>Сколько ходов?</summary><p>28 ходов (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      lead: 'The door to Gomez\'s chambers in the Old Camp castle - 28 moves across 6 plates. The path to the boss room and the chests around it.',
      where: 'Old Camp castle - door to Gomez\'s chambers. Beyond it: the boss room, bedside chest, Voran\'s room on the right, and <a href="/en/locks/arto-room-door/">Arto\'s room</a> on the left.',
      inside: 'Access to Gomez\'s chambers - the bedside chest, wall chest, door to Voran\'s room, door to Arto\'s room, and the <a href="/en/locks/gomez-bedrooms-door/">door on the bedrooms floor</a>.',
      faq: `<details><summary>Isn't this the bedside chest?</summary><p>No. The chest at Gomez's feet is a separate lock (<code>SgjQQDUgCI</code>, 68 moves). This is the chamber door.</p></details><details><summary>How many moves?</summary><p>28 moves (6 plates, 10 links).</p></details>`,
    },
  },
  'gomez-throne-hall-chest': {
    code: 'IIAKWgA',
    ru: {
      lead: 'Сундук справа от Гомеза в тронном зале Старого лагеря. Всего 16 ходов - короткий замок; внутри чертёж королевского оружия и рубины. Можно взламывать спокойно - за кражу не считается.',
      where: 'Тронный зал замка Старого лагеря - сундук стоит справа от Гомеза на троне. Не путать с <a href="/locks/gomez-chambers-door/">дверью в покои</a> и <a href="/locks/gomez-bedside-chest/">сундуком у кровати</a> в спальне.',
      inside: 'Чертёж королевского оружия, 42 руды, 2 рубина, кубок.',
      faq: `<details><summary>Это кража?</summary><p>Нет - этот сундук можно взламывать спокойно, за кражу не считается.</p></details><details><summary>Это сундук в покоях?</summary><p>Нет. Покои Гомеза - за отдельной дверью (<a href="/locks/gomez-chambers-door/">дверь в покои</a>). Этот сундук в тронном зале, рядом с боссом.</p></details><details><summary>Сколько ходов?</summary><p>16 ходов (4 плитки, 6 связей) - один из коротких в каталоге.</p></details>`,
    },
    en: {
      lead: "Chest to Gomez's right in the Old Camp throne hall. Only 16 moves - a short lock; Royal Weapon blueprint and rubies inside. Safe to pick - doesn't count as theft.",
      where: 'Throne hall of the Old Camp castle - chest stands to Gomez\'s right on the throne. Not the <a href="/en/locks/gomez-chambers-door/">chamber door</a> or <a href="/en/locks/gomez-bedside-chest/">bedside chest</a> in his bedroom.',
      inside: 'Royal Weapon blueprint, 42 ore, 2 rubies, goblet.',
      faq: `<details><summary>Does this count as theft?</summary><p>No - you can pick this chest safely; it doesn't count as theft.</p></details><details><summary>Is this the chamber chest?</summary><p>No. Gomez's chambers are behind a separate door (<a href="/en/locks/gomez-chambers-door/">chamber door</a>). This chest is in the throne hall next to the boss.</p></details><details><summary>How many moves?</summary><p>16 moves (4 plates, 6 links) - one of the shorter locks in the catalog.</p></details>`,
    },
  },
  'gomez-wall-chest': {
    code: 'ZDAkKqACQECQAA',
    ru: {
      lead: '75 ходов - новый рекорд каталога. Сундук у стены в покоях Гомеза; замок со стороны комнаты Ворона справа. На первом уровне взлома не открыть.',
      where: 'Покои Гомеза в замке Старого лагеря - сундук у стены. Это замок из комнаты Ворона (справа в покоях Гомеза), не сундук у кровати босса.',
      inside: 'Лут в сундуке у стены - отдельно от сундука в ногах Гомеза.',
      faq: `<details><summary>Можно ли на первом уровне взлома?</summary><p>Нет - замок слишком сложный для стартового навыка. Нужен прокачанный взлом или решатель после сбора связей.</p></details><details><summary>Чем отличается от сундука у кровати?</summary><p>У кровати Гомеза другой код (<code>SgjQQDUgCI</code>, 68 ходов). Этот сундук у стены - <code>ZDAkKqACQECQAA</code>, 75 ходов.</p></details><details><summary>Сколько ходов?</summary><p>75 ходов - рекорд каталога (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      lead: '75 moves - new catalog record. The wall chest in Gomez\'s chambers; lock on the Voran room side. Cannot be opened at lockpicking level 1.',
      where: 'Gomez\'s chambers in the Old Camp castle - chest against the wall. This is the lock from Voran\'s room (right side of Gomez\'s chambers), not the boss\'s bedside chest.',
      inside: 'Loot in the wall chest - separate from the chest at Gomez\'s feet.',
      faq: `<details><summary>Can I open it at lockpicking level 1?</summary><p>No - the lock is too hard for starter skill. You need trained lockpicking or the solver after collecting links.</p></details><details><summary>How is this different from the bedside chest?</summary><p>Gomez's bedside chest is a different code (<code>SgjQQDUgCI</code>, 68 moves). This wall chest is <code>ZDAkKqACQECQAA</code>, 75 moves.</p></details><details><summary>How many moves?</summary><p>75 moves - catalog record (6 plates, 10 links).</p></details>`,
    },
  },
  'voran-bedside-chest': {
    code: 'jV46BEAAIAAAJLASAAA',
    ru: {
      lead: 'Первый замок каталога на 7 плиток. Сундук у кровати Ворона в покоях Гомеза: ключ от башни Ворона, кольцо защиты от огня и расходники.',
      where: 'Комната Ворона справа в покоях Гомеза, замок Старого лагеря. Сундук у его кровати. Напротив слева — <a href="/locks/arto-room-door/">комната Арто</a> с двумя сундуками.',
      inside: 'Кольцо защиты от огня, 2 целебных экстракта (исцеление 70 HP), зов сна, подсвечник, 2 столовых прибора, ключ от башни Ворона, 40 монет. Ключ открывает дверь в ногах Ворона (справа при входе) - за ней первый этаж башни с девятью сундуками.',
      faq: `<details><summary>Почему 7 плиток?</summary><p>Это первый проверенный замок каталога с 7 плитками. Решатель поддерживает до 8.</p></details><details><summary>Что даёт ключ от башни?</summary><p>Дверь в ногах Ворона без взлома. За ней первый этаж башни Ворона - 9 сундуков; в каталоге пока <a href="/locks/raven-tower-left-chest/">левый</a> и <a href="/locks/raven-tower-right-chest/">правый</a> у входа.</p></details><details><summary>Сколько ходов?</summary><p>38 ходов (7 плиток, 10 связей).</p></details>`,
    },
    en: {
      lead: 'The catalog\'s first 7-plate lock. Voran\'s bedside chest in Gomez\'s chambers: Raven Tower key, fire protection ring, and consumables.',
      where: 'Voran\'s room on the right in Gomez\'s chambers, Old Camp castle. Chest by his bed. Opposite on the left - <a href="/en/locks/arto-room-door/">Arto\'s room</a> with two chests.',
      inside: 'Fire protection ring, 2 healing extracts (70 HP heal), call of sleep, candlestick, 2 cutlery, Raven Tower key, 40 coins. The key opens the door at Voran\'s feet (on the right when entering) - beyond it, Raven Tower\'s first floor with nine chests.',
      faq: `<details><summary>Why 7 plates?</summary><p>This is the first verified 7-plate lock in the catalog. The solver supports up to 8.</p></details><details><summary>What does the tower key do?</summary><p>Opens the door at Voran's feet without lockpicking. Beyond it: Raven Tower's first floor with 9 chests; the catalog has the <a href="/en/locks/raven-tower-left-chest/">left</a> and <a href="/en/locks/raven-tower-right-chest/">right</a> chests by the entrance so far.</p></details><details><summary>How many moves?</summary><p>38 moves (7 plates, 10 links).</p></details>`,
    },
  },
  'arto-room-door': {
    code: 'TbYwABSyBC',
    ru: {
      lead: 'Комната Арто в покоях Гомеза - противоположная комнате Ворона справа. Дверь: 31 ход, 5 плиток.',
      where: 'Покои Гомеза, замок Старого лагеря. Комната Арто слева (напротив <a href="/locks/voran-bedside-chest/">комнаты Ворона</a> справа). За дверью два сундука у кроватей.',
      inside: 'Доступ в комнату Арто - к сундукам у ближней и дальней кровати.',
      faq: `<details><summary>Это не комната Ворона?</summary><p>Нет. Ворон справа (<a href="/locks/voran-bedside-chest/">сундук у его кровати</a>, 7 плиток). Арто - слева, эта дверь.</p></details><details><summary>Сколько ходов?</summary><p>31 ход (5 плиток, 9 связей).</p></details>`,
    },
    en: {
      lead: "Arto's room in Gomez's chambers - opposite Voran's room on the right. Door: 31 moves, 5 plates.",
      where: 'Gomez\'s chambers, Old Camp castle. Arto\'s room on the left (opposite <a href="/en/locks/voran-bedside-chest/">Voran\'s room</a> on the right). Two bedside chests beyond.',
      inside: "Access to Arto's room - chests by the near and far beds.",
      faq: `<details><summary>Isn't this Voran's room?</summary><p>No. Voran is on the right (<a href="/en/locks/voran-bedside-chest/">his bedside chest</a>, 7 plates). Arto is on the left - this door.</p></details><details><summary>How many moves?</summary><p>31 moves (5 plates, 9 links).</p></details>`,
    },
  },
  'arto-far-bed-chest': {
    code: 'ZpEUEAAAgASIAk',
    ru: {
      lead: 'Сундук в ногах у дальней кровати в комнате Арто. 40 ходов; кольцо защиты от оружия и экстракты жизни.',
      where: 'Комната Арто в покоях Гомеза (слева, напротив Ворона). Сундук у дальней кровати - не путать с <a href="/locks/arto-near-bed-chest/">сундуком у ближней</a>.',
      inside: 'Кольцо защиты от оружия, 2 экстракта жизни, столовые приборы.',
      faq: `<details><summary>Где ближний сундук?</summary><p>У ближней кровати - <a href="/locks/arto-near-bed-chest/">другой замок</a> (кольцо мощи, руда, 52 хода).</p></details><details><summary>Как попасть в комнату?</summary><p>Через <a href="/locks/arto-room-door/">дверь в комнату Арто</a> или из покоев Гомеза после <a href="/locks/gomez-chambers-door/">двери в покои</a>.</p></details><details><summary>Сколько ходов?</summary><p>40 ходов (6 плиток, 7 связей).</p></details>`,
    },
    en: {
      lead: "Chest at the foot of the far bed in Arto's room. 40 moves; weapon protection ring and life extracts.",
      where: 'Arto\'s room in Gomez\'s chambers (left, opposite Voran). Chest at the far bed - not the <a href="/en/locks/arto-near-bed-chest/">near bed chest</a>.',
      inside: 'Weapon protection ring, 2 life extracts, cutlery.',
      faq: `<details><summary>Where is the near bed chest?</summary><p>At the near bed - <a href="/en/locks/arto-near-bed-chest/">a different lock</a> (ring of power, ore, 52 moves).</p></details><details><summary>How do I reach the room?</summary><p>Through the <a href="/en/locks/arto-room-door/">door to Arto's room</a> or via Gomez's chambers after the <a href="/en/locks/gomez-chambers-door/">chamber door</a>.</p></details><details><summary>How many moves?</summary><p>40 moves (6 plates, 7 links).</p></details>`,
    },
  },
  'arto-near-bed-chest': {
    code: 'Y2WYAEGAAIGEAY',
    ru: {
      lead: 'Сундук у ближней кровати в комнате Арто. 52 хода - один из длинных в покоях Гомеза; кольцо мощи и 22 руды.',
      where: 'Комната Арто, покои Гомеза. Сундук у ближней кровати (ближе к двери). Дальний - <a href="/locks/arto-far-bed-chest/">у другой кровати</a>.',
      inside: 'Кольцо мощи, экстракт жизни, столовые приборы, 22 руды.',
      faq: `<details><summary>Почему 52 хода?</summary><p>Длинный 6-плиточный замок. Решатель показывает путь по шагам - вручную запомнить тяжело.</p></details><details><summary>Где дальний сундук?</summary><p>У дальней кровати - <a href="/locks/arto-far-bed-chest/">сундук с кольцом защиты от оружия</a> (40 ходов).</p></details><details><summary>Сколько ходов?</summary><p>52 хода (6 плиток, 9 связей).</p></details>`,
    },
    en: {
      lead: "Chest at the near bed in Arto's room. 52 moves - one of the longer locks in Gomez's chambers; ring of power and 22 ore.",
      where: 'Arto\'s room, Gomez\'s chambers. Chest at the near bed (closer to the door). Far bed - <a href="/en/locks/arto-far-bed-chest/">other chest</a>.',
      inside: 'Ring of power, life extract, cutlery, 22 ore.',
      faq: `<details><summary>Why 52 moves?</summary><p>A long 6-plate lock. The solver shows each step - hard to memorize by hand.</p></details><details><summary>Where is the far bed chest?</summary><p>At the far bed - <a href="/en/locks/arto-far-bed-chest/">weapon protection ring chest</a> (40 moves).</p></details><details><summary>How many moves?</summary><p>52 moves (6 plates, 9 links).</p></details>`,
    },
  },
  'gomez-bedrooms-door': {
    code: 'YHayiAREIAIABE',
    ru: {
      lead: 'Первая дверь на этаже спален в покоях Гомеза. 45 ходов, 6 плиток - за ней спальня с двумя сундуками у кроватей (хозяин комнаты пока неизвестен).',
      where: 'Этаж спален покоев Гомеза, замок Старого лагеря - тот же уровень, что <a href="/locks/voran-bedside-chest/">комната Ворона</a>, <a href="/locks/gomez-bedside-chest/">спальня Гомеза</a> и <a href="/locks/arto-room-door/">комната Арто</a>. Это первая дверь на этаже.',
      inside: 'Доступ в неизвестную спальню - к сундукам у ближней и дальней кровати.',
      faq: `<details><summary>Это не комната Ворона или Арто?</summary><p>Нет. Ворон справа, Арто слева - у них свои двери. Это другая дверь на том же этаже спален.</p></details><details><summary>Сколько ходов?</summary><p>45 ходов (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      lead: "The first door on the bedrooms floor in Gomez's chambers. 45 moves, 6 plates - beyond it, a bedroom with two bedside chests (room owner unknown so far).",
      where: 'Bedrooms floor in Gomez\'s chambers, Old Camp castle - same level as <a href="/en/locks/voran-bedside-chest/">Voran\'s room</a>, <a href="/en/locks/gomez-bedside-chest/">Gomez\'s bedroom</a>, and <a href="/en/locks/arto-room-door/">Arto\'s room</a>. This is the first door on that floor.',
      inside: 'Access to an unknown bedroom - chests by the near and far beds.',
      faq: `<details><summary>Isn't this Voran's or Arto's room?</summary><p>No. Voran is on the right, Arto on the left - they have their own doors. This is a different door on the same bedrooms floor.</p></details><details><summary>How many moves?</summary><p>45 moves (6 plates, 10 links).</p></details>`,
    },
  },
  'gomez-bedrooms-far-chest': {
    code: 'RzbBFITEQQ',
    ru: {
      lead: 'Сундук в ногах у дальней кровати в спальне на этаже спален покоев. 39 ходов; кольцо рудной кожи, экстракты жизни и запас вина с пивом.',
      where: 'Спальня за <a href="/locks/gomez-bedrooms-door/">первой дверью на этаже спален</a>. Сундук у дальней кровати - не путать с <a href="/locks/gomez-bedrooms-near-chest/">ближним сундуком</a>.',
      inside: 'Кольцо рудной кожи, 3 экстракта жизни, 5 вина, 7 пива.',
      faq: `<details><summary>Где ближний сундук?</summary><p>У ближней кровати - <a href="/locks/gomez-bedrooms-near-chest/">другой замок</a> (кольцо великой жизненной силы, 56 ходов).</p></details><details><summary>Как попасть в комнату?</summary><p>Через <a href="/locks/gomez-bedrooms-door/">дверь на этаже спален</a> из покоев Гомеза.</p></details><details><summary>Сколько ходов?</summary><p>39 ходов (5 плиток, 10 связей). Первая плитка уже в центре.</p></details>`,
    },
    en: {
      lead: "Chest at the foot of the far bed in the bedroom on Gomez's bedrooms floor. 39 moves; ore skin ring, life extracts, wine and beer.",
      where: 'Bedroom beyond the <a href="/en/locks/gomez-bedrooms-door/">first door on the bedrooms floor</a>. Chest at the far bed - not the <a href="/en/locks/gomez-bedrooms-near-chest/">near chest</a>.',
      inside: 'Ore skin ring, 3 life extracts, 5 wine, 7 beer.',
      faq: `<details><summary>Where is the near bed chest?</summary><p>At the near bed - <a href="/en/locks/gomez-bedrooms-near-chest/">a different lock</a> (ring of great vitality, 56 moves).</p></details><details><summary>How do I reach the room?</summary><p>Through the <a href="/en/locks/gomez-bedrooms-door/">door on the bedrooms floor</a> in Gomez\'s chambers.</p></details><details><summary>How many moves?</summary><p>39 moves (5 plates, 10 links). Plate 1 is already centred.</p></details>`,
    },
  },
  'gomez-bedrooms-near-chest': {
    code: 'ZVbYAEKEBgECAA',
    ru: {
      lead: 'Сундук у ближней кровати в спальне на этаже спален покоев. 56 ходов - длинный замок; кольцо великой жизненной силы и экстракты.',
      where: 'Спальня за <a href="/locks/gomez-bedrooms-door/">дверью на этаже спален</a>. Сундук у ближней кровати (ближе к двери). Дальний - <a href="/locks/gomez-bedrooms-far-chest/">у другой кровати</a>.',
      inside: 'Кольцо великой жизненной силы, экстракт жизни, целебный экстракт, столовые приборы.',
      faq: `<details><summary>Почему 56 ходов?</summary><p>Длинный 6-плиточный замок на этаже спален. Решатель показывает путь по шагам.</p></details><details><summary>Где дальний сундук?</summary><p>У дальней кровати - <a href="/locks/gomez-bedrooms-far-chest/">сундук с кольцом рудной кожи</a> (39 ходов).</p></details><details><summary>Сколько ходов?</summary><p>56 ходов (6 плиток, 8 связей).</p></details>`,
    },
    en: {
      lead: "Chest at the near bed in the bedroom on Gomez's bedrooms floor. 56 moves - a long lock; ring of great vitality and extracts.",
      where: 'Bedroom beyond the <a href="/en/locks/gomez-bedrooms-door/">door on the bedrooms floor</a>. Chest at the near bed (closer to the door). Far bed - <a href="/en/locks/gomez-bedrooms-far-chest/">other chest</a>.',
      inside: 'Ring of great vitality, life extract, healing extract, cutlery.',
      faq: `<details><summary>Why 56 moves?</summary><p>A long 6-plate lock on the bedrooms floor. The solver shows each step.</p></details><details><summary>Where is the far bed chest?</summary><p>At the far bed - <a href="/en/locks/gomez-bedrooms-far-chest/">ore skin ring chest</a> (39 moves).</p></details><details><summary>How many moves?</summary><p>56 moves (6 plates, 8 links).</p></details>`,
    },
  },
  'raven-tower-left-chest': {
    code: 'bVyMKQAAGQAAWA',
    ru: {
      lead: 'Первый сундук слева на первом этаже башни Ворона. На этаже всего 9 сундуков - в каталоге пока этот и правый у входа. 35 ходов, внутри монеты и руда.',
      where: 'Первый этаж башни Ворона в замке Старого лагеря. Ключ из сундука у кровати Ворона открывает дверь в ногах босса - за ней комната с девятью сундуками. Этот стоит слева у входа (рядом справа - второй известный).',
      inside: '6 кубков, 10 столовых приборов, 29 руды, 2500 монет.',
      faq: `<details><summary>Сколько сундуков на этаже?</summary><p>Девять на 1-м этаже — в каталоге два у входа. Выше: <a href="/locks/raven-tower-floor2-stairs-chest/">2-й</a>, <a href="/locks/raven-tower-floor3-entrance-chest/">3-й</a>, <a href="/locks/raven-tower-floor4-elixirs-chest/">4-й</a> этажи и <a href="/locks/raven-tower-top-chest/">вершина</a>.</p></details><details><summary>Нужно ли взламывать дверь в башню?</summary><p>Нет. Ключ от башни лежит в <a href="/locks/voran-bedside-chest/">сундуке у кровати Ворона</a>.</p></details><details><summary>Сколько ходов?</summary><p>35 ходов (6 плиток, 9 связей).</p></details>`,
    },
    en: {
      lead: 'The first chest on the left on Raven Tower\'s first floor. Nine chests on that floor - the catalog has this one and the right chest by the entrance so far. 35 moves, coins and ore inside.',
      where: 'Raven Tower\'s first floor in the Old Camp castle. The key from Voran\'s bedside chest opens the door at his feet - beyond it, a room with nine chests. This one is on the left by the entrance.',
      inside: '6 goblets, 10 cutlery, 29 ore, 2500 coins.',
      faq: `<details><summary>How many chests on this floor?</summary><p>Nine. The catalog has two by the entrance so far - this left one and the <a href="/en/locks/raven-tower-right-chest/">right chest</a>. We'll add the other seven as codes come in.</p></details><details><summary>Do I need to pick the tower door?</summary><p>No. The tower key is in <a href="/en/locks/voran-bedside-chest/">Voran's bedside chest</a>.</p></details><details><summary>How many moves?</summary><p>35 moves (6 plates, 9 links).</p></details>`,
    },
  },
  'raven-tower-right-chest': {
    code: 'bEhYigAEVCQEAA',
    ru: {
      lead: 'Сундук справа у входа на первом этаже башни Ворона. На этаже девять сундуков всего - в каталоге пока этот и левый. 23 хода, внутри оружие.',
      where: 'Первый этаж башни Ворона - та же комната, что и левый сундук у входа. Всего на этаже 9 сундуков; этот стоит справа от двери.',
      inside: '3 иззубренных топора (13 урона рассечением, 9 силы), 2 ржавых меча (10 урона рассечением, 5 силы).',
      faq: `<details><summary>Сколько сундуков на этаже?</summary><p>Девять на 1-м этаже — в каталоге два у входа. Выше: <a href="/locks/raven-tower-floor2-stairs-chest/">2-й</a>–<a href="/locks/raven-tower-top-chest/">вершина</a>.</p></details><details><summary>Сколько ходов?</summary><p>23 хода (6 плиток, 10 связей).</p></details>`,
    },
    en: {
      lead: 'The chest on the right by the entrance on Raven Tower\'s first floor. Nine chests on that floor total - the catalog has this one and the left chest so far. 23 moves, weapons inside.',
      where: 'Raven Tower\'s first floor - same room as the left chest by the entrance. Nine chests on this floor; this one is on the right of the door.',
      inside: '3 serrated axes (13 slash damage, 9 Strength), 2 rusty swords (10 slash damage, 5 Strength).',
      faq: `<details><summary>How many chests on this floor?</summary><p>Nine. The catalog has two by the entrance so far - the <a href="/en/locks/raven-tower-left-chest/">left chest</a> and this one. The other seven as codes come in.</p></details><details><summary>How many moves?</summary><p>23 moves (6 plates, 10 links).</p></details>`,
    },
  },
  'raven-tower-floor2-stairs-chest': {
    code: 'YqahUKAAACIIAA',
    ru: {
      lead: 'Первый сундук на 2-м этаже башни Ворона - сразу после подъёма с 1-го. 48 ходов; внутри запас алкоголя.',
      where: 'Башня Ворона, 2-й этаж. Поднимаетесь с 1-го этажа по лестнице - сундук у лестничного проёма.',
      inside: '12 вина, 8 крепкого вина, 26 пива.',
      faq: `<details><summary>Где следующий сундук?</summary><p>На том же этаже - <a href="/locks/raven-tower-floor2-chest-2/">второй сундук</a>.</p></details><details><summary>Сколько ходов?</summary><p>48 ходов (6 плиток, 8 связей).</p></details>`,
    },
    en: {
      lead: 'First chest on Raven Tower floor 2 - right after climbing from floor 1. 48 moves; alcohol stash inside.',
      where: 'Raven Tower, 2nd floor. Climb from floor 1 - chest at the stairwell.',
      inside: '12 wine, 8 strong wine, 26 beer.',
      faq: `<details><summary>Where is the next chest?</summary><p>Same floor - <a href="/en/locks/raven-tower-floor2-chest-2/">second chest</a>.</p></details><details><summary>How many moves?</summary><p>48 moves (6 plates, 8 links).</p></details>`,
    },
  },
  'raven-tower-floor2-chest-2': {
    code: 'Q6XCAhAglI',
    ru: {
      lead: 'Второй сундук на 2-м этаже башни Ворона. 27 ходов; 8897 монет и приборы.',
      where: 'Башня Ворона, 2-й этаж - после сундука у лестницы.',
      inside: '12 столовых приборов и 8897 монет.',
      faq: `<details><summary>Сколько ходов?</summary><p>27 ходов (5 плиток, 8 связей).</p></details>`,
    },
    en: {
      lead: 'Second chest on Raven Tower floor 2. 27 moves; 8897 coins and cutlery.',
      where: 'Raven Tower, 2nd floor - after the chest by the stairs.',
      inside: '12 cutlery and 8897 coins.',
      faq: `<details><summary>How many moves?</summary><p>27 moves (5 plates, 8 links).</p></details>`,
    },
  },
  'raven-tower-floor3-entrance-chest': {
    code: 'QmzSSoBAAg',
    ru: {
      lead: 'Сундук прямо перед вами на 3-м этаже башни Ворона. 44 хода; трофеи и приборы.',
      where: 'Башня Ворона, 3-й этаж - сразу после лестницы с 2-го.',
      inside: '11 волчьих когтей, 8 зубов, 13 столовых приборов.',
      faq: `<details><summary>Ещё сундуки на этаже?</summary><p>Да - <a href="/locks/raven-tower-floor3-empty-chest/">пустой сундук</a> рядом.</p></details><details><summary>Сколько ходов?</summary><p>44 хода (5 плиток, 8 связей).</p></details>`,
    },
    en: {
      lead: 'Chest right in front of you on Raven Tower floor 3. 44 moves; trophies and cutlery.',
      where: 'Raven Tower, 3rd floor - right after the stairs from floor 2.',
      inside: '11 wolf claws, 8 teeth, 13 cutlery.',
      faq: `<details><summary>More chests on this floor?</summary><p>Yes - the <a href="/en/locks/raven-tower-floor3-empty-chest/">empty chest</a> nearby.</p></details><details><summary>How many moves?</summary><p>44 moves (5 plates, 8 links).</p></details>`,
    },
  },
  'raven-tower-floor3-empty-chest': {
    code: 'RYIBEylAIA',
    ru: {
      lead: 'Следующий сундук на 3-м этаже - пустой. 37 ходов.',
      where: 'Башня Ворона, 3-й этаж - после сундука у входа.',
      inside: 'Пусто.',
      faq: `<details><summary>Сколько ходов?</summary><p>37 ходов (5 плиток, 9 связей).</p></details>`,
    },
    en: {
      lead: 'Next chest on floor 3 - empty. 37 moves.',
      where: 'Raven Tower, 3rd floor - after the entrance chest.',
      inside: 'Empty.',
      faq: `<details><summary>How many moves?</summary><p>37 moves (5 plates, 9 links).</p></details>`,
    },
  },
  'raven-tower-floor4-elixirs-chest': {
    code: 'h24ZgUAAEAQgAwAKQAA',
    ru: {
      lead: 'Сундук с эликсирами на 4-м этаже за лестницей. 7 плиток, 36 ходов.',
      where: 'Башня Ворона, 4-й этаж. Слева - <a href="/locks/raven-tower-floor4-food-chest/">сундук с едой</a>.',
      inside: '3 эликсира магической энергии, 2 целебных эликсира, 2 экстракта магической энергии, целебный экстракт.',
      faq: `<details><summary>Почему 7 плиток?</summary><p>Второй 7-плиточный замок башни после <a href="/locks/voran-bedside-chest/">сундука Ворона</a>.</p></details><details><summary>Сколько ходов?</summary><p>36 ходов (7 плиток, 10 связей).</p></details>`,
    },
    en: {
      lead: 'Elixir chest on floor 4 past the stairs. 7 plates, 36 moves.',
      where: 'Raven Tower, 4th floor. Left of it - the <a href="/en/locks/raven-tower-floor4-food-chest/">food chest</a>.',
      inside: '3 magic energy elixirs, 2 healing elixirs, 2 magic energy extracts, healing extract.',
      faq: `<details><summary>Why 7 plates?</summary><p>The tower\'s second 7-plate lock after <a href="/en/locks/voran-bedside-chest/">Voran\'s chest</a>.</p></details><details><summary>How many moves?</summary><p>36 moves (7 plates, 10 links).</p></details>`,
    },
  },
  'raven-tower-floor4-food-chest': {
    code: 'aYqYiAQgCACABA',
    ru: {
      lead: 'Сундук с едой на 4-м этаже, слева от эликсиров. 43 хода.',
      where: 'Башня Ворона, 4-й этаж - слева от <a href="/locks/raven-tower-floor4-elixirs-chest/">сундука с эликсирами</a>.',
      inside: '6 вина, 11 пива, 6 окороков, 9 жареного мяса.',
      faq: `<details><summary>Сколько ходов?</summary><p>43 хода (6 плиток, 7 связей).</p></details>`,
    },
    en: {
      lead: 'Food chest on floor 4, left of the elixirs. 43 moves.',
      where: 'Raven Tower, 4th floor - left of the <a href="/en/locks/raven-tower-floor4-elixirs-chest/">elixir chest</a>.',
      inside: '6 wine, 11 beer, 6 hams, 9 roasted meat.',
      faq: `<details><summary>How many moves?</summary><p>43 moves (6 plates, 7 links).</p></details>`,
    },
  },
  'raven-tower-top-chest': {
    code: 'aMCmkAAGBBYAAA',
    ru: {
      lead: 'Единственный сундук на вершине башни Ворона. 48 ходов; кольцо ловкости.',
      where: 'Вершина башни Ворона - подъём через все этажи от ключа Ворона.',
      inside: 'Кольцо ловкости, 4 зова сна, 8 велайис.',
      faq: `<details><summary>Сколько ходов?</summary><p>48 ходов (6 плиток, 9 связей).</p></details>`,
    },
    en: {
      lead: 'The only chest at the top of Raven Tower. 48 moves; agility ring.',
      where: 'Summit of Raven Tower - climb from Voran\'s key through all floors.',
      inside: 'Agility ring, 4 sleep calls, 8 velaiis.',
      faq: `<details><summary>How many moves?</summary><p>48 moves (6 plates, 9 links).</p></details>`,
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
