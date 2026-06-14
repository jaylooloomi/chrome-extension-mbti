import type { MBTIResult } from '../utils/providers';

/**
 * Sample result for previewing the UI during development only.
 * Loaded lazily behind `import.meta.env.DEV` so it is never shipped.
 */
export const demoResult: MBTIResult = {
  mbti: 'INTJ',
  title: 'The 3 A.M. Rabbit-Holer',
  description:
    'Your bookmarks read like a blueprint: dense clusters of long-form essays, systems-design references, and a handful of carefully chosen tools you will absolutely "read later". You collect knowledge the way an engineer collects load-bearing beams — nothing decorative, everything structural.',
  traits: ['chronically curious', 'tab hoarder', 'deep-diver'],
  food: ['ramen', 'pour-over coffee', 'meal-prep', 'dark chocolate', 'sourdough', 'sushi', 'matcha'],
  clothing: ['minimal', 'monochrome', 'merino', 'techwear', 'capsule', 'matte black', 'quiet luxury'],
  housing: ['studio', 'standing desk', 'cable-free', 'plants', 'warm light', 'bookshelf', 'mechanical keyboard'],
  travel: ['Japan', 'slow travel', 'trains', 'museums', 'hiking', 'off-season', 'solo'],
  education: ['MOOCs', 'papers', 'documentation', 'note-taking', 'first principles', 'lectures', 'open source'],
  entertainment: ['sci-fi', 'strategy games', 'podcasts', 'synthwave', 'long reads', 'chess', 'documentaries'],
  money: ['index funds', 'frugal', 'automation', 'long-term', 'spreadsheets', 'minimal subscriptions', 'FIRE'],
  sex: ['emotional depth', 'trust', 'slow-burn', 'communication', 'loyalty', 'privacy', 'intellectual spark'],
  pornstar: ['—'],
  foodpercent: '62',
  clothingpercent: '48',
  housingpercent: '71',
  travelpercent: '55',
  educationpercent: '88',
  entertainmentpercent: '67',
  moneypercent: '74',
  sexpercent: '41',
  pornstarpercent: '12',
  yourself:
    'You are a long-game thinker who values competence and autonomy. You would rather build the right thing slowly than ship the wrong thing fast.',
  couple:
    'You match best with someone who respects your need for depth and space, communicates directly, and brings warmth to balance your analytical edge.',
};
