import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const bannedWords = ['echo', 'emotion', 'thought', 'concept', 'idea', 'soul', 'memory'];

const isTooAbstract = (prompt: string) => {
  return bannedWords.some(word => prompt.toLowerCase().includes(word));
};

const fallbackCharacters = [
  'solitary astronaut',
  'cyborg geologist',
  'child in a paper crown',
  'elderly apothecary',
  'retired pirate',
  'urban explorer',
  'novice witch',
  'robot gardener',
  'eccentric inventor',
  'time-traveling librarian',
  'time-traveling archaeologist',
  'robotic beekeeper',
  'octopus magician',
  'alien cartographer',
  'wandering monk',
  'vampire seamstress',
  'fossilized child',
  'mechanical knight',
  'desert nomad',
  'garden ghost',
  'mirror polisher',
  'storm chaser',
  'troll florist',
  'shadow puppeteer',
  'foggy hunter',
  'umbrella mechanic',
  'soap bubble scientist',
  'green goblin',
  'cloud shepherd',
  'neon beekeeper',
  'glowing oracle',
  'broom technician',
  'radioactive hermit',
  'tree whisperer',
  'robotic stargazer',
  'glowing child',
  'crystal warrior',
  'mossy traveler',
  'ice explorer',
  'fire dancer',
  'marble giant',
  'fog phantom',
  'neon child',
  'silver knight',
  'hollow-eyed priest',
  'owl-masked stranger',
  'desert oracle',
  'swamp goblin',
  'mirror twin',
  'ink-covered hunter'
];

const fallbackActions = [
  'planting luminous seeds', 'adjusting sails', 'repairing a torn flag', 'mapping uncharted islands',
  'mixing potions', 'photographing ruins', 'deciphering ancient runes', 'skipping stones',
  'tending mechanical bees', 'creating a mural', 'brewing tea', 'carving ice sculptures',
  'testing a jetpack', 'performing tricks', 'building a strange contraption', 'scanning alien fossils',
  'conducting lightning', 'chasing glowing insects', 'harnessing moonlight', 'casting shadows on a wall',
  'examining a glowing crystal', 'watering upside-down plants', 'painting with lasers', 'sifting through stardust',
  'programming a robot', 'translating runes', 'calibrating instruments', 'folding enchanted paper',
  'measuring echoes', 'building a bridge of vines', 'collecting floating stones', 'sculpting light',
  'repairing torn maps', 'etching symbols into stone', 'testing anti-gravity boots', 'tuning a musical windmill',
  'juggling glowing orbs', 'unpacking strange cargo', 'casting bubbles into the air', 'feeding robotic birds',
  'balancing on a tightrope', 'throwing fire petals', 'spinning gold thread', 'lighting ceremonial candles',
  'assembling a puzzle sphere', 'polishing a glowing amulet', 'illuminating constellations', 'welding magical armor',
  'catching lightning in jars', 'whistling to summon wind'
];

const fallbackLocations = [
  'in a candle-lit laboratory', 'on a desert ghost ship', 'in a cyberpunk alleyway', 'in a sunken temple',
  'in a lush greenhouse', 'on a foggy mountain peak', 'at the rim of a glowing crater', 'in a floating garden',
  'in an abandoned amusement park', 'in a futuristic greenhouse', 'on the surface of Mars', 'on a glass bridge at dawn',
  'in a neon jungle', 'on the roof of a Victorian mansion', 'in a crystal cave', 'on the side of a rusted space shuttle',
  'in a forest glade', 'in the ruins of an ancient castle', 'on the deck of an ancient galleon', 'in a dreamlike desert',
  'in a bioluminescent swamp', 'in a haunted train station', 'in a vibrant underwater reef', 'in a city suspended in air',
  'in an alien jungle', 'in a steam-powered city', 'in a glowing moonbase', 'in a snow-covered plaza',
  'in a volcanic observatory', 'inside a giant clock', 'in a glowing coral forest', 'in a cave of frozen time',
  'in a marketplace at twilight', 'in a mountaintop observatory', 'in a field of glass flowers',
  'in a dome beneath the sea', 'in a crater under a purple sky', 'in a mirrored canyon', 'on a river of stars',
  'behind a hidden waterfall', 'in a shipwreck lit by fireflies', 'in an ancient sculpture garden',
  'in a stilted bamboo village', 'on a monorail high above clouds', 'in a bioluminescent cave',
  'in a marketplace built into cliffs', 'in a toxic jungle lit by sparks', 'in a hanging stone monastery',
  'in a twisted metal scrapyard', 'among floating rocks in a valley'
];

const cache = new Set<string>();

function sanitize(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function getUniquePrompt(): string {
  for (let i = 0; i < 10; i++) {
    const character = fallbackCharacters[Math.floor(Math.random() * fallbackCharacters.length)];
    const action = fallbackActions[Math.floor(Math.random() * fallbackActions.length)];
    const location = fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
    const prompt = `A ${character} is ${action} ${location}.`;
    const key = sanitize(prompt);
    if (!cache.has(key)) {
      cache.add(key);
      if (!isTooAbstract(prompt)) return prompt;
    }
  }
  const character = fallbackCharacters[Math.floor(Math.random() * fallbackCharacters.length)];
  const action = fallbackActions[Math.floor(Math.random() * fallbackActions.length)];
  const location = fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
  return `A ${character} is ${action} ${location}.`;
}

export async function generateArtPrompt(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'Generate a unique, singular character (2–6 words) that is visually drawable and concrete. The character must be a single individual (not a group or team). Avoid collective nouns. Use clear and familiar language, no vague or abstract pairings. Then, combine it with a concrete, visually clear action, and a vivid location. Result must be under 25 words. Output a single sentence in this format: "A [character] is [action] in [location]."',
          },
          {
            role: 'user',
            content: 'Generate a new character, action, and location prompt.',
          },
        ],
        model: 'gpt-4',
        temperature: 1,
      });

      const response = completion.choices[0]?.message?.content ?? '';
      const cleaned = sanitize(response);

      if (!cache.has(cleaned) && !isTooAbstract(response)) {
        cache.add(cleaned);
        return response;
      }

      console.warn('Duplicate or abstract prompt received. Retrying...');
    } catch (err) {
      console.error('AI generation failed, falling back:', err);
    }
  }

  console.warn('Falling back to local prompt after multiple retries.');
  return getUniquePrompt();
}

export async function generateCharacter(): Promise<string> {
  return fallbackCharacters[Math.floor(Math.random() * fallbackCharacters.length)];
}

export async function generateAction(): Promise<string> {
  return fallbackActions[Math.floor(Math.random() * fallbackActions.length)];
}

export async function generateLocation(): Promise<string> {
  return fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
}

export async function generateImage(prompt: string): Promise<string | null> {
  const styledPrompt = `${prompt}, in a flat vector cartoon style, clean outlines, vibrant color palette, detailed background, centered composition`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: styledPrompt,
      n: 1,
      size: '512x512',
    });

    return response.data[0]?.url ?? null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}