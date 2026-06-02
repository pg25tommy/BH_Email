import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const COMING_SOON = '/images/menu/burgers/Coming_Soon.png';

async function main() {
  let total = 0;

  // === COMING SOON PLACEHOLDER (23 items) ===

  // Unique names — safe to match by name alone
  const comingSoonNames = [
    'Yam Wedges',
    "Child's Cheese Burger",
    'Grilled Cheese Sandwich',
    'Caesar by Caesar (Appy Size)',
    'Soup (Cup)',
    'Mint Chocolate',
    'Nutella',
    'Peppermint',
    'Peanut Butter',
    'Red Velvet',
    'Apple Pie',
    'Juice',
    'Old Fashioned Ice Cream Float',
    '"Bottomless" Soft Drinks',
    'Milk',
    'Ciders (330 ml.)',
    "Mott's Caesar (355 ml.)",
    'Strongbow (440 ml.)',
    'Glass (6 oz.)',
    '1/2 Litre',
    'Litre',
  ];

  const { count: uniqueCount } = await prisma.menuItem.updateMany({
    where: { name: { in: comingSoonNames } },
    data: { image: COMING_SOON },
  });
  total += uniqueCount;

  // "Chicken Fingers" and "Fish 'n' Chips" exist in multiple categories — target Kids only
  const { count: kidsChicken } = await prisma.menuItem.updateMany({
    where: {
      name: 'Chicken Fingers',
      category: { name: 'Lil Angels (Under 12) & Seniors (65+)' },
    },
    data: { image: COMING_SOON },
  });
  total += kidsChicken;

  const { count: kidsFish } = await prisma.menuItem.updateMany({
    where: {
      name: "Fish 'n' Chips",
      category: { name: 'Lil Angels (Under 12) & Seniors (65+)' },
    },
    data: { image: COMING_SOON },
  });
  total += kidsFish;

  console.log(`Coming Soon placeholder: ${uniqueCount + kidsChicken + kidsFish} items`);

  // === NEW SPECIFIC IMAGES (8 items) ===

  const specificUpdates: [string, string][] = [
    ['The Classic Beef Dip',        '/images/menu/sandwiches/Beef_Dip_as_Philliy.jpg'],
    ['Toasted B.L.T.',              '/images/menu/sandwiches/BLT.jpg'],
    ['Gimme a Gamble (355 ml.)',    '/images/menu/beer-ciders/Gamble_Beer.jpg'],
    ['Hot Chocolate',               '/images/menu/beverages/Hot_Choclate.jpg'],
    ['Strawberry Lemonade',         '/images/menu/beverages/Special_Drinks.jpg'],
    ['Blue Raspberry Lemonade',     '/images/menu/beverages/Special_Drinks.jpg'],
    ['Shirley Temple',              '/images/menu/beverages/Special_Drinks.jpg'],
    ['Roy Rogers',                  '/images/menu/beverages/Special_Drinks.jpg'],
  ];

  let specificCount = 0;
  for (const [name, image] of specificUpdates) {
    const { count } = await prisma.menuItem.updateMany({ where: { name }, data: { image } });
    specificCount += count;
  }
  total += specificCount;
  console.log(`New specific images: ${specificCount} items`);

  // === PATH CORRECTIONS (2 items) ===

  const corrections: [string, string][] = [
    ['Awesome! Awesome! Awesome!',   '/images/menu/burgers/Awesome_Burger.jpg'],
    ['Greek Goddess Veggie Burger',  '/images/menu/burgers/Greek_Goddess_Burger.webp'],
  ];

  let correctionCount = 0;
  for (const [name, image] of corrections) {
    const { count } = await prisma.menuItem.updateMany({ where: { name }, data: { image } });
    correctionCount += count;
  }
  total += correctionCount;
  console.log(`Path corrections: ${correctionCount} items`);

  console.log(`\nDone. Total items updated: ${total} (expected 33).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
