export interface Chamber {
  id: number;
  story: string[];
  question: string;
  choices: { label: string; answer: 'correct' | 'wrong' }[];
  correct: string;
  wrong: string;
}

export const chambers: Chamber[] = [
  {
    id: 1,
    story: [
      'The royal baker swore nobody entered the kitchen overnight.',
      'At dawn, the oven was still warm.',
      'Snow covered the courtyard outside every door and window.',
      "The guard captain's boots were completely dry.",
    ],
    question: 'WHICH DETAIL PROVES SOMEONE IS LYING?',
    choices: [
      { label: 'THE OVEN',   answer: 'wrong'   },
      { label: 'THE BOOTS',  answer: 'correct' },
      { label: 'THE SNOW',   answer: 'wrong'   },
      { label: 'THE WINDOW', answer: 'wrong'   },
    ],
    correct:
      'If nobody entered the kitchen, the guard captain could not have inspected the room. Yet his boots are completely dry despite snow covering every entrance. Someone entered the castle — and lied about it.',
    wrong:
      'The contradiction is physical evidence. The snow means anyone entering would track in moisture. The dry boots expose the lie.',
  },
  {
    id: 2,
    story: [
      'The head librarian swore the reading room had been sealed since noon.',
      'Every candle inside had burned completely down to the holder.',
      "The room's single window was nailed shut from within.",
      'The fireplace ashes were still warm to the touch.',
    ],
    question: 'WHICH DETAIL PROVES SOMEONE ENTERED AFTER NOON?',
    choices: [
      { label: 'THE CANDLES',  answer: 'wrong'   },
      { label: 'THE ASHES',    answer: 'correct' },
      { label: 'THE WINDOW',   answer: 'wrong'   },
      { label: 'THE LOCK',     answer: 'wrong'   },
    ],
    correct:
      'Fireplace ashes retain heat for only a few hours. If the room had truly been sealed since noon, the ashes would be stone cold by evening. Someone lit the fire — and recently.',
    wrong:
      'The ash temperature is the key. Fresh warmth in old ashes means someone used the fireplace long after noon.',
  },
  {
    id: 3,
    story: [
      'The sentry swore he had stood watch at the gate all night without moving.',
      'His torch had burned for exactly twelve hours, he claimed.',
      'The torch was three-quarters full of oil.',
      'The gate log showed no entries or exits.',
    ],
    question: 'WHICH DETAIL PROVES THE SENTRY IS LYING?',
    choices: [
      { label: 'THE LOG',    answer: 'wrong'   },
      { label: 'THE GATE',   answer: 'wrong'   },
      { label: 'THE TORCH',  answer: 'wrong'   },
      { label: 'THE OIL',    answer: 'correct' },
    ],
    correct:
      'A torch burning for twelve hours would exhaust its oil completely. Three-quarters full means the torch was lit only recently — not at the start of the watch. The sentry abandoned his post.',
    wrong:
      'The oil level is the record. A full night of flame leaves an empty reservoir, not a nearly full one.',
  },
  {
    id: 4,
    story: [
      'The courier claimed to have ridden through the forest at midnight.',
      'She described the path in vivid detail — every bend and fallen oak.',
      'Midnight had brought total cloud cover, blocking all moon and starlight.',
      'She had left her lantern at the inn.',
    ],
    question: 'WHICH DETAIL PROVES SHE COULD NOT HAVE SEEN THE PATH?',
    choices: [
      { label: 'THE PATH',    answer: 'wrong'   },
      { label: 'THE CLOUDS',  answer: 'wrong'   },
      { label: 'THE LANTERN', answer: 'correct' },
      { label: 'THE FOREST',  answer: 'wrong'   },
    ],
    correct:
      'With total cloud cover and no lantern, the forest would have been completely dark. She could not have seen the path she described in vivid detail. The ride did not happen as she claims.',
    wrong:
      'No light source, no moon, no stars — she could not have seen anything. A path memorised in darkness cannot be described.',
  },
  {
    id: 5,
    story: [
      "The wine steward claimed the cup had not been touched since he placed it on the table an hour ago.",
      'The great hall had been heated to a roar all evening.',
      'The wine inside was still ice cold.',
      'Ice was delivered to the manor only at dawn.',
    ],
    question: 'WHICH DETAIL PROVES SOMEONE HANDLED THE CUP?',
    choices: [
      { label: 'THE HALL',  answer: 'wrong'   },
      { label: 'THE DAWN',  answer: 'wrong'   },
      { label: 'THE WINE',  answer: 'correct' },
      { label: 'THE TABLE', answer: 'wrong'   },
    ],
    correct:
      'Wine left in a heated hall for an hour warms rapidly. Ice-cold wine after an hour of roaring fire means the cup was recently refilled or tampered with. Someone touched it.',
    wrong:
      'Heat and cold do not coexist without explanation. Cold wine in a hot room after an hour means the cup was not left untouched.',
  },
  {
    id: 6,
    story: [
      'The clockmaker swore he had been in his workshop since the cathedral bells rang nine.',
      'The clock on his own workbench read half past seven.',
      'Every clock in the shop showed a different time.',
      'He claimed to have wound them all that morning.',
    ],
    question: 'WHICH DETAIL EXPOSES THE CLOCKMAKER?',
    choices: [
      { label: 'THE BELLS',       answer: 'wrong'   },
      { label: 'THE BENCH CLOCK', answer: 'correct' },
      { label: 'THE WOUND CLOCKS',answer: 'wrong'   },
      { label: 'THE WORKSHOP',    answer: 'wrong'   },
    ],
    correct:
      'A clockmaker present since nine would immediately notice — and correct — the bench clock showing the wrong time. Its reading of half past seven proves he was not in the workshop at nine.',
    wrong:
      'A clockmaker who cannot keep his own bench clock accurate was not there to notice. The wrong time on his own clock places him elsewhere at nine.',
  },
  {
    id: 7,
    story: [
      'The trapper claimed he had crossed the frozen lake alone at dawn.',
      'Fresh snow had fallen overnight and stopped before sunrise.',
      'His boots left no marks in the snow on the far bank.',
      'He carried no brush to sweep tracks.',
    ],
    question: 'WHICH DETAIL PROVES HE DID NOT CROSS?',
    choices: [
      { label: 'THE SNOW',    answer: 'wrong'   },
      { label: 'THE BOOTS',   answer: 'correct' },
      { label: 'THE TRAPPER', answer: 'wrong'   },
      { label: 'THE DAWN',    answer: 'wrong'   },
    ],
    correct:
      'Fresh snow that stopped before sunrise would have preserved every footprint perfectly. A man crossing the far bank leaves tracks. No marks means no crossing — and no way to erase them without a tool he did not carry.',
    wrong:
      'Fresh undisturbed snow is a perfect record. No tracks on the far side means no arrival on the far side.',
  },
  {
    id: 8,
    story: [
      'The countess claimed she had never met the artist who painted her portrait.',
      'She described his techniques as entirely unfamiliar.',
      'She knew without prompting that he mixed his paint with walnut oil, not linseed.',
      'Most painters use linseed oil by default.',
    ],
    question: 'WHICH DETAIL PROVES SHE KNEW THE ARTIST?',
    choices: [
      { label: 'THE PORTRAIT',   answer: 'wrong'   },
      { label: 'THE TECHNIQUES', answer: 'wrong'   },
      { label: 'THE OIL',        answer: 'correct' },
      { label: 'THE LINSEED',    answer: 'wrong'   },
    ],
    correct:
      "Walnut oil versus linseed oil is invisible in a finished painting. Only someone who had watched the artist work — or been told by him directly — would know his specific medium. She knew because he told her.",
    wrong:
      "A painting's surface reveals colour and form, not the oil mixed into the paint. That detail could only come from the artist himself.",
  },
  {
    id: 9,
    story: [
      'The fisherman claimed he had been out on the lake fishing since before the fog rolled in at dusk.',
      'The fog had been so thick he could not see the shore.',
      'He returned with a full catch of lake perch.',
      'Lake perch feed only in clear water and retreat to the depths during fog.',
    ],
    question: 'WHICH DETAIL PROVES HE DID NOT CATCH THE FISH ON THE LAKE?',
    choices: [
      { label: 'THE FOG',   answer: 'wrong'   },
      { label: 'THE SHORE', answer: 'wrong'   },
      { label: 'THE CATCH', answer: 'correct' },
      { label: 'THE DUSK',  answer: 'wrong'   },
    ],
    correct:
      'Lake perch stop feeding during fog and cannot be caught at the surface. A full catch of perch from a fog-covered lake is impossible. The fish came from somewhere else.',
    wrong:
      'Perch retreat in fog and do not bite. His catch exposes the fog story as false.',
  },
  {
    id: 10,
    story: [
      'The lighthouse keeper claimed the beam had swept continuously all night without interruption.',
      'Two ships independently reported the light going dark for nearly an hour around midnight.',
      "The keeper's log showed uninterrupted operation.",
      "The lamp's oil reservoir held one hour less than a full night's worth would consume.",
    ],
    question: 'WHICH DETAIL PROVES THE LIGHT WAS EXTINGUISHED?',
    choices: [
      { label: 'THE LOG',    answer: 'wrong'   },
      { label: 'THE SHIPS',  answer: 'wrong'   },
      { label: 'THE LAMP',   answer: 'wrong'   },
      { label: 'THE OIL',    answer: 'correct' },
    ],
    correct:
      'Oil burns at a fixed, measurable rate. One hour short of a full night means the lamp was dark for exactly that period. The log was falsified — the oil cannot be.',
    wrong:
      'Ships can be mistaken; logs can be forged. But oil consumption is a physical constant. The shortfall is proof.',
  },
  {
    id: 11,
    story: [
      'The sculptor claimed he had been working marble all day in his studio.',
      'Marble carving produces a fine white dust that settles on every surface within ten feet.',
      'His tools were dusty. His work clothes were dusty.',
      'His hair was completely clean.',
    ],
    question: 'WHICH DETAIL PROVES HE LEFT THE STUDIO?',
    choices: [
      { label: 'THE TOOLS',   answer: 'wrong'   },
      { label: 'THE CLOTHES', answer: 'wrong'   },
      { label: 'THE HAIR',    answer: 'correct' },
      { label: 'THE MARBLE',  answer: 'wrong'   },
    ],
    correct:
      'Marble dust settles on every surface — including hair. A full day of carving in a dust-filled studio cannot leave hair clean. He left, washed, and returned.',
    wrong:
      'Marble dust does not selectively avoid hair. Clean hair in a dusty studio proves an absence long enough to wash.',
  },
];

export function getDailyChamber(): Chamber {
  const now = new Date();
  const epoch = new Date(2026, 0, 1);
  const daysSinceEpoch = Math.floor(
    (now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)
  );
  return chambers[daysSinceEpoch % chambers.length];
}
