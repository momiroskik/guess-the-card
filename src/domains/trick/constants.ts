import { ROUNDS } from './model/ternary';

export const STEPPER = ['Start', 'Memorise', 'Number', 'Rows', 'Reveal'] as const;

export const SHUFFLE_MS = 1900;

export const COLLECT_MS = 300;

export const MIND_READING_MS = 10_000;

export const MIND_READING_SCRIPT = [
  { at: 0, text: 'Clearing my mind…', sub: 'Give me a moment. Keep the card in view.' },
  { at: 1700, text: 'Entering your brain…', sub: 'Mind the mess. This will only sting a little.' },
  { at: 3500, text: 'Twenty-seven possibilities…', sub: 'Cutting them down by a third at a time.' },
  { at: 5400, text: 'Hmm. This one is hidden well…', sub: 'You are better at this than most.' },
  { at: 7300, text: 'Following the trail you left…', sub: 'Three answers. That is all you gave me.' },
  { at: 9100, text: 'There it is.', sub: 'Hold still — I am pulling it out.' },
] as const;

export const ROUND_PROMPTS: readonly string[] = [
  'Which row is your card in?',
  'I dealt again. Which row now?',
  'Last deal. Which row?',
];

export const ROUND_HINTS: readonly string[] = [
  'Scan the rows, then press the button beside the one holding your card.',
  'It moved when I gathered the rows. Find it again.',
  'One more answer and I have you.',
];

export const PILE_NAMES = ['Row 1', 'Row 2', 'Row 3'] as const;

export { ROUNDS };
