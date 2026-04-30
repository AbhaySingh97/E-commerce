const CATEGORY_VISUALS = {
  electronics: {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=85&w=900',
    description: 'Devices, tools, and connected upgrades built for modern daily use.'
  },
  fashion: {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=85&w=900',
    description: 'Tailored edits, statement pieces, and wardrobe essentials with a premium finish.'
  },
  'home-garden': {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=85&w=900',
    description: 'Furniture, decor, and practical pieces that sharpen the feel of a space.'
  },
  'home-decor': {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=85&w=900',
    description: 'Furniture, decor, and practical pieces that sharpen the feel of a space.'
  },
  sports: {
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=85&w=900',
    description: 'Performance gear and active essentials for training, movement, and recovery.'
  },
  'sports-outdoors': {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=85&w=900',
    description: 'Performance gear and active essentials for training, movement, and recovery.'
  },
  smartphones: {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=85&w=900',
    description: 'Flagship phones and mobile essentials selected for speed, camera, and design.'
  },
  laptops: {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=85&w=900',
    description: 'Portable performance machines for work, creation, and entertainment.'
  },
  audio: {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=85&w=900',
    description: 'Headphones, speakers, and listening gear engineered for richer sound.'
  },
  shoes: {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=85&w=900',
    description: 'Statement footwear spanning everyday comfort, premium form, and athletic edge.'
  },
  bags: {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=85&w=900',
    description: 'Carry pieces designed for polish, storage, and everyday durability.'
  },
  wearables: {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=85&w=900',
    description: 'Smart watches and connected accessories that keep performance close at hand.'
  },
  kitchen: {
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=85&w=900',
    description: 'Cookware and countertop tools chosen to make the kitchen work harder and look better.'
  },
  beauty: {
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=85&w=900',
    description: 'Skincare, fragrance, and beauty staples curated around quality formulas.'
  },
  lighting: {
    image: 'https://images.unsplash.com/photo-1534073828943-f43b351717b3?auto=format&fit=crop&q=85&w=900',
    description: 'Lamps and lighting accents that define mood, warmth, and visual balance.'
  },
  cameras: {
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=900',
    description: 'Imaging gear for creators who need dependable detail and control.'
  },
  accessories: {
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=85&w=900',
    description: 'Refined add-ons that complete daily carry, style, and utility.'
  },
  eyewear: {
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=85&w=900',
    description: 'Frames and sunglasses that balance comfort, protection, and character.'
  },
  'smart-home': {
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=85&w=900',
    description: 'Connected home devices built to automate comfort, control, and ambience.'
  },
  fitness: {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=85&w=900',
    description: 'Training gear and recovery pieces selected for consistent performance.'
  },
  'personal-care': {
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=85&w=900',
    description: 'Daily care essentials that combine design, hygiene, and practical comfort.'
  },
  decor: {
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=85&w=900',
    description: 'Decor objects that add texture, shape, and character without clutter.'
  },
  'home-fragrance': {
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=85&w=900',
    description: 'Candles and scent-driven accents crafted to shape atmosphere with restraint.'
  },
  travel: {
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=900',
    description: 'Luggage and travel gear designed for cleaner movement and better packing.'
  }
};

const FALLBACK_VISUALS = [
  CATEGORY_VISUALS.fashion,
  CATEGORY_VISUALS.electronics,
  CATEGORY_VISUALS['home-garden'],
  CATEGORY_VISUALS['sports-outdoors']
];

const normalizeKey = (value = '') => value.toString().trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const CATEGORY_ALIASES = {
  home: 'home-decor',
  'home-and-garden': 'home-garden',
  'home-and-decor': 'home-decor',
  'sports-and-outdoors': 'sports-outdoors'
};

const getVisualEntry = (category = {}, index = 0) => {
  const keys = [category.slug, category.name]
    .filter(Boolean)
    .map(normalizeKey)
    .map((key) => CATEGORY_ALIASES[key] || key);

  const matchedKey = keys.find((key) => CATEGORY_VISUALS[key]);
  return CATEGORY_VISUALS[matchedKey] || FALLBACK_VISUALS[index % FALLBACK_VISUALS.length];
};

export const getCategoryImage = (category = {}, index = 0) => getVisualEntry(category, index).image || category.image;

export const getCategoryDescription = (category = {}, index = 0) => category.description || getVisualEntry(category, index).description;

export const handleCategoryImageError = (event, index = 0) => {
  const fallbackImage = FALLBACK_VISUALS[index % FALLBACK_VISUALS.length]?.image;
  if (!fallbackImage || event.currentTarget.src === fallbackImage) {
    return;
  }

  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImage;
};
