import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const COMING_SOON = '/images/menu/burgers/Coming_Soon.png';

async function main() {
  // Unique names — safe to match by name alone
  const uniqueNames = [
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
    where: { name: { in: uniqueNames } },
    data: { image: COMING_SOON },
  });
  console.log(`Updated ${uniqueCount} uniquely-named items.`);

  // "Chicken Fingers" exists in both Appetizers and Kids — target Kids only
  const { count: kidsChicken } = await prisma.menuItem.updateMany({
    where: {
      name: 'Chicken Fingers',
      category: { name: 'Lil Angels (Under 12) & Seniors (65+)' },
    },
    data: { image: COMING_SOON },
  });
  console.log(`Updated ${kidsChicken} kids Chicken Fingers.`);

  // "Fish 'n' Chips" exists in both Specialty and Kids — target Kids only
  const { count: kidsFish } = await prisma.menuItem.updateMany({
    where: {
      name: "Fish 'n' Chips",
      category: { name: 'Lil Angels (Under 12) & Seniors (65+)' },
    },
    data: { image: COMING_SOON },
  });
  console.log(`Updated ${kidsFish} kids Fish 'n' Chips.`);

  const total = uniqueCount + kidsChicken + kidsFish;
  console.log(`\nDone. Total items updated: ${total} (expected 23).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
