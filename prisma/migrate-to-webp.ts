import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Each entry: [oldPath, newPath]
const replacements: [string, string][] = [
  // Burgers
  ['/images/menu/burgers/BBQ_Cheadar_Mushroom_Burger.jpg',              '/images/menu/burgers/BBQ_Cheadar_Mushroom_Burger.webp'],
  ['/images/menu/burgers/Teryaki_MushRoom_Mozza_bacon_burger.jpg',      '/images/menu/burgers/Teryaki_MushRoom_Mozza_bacon_burger.webp'],
  ['/images/menu/burgers/Swiss_mozza_pickle_Burger.jpg',                '/images/menu/burgers/Swiss_mozza_pickle_Burger.webp'],
  ['/images/menu/burgers/Thai_Beef_Burger.jpg',                         '/images/menu/burgers/Thai_Beef_Burger.webp'],
  ['/images/menu/burgers/The_Teryaki_Grilled_Chicken_and_Swiss.jpg',    '/images/menu/burgers/The_Teryaki_Grilled_Chicken_and_Swiss.webp'],
  ['/images/menu/burgers/Mexican_Meatlless.jpg',                        '/images/menu/burgers/Mexican_Meatlless.webp'],
  ['/images/menu/burgers/Greek_God_Burger.jpg',                         '/images/menu/burgers/Greek_God_Burger.webp'],
  ['/images/menu/burgers/Battered_Cod_Burger.jpg',                      '/images/menu/burgers/Battered_Cod_Burger.webp'],
  ['/images/menu/burgers/Hawaiiawn_Burger.jpg',                         '/images/menu/burgers/Hawaiiawn_Burger.webp'],
  ['/images/menu/burgers/The_Cordon_Blue.jpg',                          '/images/menu/burgers/The_Cordon_Blue.webp'],
  ['/images/menu/burgers/The_Hevaen_Sent_Veggie_Burger.jpg',            '/images/menu/burgers/The_Hevaen_Sent_Veggie_Burger.webp'],
  ['/images/menu/burgers/Coming_Soon.png',                              '/images/menu/burgers/Coming_Soon.webp'],
  // Appetizers
  ['/images/menu/appetizers/Chicken_Tenders.jpg',                       '/images/menu/appetizers/Chicken_Tenders.webp'],
  ['/images/menu/appetizers/Gravey.jpg',                                '/images/menu/appetizers/Gravey.webp'],
  ['/images/menu/appetizers/Cheese_And_Bits.jpg',                       '/images/menu/appetizers/Cheese_And_Bits.webp'],
  // Sandwiches
  ['/images/menu/sandwiches/Heavenly_Club.jpg',                         '/images/menu/sandwiches/Heavenly_Club.webp'],
  ['/images/menu/sandwiches/Grilled_Cheese.jpg',                        '/images/menu/sandwiches/Grilled_Cheese.webp'],
  // Salads
  ['/images/menu/salads/Chicken_Ceaser_Salad.jpg',                      '/images/menu/salads/Chicken_Ceaser_Salad.webp'],
  ['/images/menu/salads/Appy_Artisan_Salad.jpg',                        '/images/menu/salads/Appy_Artisan_Salad.webp'],
  // Milkshakes
  ['/images/menu/milkshakes/Boozy_Shake_Baileys.jpg',                   '/images/menu/milkshakes/Boozy_Shake_Baileys.webp'],
  ['/images/menu/milkshakes/Boozy_Shake_Kulua.jpg',                     '/images/menu/milkshakes/Boozy_Shake_Kulua.webp'],
  ['/images/menu/milkshakes/Boozy_Shake_Frangelico.jpg',                '/images/menu/milkshakes/Boozy_Shake_Frangelico.webp'],
  ['/images/menu/milkshakes/Boozy_Shake_grandmarinea.jpg',              '/images/menu/milkshakes/Boozy_Shake_grandmarinea.webp'],
  // Beer & Ciders
  ['/images/menu/beer-ciders/Domestic_beer.jpg',                        '/images/menu/beer-ciders/Domestic_beer.webp'],
  ['/images/menu/beer-ciders/Import_Beer_Selection.jpg',                '/images/menu/beer-ciders/Import_Beer_Selection.webp'],
  // Coffees
  ['/images/menu/coffees/Coffee.jpg',                                   '/images/menu/coffees/Coffee.webp'],
  ['/images/menu/coffees/Tea.jpg',                                      '/images/menu/coffees/Tea.webp'],
];

async function main() {
  let total = 0;

  for (const [oldPath, newPath] of replacements) {
    const { count } = await prisma.menuItem.updateMany({
      where: { image: oldPath },
      data: { image: newPath },
    });
    if (count > 0) {
      console.log(`  ${count} updated: ${oldPath.split('/').pop()} → .webp`);
    } else {
      console.log(`  0 matched: ${oldPath.split('/').pop()} (already updated or not in DB)`);
    }
    total += count;
  }

  console.log(`\nDone. Total rows updated: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
