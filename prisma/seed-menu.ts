import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const menuData = {
  categories: [
    {
      id: "top-10",
      name: "Your Top 10!",
      description: "All our burgers are served with your choice of wedges or mixed greens. Substitute Caesar Salad, Onion Rings, Poutine or loaded wedges $3.09 · Substitute Yam wedges $2.99 · Hot gravy for your wedges $1.50",
      items: [
        { id: "works-burger", name: "1. \"The Works\" Burger", description: "Cheddar, Mozzarella, Bacon & Mushrooms with Dill Pickles. A Heavenly Meal at a heck of a deal.", price: 25.89, featured: true, bestSeller: true, image: "/images/menu/burgers/The_Works.webp" },
        { id: "perogy-burger", name: "2. Perogy Beef Burger", description: "4 mini cheese and potato perogies, sautéed onion and shredded mozza and cheddar cheese topped with a dollop of sour cream n' chives", price: 25.69, featured: true, bestSeller: false, image: "/images/menu/burgers/The_Perogy.webp" },
        { id: "bbq-cheddar-bacon", name: "3. BBQ, Cheddar, Bacon & Mushroom Burger", description: "Democratically elected for its classic simplicity", price: 24.49, featured: false, bestSeller: false, image: "/images/menu/burgers/BBQ_Cheadar_Mushroom_Burger.jpg" },
        { id: "teriyaki-mozz-bacon", name: "4. Teriyaki, Mozzarella, Bacon & Mushroom Burger", description: "Miss Piggy's favorite", price: 24.49, featured: false, bestSeller: false, image: "/images/menu/burgers/Teryaki_MushRoom_Mozza_bacon_burger.webp" },
        { id: "swiss-mozz-pickle", name: "5. Swiss, Mozzarella & Pickle Burger", description: "A cheese lover's dream, with a zing", price: 23.19, featured: false, bestSeller: false, image: "/images/menu/burgers/swiss-mozz-pickle.jpg" },
        { id: "thai-beef", name: "6. Thai Beef Burger", description: "Crunchy peanut butter, bacon, green onion and sweet thai chilli sauce", price: 22.89, featured: false, bestSeller: false, image: "/images/menu/burgers/Thai_Beef_Burger.jpg" },
        { id: "breaded-chicken", name: "7. Breaded Chicken, Bacon, Cheddar & Mozzarella Burger", description: "Perfection", price: 27.19, featured: false, bestSeller: true, image: "/images/menu/burgers/Breaded_Chicken_Cheedar_Mozza_Bacon.jpg" },
        { id: "teriyaki-chicken", name: "8. Teriyaki Grilled Chicken, Swiss & Bacon Burger", description: "It will make you yodel!!", price: 27.99, featured: false, bestSeller: false, image: "/images/menu/burgers/The_Teryaki_Grilled_Chicken_and_Swiss.webp" },
        { id: "mexican-meatless", name: "9. Mexican Meatless Garden Burger", description: "With Salsa, Guacamole & Jalapenos", price: 24.59, featured: false, bestSeller: false, image: "/images/menu/burgers/Mexican_Meatlless.jpg" },
        { id: "breakfast-burger", name: "10. Breakfast Burger, Mozzarella, Fried Egg & Bacon", description: "Gooood Morningnn!!", price: 25.09, featured: false, bestSeller: false, image: "/images/menu/burgers/Breakfast_Burger.jpg" },
      ]
    },
    {
      id: "appetizers",
      name: "Angelic Appetizers",
      description: "Start your meal right",
      items: [
        { id: "chicken-fingers", name: "Chicken Fingers", description: "1/2 pound of wedges or salad - Breaded chicken tenders, fried to golden perfection (your choice of dip).", price: 18.09, featured: false, bestSeller: false, image: "/images/menu/appetizers/Chicken_Tenders.jpg" },
        { id: "chicken-wings", name: "Chicken Wings", description: "1 pound tossed in your choice of Hot, BBQ, Teriyaki, Sweet Thai Chili, Mango Habanero Sauce, or salt and pepper, served with carrot sticks. Your choice of dip.", price: 20.69, featured: false, bestSeller: false, image: "/images/menu/appetizers/Chicken_Wings.jpg" },
        { id: "onion-rings", name: "Onion Rings", description: "Does rings around your appetite (your choice of dip).", price: 13.99, featured: false, bestSeller: false, image: "/images/menu/appetizers/Onion_Rings.jpg" },
        { id: "nacho-poutine", name: "Nacho Poutine", description: "1/2 pound of our wedges topped with ground beef, olives, jalapenos, shredded cheddar and mozza, and a dollop of salsa and sour cream n' chives.", price: 16.89, featured: false, bestSeller: false, image: "/images/menu/appetizers/Natcho_Poutine.jpg" },
        { id: "poutine", name: "Poutine", description: "1/2 pound of our wedges smothered with cheese curds and gravy.", price: 13.99, featured: false, bestSeller: false, image: "/images/menu/appetizers/Gravey.webp" },
        { id: "loaded-wedges", name: "Loaded Potato Wedges", description: "1/2 pound of wedges smothered with cheese & topped with real bacon bits and sour cream n' chives.", price: 14.49, featured: false, bestSeller: false, image: "/images/menu/appetizers/Cheese_And_Bits.jpg" },
        { id: "magic-mushrooms", name: "Magic Mushrooms (not the real thing!)", description: "Lightly coated with our special breading (your choice of dip).", price: 13.99, featured: false, bestSeller: false, image: "/images/menu/appetizers/Magic_Mushrooms.jpg" },
        { id: "yam-wedges", name: "Yam Wedges", description: "1/2 pound of crisp french fried wedges.", price: 7.89, featured: false, bestSeller: false, image: "/images/menu/appetizers/yam-wedges.jpg" },
      ]
    },
    {
      id: "sandwiches",
      name: "Galaxy of Special Sandwiches",
      description: "Not in the mood for a burger? Try our signature sandwiches",
      items: [
        { id: "wankers-club", name: "Toasted Wanker's Club", description: "Egg, cheddar, bacon, lettuce, tomato and our special sauce. Jimmy's own favorite!!", price: 20.09, featured: false, bestSeller: false, image: "/images/menu/sandwiches/Wankers_Club.jpg" },
        { id: "heavenly-club", name: "Toasted Heavenly Club", description: "Cheddar, ham, bacon, tomato, lettuce our special sauce. It's a bite of heaven!!", price: 21.09, featured: false, bestSeller: false, image: "/images/menu/sandwiches/Heavenly_Club.jpg" },
        { id: "chicken-club", name: "Toasted Chicken Club", description: "Chicken, tomato, lettuce, bacon and our special sauce.", price: 23.29, featured: false, bestSeller: false, image: "/images/menu/sandwiches/Chicken_Club.jpg" },
        { id: "grilled-cheddar-cheese", name: "Our Great Grilled Cheddar Cheese", description: "On thick sliced sourdough bread with natural aged Canadian cheddar – so nippy it bites back! Add bacon or ham $1.47 · Add tomato $0.99", price: 11.29, featured: false, bestSeller: false, image: "/images/menu/sandwiches/Grilled_Cheese.jpg" },
        { id: "beef-dip", name: "The Classic Beef Dip", description: "Oven roasted striploin served on a baguette with horseradish mayo and a side of house made au jus. Make it a Philly Cheesesteak $2.49", price: 22.49, featured: false, bestSeller: false, image: "/images/menu/sandwiches/beef-dip.jpg" },
        { id: "blt", name: "Toasted B.L.T.", description: "Crisp bacon, crunchy lettuce and slices of ripe tomato. A combination of compliments that wins compliments. Add cheddar: $1.47", price: 15.09, featured: false, bestSeller: false, image: "/images/menu/sandwiches/blt.jpg" },
      ]
    },
    {
      id: "create-your-own",
      name: "Create Your Own Favourite",
      description: "Start with a premium patty and build your dream burger with our toppings",
      items: [
        { id: "beef-burger", name: "Heaven Sent Beef Burger", description: "With lettuce, tomato, red onions and our burger sauce. Add an extra patty for $4.49", price: 18.09, featured: false, bestSeller: false, image: "/images/menu/burgers/The_Heaven_Sent_Beef_Burger.webp" },
        { id: "grilled-chicken-burger", name: "Heaven Sent Grilled Chicken Burger", description: "With lettuce, tomato and our burger sauce. Add an extra chicken breast $5.59", price: 20.79, featured: false, bestSeller: false, image: "/images/menu/burgers/The_Hevaen_Sent_Grilled_Chicken_Burger.webp" },
        { id: "meatless-burger", name: "Heaven Sent Meatless Burger", description: "With lettuce, tomato, red onions and our burger sauce. Add an extra patty for $4.69", price: 18.49, featured: false, bestSeller: false, image: "/images/menu/burgers/The_Hevaen_Sent_Veggie_Burger.webp" },
        { id: "cod-burger", name: "Heaven Sent Cod Burger", description: "With lettuce, tomato, red onions and our house made tartar sauce, beer battered, grilled or cajun.", price: 20.89, featured: false, bestSeller: false, image: "/images/menu/burgers/Grilled_Cod_Burger.jpg" },
      ]
    },
    {
      id: "specialty",
      name: "To Die For Specialty Burgers",
      description: "Premium creations for the adventurous",
      items: [
        { id: "mile-high", name: "Ernie's Mile High", description: "Three pounds of meat. Eight patties high topped with THE WORKS!", price: 72.69, featured: true, bestSeller: false, image: "/images/menu/burgers/Ernies_Mile_High.jpg" },
        { id: "awesome", name: "Awesome! Awesome! Awesome!", description: "A pound in a half of meat topped off with THE WORKS.", price: 45.49, featured: true, bestSeller: false, image: "/images/menu/specialty/Awesome_Burger.jpg" },
        { id: "hulk-burger", name: "Hulk Burger", description: "This Two patty burger comes with THE WORKS!", price: 31.09, featured: true, bestSeller: false, image: "/images/menu/burgers/Hullk_Burger.webp" },
        { id: "greek-god", name: "Greek God Burger", description: "A fresh grade \"A\" lean beef patty topped with green peppers, black olives & feta cheese & tzatziki. Food for the God's indeed!", price: 24.89, featured: false, bestSeller: false, image: "/images/menu/burgers/Greek_God_Burger.jpg" },
        { id: "insanity", name: "Insanity Burger", description: "Our beef burger topped with swiss and bacon between two grilled cheese sandwiches.", price: 29.99, featured: false, bestSeller: false, image: "/images/menu/burgers/Insanity_Burger.webp" },
        { id: "chicken-marinara", name: "Chicken Marinara Burger", description: "A breaded chicken breast topped with marinara, parmesan and mozzarella.", price: 27.19, featured: false, bestSeller: false, image: "/images/menu/specialty/Chicken_Marinara.jpg" },
        { id: "hawaiian", name: "Hawaiian Burger", description: "A teriyaki burger topped with ham, pineapple ring, lettuce, tomato, onions and mozzarella. Beats poi any day!", price: 25.89, featured: false, bestSeller: false, image: "/images/menu/burgers/Hawaiiawn_Burger.jpg" },
        { id: "chicken-cordon-bleu", name: "Chicken Cordon Bleu Burger", description: "A tender breast filet, breaded and fried to golden perfection, then topped with ham, melted mozzarella, tomato, lettuce and our special sauce.", price: 25.89, featured: false, bestSeller: false, image: "/images/menu/burgers/The_Cordon_Blue.webp" },
        { id: "spicy-inferno", name: "The Spicy Inferno", description: "Our cajun beef patty topped with habanero mango sauce, jack cheese, jalapenos and banana peppers.", price: 27.19, featured: false, bestSeller: false, image: "/images/menu/burgers/Spicey_Inferno.jpg" },
        { id: "greek-goddess-veggie", name: "Greek Goddess Veggie Burger", description: "Grilled veggie burger topped off with sundried tomatoes, feta, green peppers and hummus.", price: 25.29, featured: false, bestSeller: false, image: "/images/menu/specialty/Greek_Goddess_Burger.webp" },
        { id: "fish-chips", name: "Fish 'n' Chips", description: "Extra piece of Cod $5.84", price: 22.89, featured: false, bestSeller: false, image: "/images/menu/specialty/Fish_and_Chips.jpg" },
      ]
    },
    {
      id: "kids-seniors",
      name: "Lil Angels (Under 12) & Seniors (65+)",
      description: "Served with a small pop, milk, juice or coffee, potato wedges or salad and a small sundae.",
      items: [
        { id: "kids-grilled-cheese", name: "Grilled Cheese Sandwich", description: "Served with a small pop, milk, juice or coffee, potato wedges or salad and a small sundae.", price: 15.49, featured: false, bestSeller: false, image: "/images/menu/burgers/kids-grilled-cheese.jpg" },
        { id: "kids-cheese-burger", name: "Child's Cheese Burger", description: "Served with a small pop, milk, juice or coffee, potato wedges or salad and a small sundae.", price: 15.49, featured: false, bestSeller: false, image: "/images/menu/burgers/kids-cheese-burger.jpg" },
        { id: "kids-chicken-fingers", name: "Chicken Fingers", description: "Served with a small pop, milk, juice or coffee, potato wedges or salad and a small sundae.", price: 15.49, featured: false, bestSeller: false, image: "/images/menu/burgers/kids-chicken-fingers.jpg" },
        { id: "kids-fish-chips", name: "Fish 'n' Chips", description: "Served with a small pop, milk, juice or coffee, potato wedges or salad and a small sundae.", price: 15.49, featured: false, bestSeller: false, image: "/images/menu/burgers/kids-fish-chips.jpg" },
      ]
    },
    {
      id: "salads-soup",
      name: "Salads / Soup",
      description: "Fresh and healthy options",
      items: [
        { id: "caesar-appy", name: "Caesar by Caesar (Appy Size)", description: "Served with garlic toast and a lemon wedge. Add Chicken: $5.59 · Add Cod: $5.89", price: 9.59, featured: false, bestSeller: false, image: "/images/menu/salads/caesar-appy.jpg" },
        { id: "caesar-dinner", name: "Caesar by Caesar (Dinner Size)", description: "Served with garlic toast and a lemon wedge. Add Chicken: $5.59 · Add Cod: $5.89", price: 13.49, featured: false, bestSeller: false, image: "/images/menu/salads/Chicken_Ceaser_Salad.jpg" },
        { id: "artisan-appy", name: "Artisan Salad (Appy Size)", description: "Our artisan salad with tomatoes, red onions, cabbage, carrots and feta. Served with garlic toast. Add Chicken: $5.59 · Add Cod: $5.89", price: 9.59, featured: false, bestSeller: false, image: "/images/menu/salads/Appy_Artisan_Salad.jpg" },
        { id: "artisan-dinner", name: "Artisan Salad (Dinner Size)", description: "Our artisan salad with tomatoes, red onions, cabbage, carrots and feta. Served with garlic toast. Add Chicken: $5.59 · Add Cod: $5.89", price: 13.49, featured: false, bestSeller: false, image: "/images/menu/salads/Artisan_Salad.jpg" },
        { id: "mediterranean", name: "Mediterranean Salad", description: "Our artisan salad with artichoke hearts, tomatoes, kalamata olives, feta cheese and toasted pine nuts.", price: 13.49, featured: false, bestSeller: false, image: "/images/menu/salads/Mediterranean_Salad.jpg" },
        { id: "soup-cup", name: "Soup (Cup)", description: "Ask your server for today's selection", price: 4.89, featured: false, bestSeller: false, image: "/images/menu/salads/soup-cup.jpg" },
        { id: "soup-bowl", name: "Soup (Bowl)", description: "Ask your server for today's selection", price: 7.59, featured: false, bestSeller: false, image: "/images/menu/appetizers/Bowl_Of_Soup.jpg" },
      ]
    },
    {
      id: "milkshakes",
      name: "Milkshakes",
      description: "Your choice only $5.74",
      items: [
        { id: "vanilla-shake", name: "Vanilla", description: "Classic vanilla milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/Vanilla_Milkshake.jpg" },
        { id: "chocolate-shake", name: "Chocolate", description: "Rich chocolate milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/Choclate_Millshake.jpg" },
        { id: "strawberry-shake", name: "Strawberry", description: "Sweet strawberry milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/Strawberry_Milkshake.jpg" },
        { id: "mint-chocolate-shake", name: "Mint Chocolate", description: "Refreshing mint chocolate milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/mint-chocolate-shake.jpg" },
        { id: "nutella-shake", name: "Nutella", description: "Creamy Nutella milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/nutella-shake.jpg" },
        { id: "peppermint-shake", name: "Peppermint", description: "Cool peppermint milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/peppermint-shake.jpg" },
        { id: "peanut-butter-shake", name: "Peanut Butter", description: "Rich peanut butter milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/peanut-butter-shake.jpg" },
        { id: "red-velvet-shake", name: "Red Velvet", description: "Decadent red velvet milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/red-velvet-shake.jpg" },
        { id: "apple-pie-shake", name: "Apple Pie", description: "Apple pie flavored milkshake", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/apple-pie-shake.jpg" },
      ]
    },
    {
      id: "fancy-beverages",
      name: "Fancy Bottomless Beverages",
      description: "Your choice only $4.79",
      items: [
        { id: "strawberry-lemonade", name: "Strawberry Lemonade", description: "Bottomless strawberry lemonade", price: 4.79, featured: false, bestSeller: false, image: "/images/menu/beverages/strawberry-lemonade.jpg" },
        { id: "blue-raspberry-lemonade", name: "Blue Raspberry Lemonade", description: "Bottomless blue raspberry lemonade", price: 4.79, featured: false, bestSeller: false, image: "/images/menu/beverages/blue-raspberry-lemonade.jpg" },
        { id: "shirley-temple", name: "Shirley Temple", description: "Bottomless Shirley Temple", price: 4.79, featured: false, bestSeller: false, image: "/images/menu/beverages/shirley-temple.jpg" },
        { id: "roy-rogers", name: "Roy Rogers", description: "Bottomless Roy Rogers", price: 4.79, featured: false, bestSeller: false, image: "/images/menu/beverages/roy-rogers.jpg" },
      ]
    },
    {
      id: "non-alcoholic",
      name: "Non-Alcoholic Beverages",
      description: "Refreshing drinks for everyone",
      items: [
        { id: "coffee", name: "\"Bottomless\" Heavenly Coffee", description: "Unlimited refills with a meal. Leaded and Unleaded.", price: 3.24, featured: false, bestSeller: false, image: "/images/menu/beverages/coffee.jpg" },
        { id: "juice", name: "Juice", description: "Apple, Cranberry and Orange", price: 3.79, featured: false, bestSeller: false, image: "/images/menu/beverages/juice.jpg" },
        { id: "ice-cream-float", name: "Old Fashioned Ice Cream Float", description: "Soft drink choices", price: 5.74, featured: false, bestSeller: false, image: "/images/menu/beverages/ice-cream-float.jpg" },
        { id: "soft-drinks", name: "\"Bottomless\" Soft Drinks", description: "Pepsi, 7-up, Rootbeer, Grape Crush, Ginger Ale, Diet Pepsi, Cream Soda, Ice Tea, Lemonade", price: 3.69, featured: false, bestSeller: false, image: "/images/menu/beverages/soft-drinks.jpg" },
        { id: "tea", name: "Tea", description: "Hot tea", price: 3.24, featured: false, bestSeller: false, image: "/images/menu/beverages/tea.jpg" },
        { id: "hot-chocolate", name: "Hot Chocolate", description: "Rich hot chocolate", price: 3.24, featured: false, bestSeller: false, image: "/images/menu/beverages/hot-chocolate.jpg" },
        { id: "milk", name: "Milk", description: "Large (16oz. glass)", price: 3.79, featured: false, bestSeller: false, image: "/images/menu/beverages/milk.jpg" },
      ]
    },
    {
      id: "beer-ciders",
      name: "Beer & Ciders",
      description: "Craft and classic selections",
      items: [
        { id: "steel-oak-glass", name: "Steel 'n' Oak (20 oz. glass)", description: "Steel 'n' Oak on draft", price: 7.99, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/Steel_and_Oak_IPA.jpg" },
        { id: "steel-oak-pitcher", name: "Steel 'n' Oak Pitcher (60 oz.)", description: "Steel 'n' Oak pitcher", price: 21.34, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/Steel_and_Oak_IPA.jpg" },
        { id: "gimme-gamble", name: "Gimme a Gamble (355 ml.)", description: "A true gamble our choice of beer", price: 5.69, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/gimme-gamble.jpg" },
        { id: "domestic-bottles", name: "Domestic Bottles (341 ml.)", description: "Sleemans Honey Brown, Budweiser, Canadian, Coors Light, Kokanee, MGD", price: 6.39, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/Beer_Selection.jpg" },
        { id: "import-bottles", name: "Import Bottles (330 ml.)", description: "Heineken, Corona, Stella, Guiness", price: 6.99, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/import-bottles.jpg" },
        { id: "ciders", name: "Ciders (330 ml.)", description: "Apple, Peach, Pear or Smirnoff Ice", price: 6.99, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/ciders.jpg" },
        { id: "motts-caesar", name: "Mott's Caesar (355 ml.)", description: "Classic Caesar", price: 7.19, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/motts-caesar.jpg" },
        { id: "strongbow", name: "Strongbow (440 ml.)", description: "Strongbow cider", price: 7.29, featured: false, bestSeller: false, image: "/images/menu/beer-ciders/strongbow.jpg" },
      ]
    },
    {
      id: "wine",
      name: "House Wines",
      description: "Red or White",
      items: [
        { id: "wine-glass", name: "Glass (6 oz.)", description: "Red or White wine by the glass", price: 6.94, featured: false, bestSeller: false, image: "/images/menu/wine/wine-glass.jpg" },
        { id: "wine-half-litre", name: "1/2 Litre", description: "Red or White wine half litre", price: 20.29, featured: false, bestSeller: false, image: "/images/menu/wine/wine-half-litre.jpg" },
        { id: "wine-litre", name: "Litre", description: "Red or White wine litre", price: 26.54, featured: false, bestSeller: false, image: "/images/menu/wine/wine-litre.jpg" },
      ]
    },
    {
      id: "heavenly-coffees",
      name: "Heavenly Coffees",
      description: "All Heavenly Coffees 1 oz. / Add an extra shot $3.00",
      items: [
        { id: "hazelnut-coffee", name: "Hazelnut Coffee", description: "Frangelico & fresh brewed coffee", price: 6.74, featured: false, bestSeller: false, image: "/images/menu/coffees/hazelnut-coffee.jpg" },
        { id: "boozy-mocha", name: "Boozy Mocha", description: "Kahlua, peppermint & hot chocolate", price: 6.74, featured: false, bestSeller: false, image: "/images/menu/coffees/Boozy_Coffee.jpg" },
        { id: "monte-cristo", name: "Monte Cristo", description: "Grand Marnier, Kahlua & fresh brewed coffee", price: 6.74, featured: false, bestSeller: false, image: "/images/menu/coffees/monte-cristo.jpg" },
        { id: "baileys-coffee", name: "Bailey's Coffee", description: "Irish Baileys Cream & fresh brewed coffee", price: 6.74, featured: false, bestSeller: false, image: "/images/menu/coffees/baileys-coffee.jpg" },
        { id: "b52", name: "B52", description: "Baileys, Kahlua, Grand Marnier & fresh brewed coffee", price: 6.74, featured: false, bestSeller: false, image: "/images/menu/coffees/b52.jpg" },
        { id: "polar-bear", name: "Polar Bear", description: "Baileys & Hot Chocolate", price: 6.74, featured: false, bestSeller: false, image: "/images/menu/coffees/polar-bear.jpg" },
      ]
    },
    {
      id: "boozy-shakes",
      name: "Boozy Milkshakes",
      description: "Your choice only $8.74 / Add an extra shot for only $3.50",
      items: [
        { id: "baileys-shake", name: "Baileys Milkshake", description: "Baileys milkshake - enjoy as a vanilla shake or create your own favourite", price: 8.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/Boozy_Shake_Baileys.jpg" },
        { id: "kahlua-shake", name: "Kahlua Milkshake", description: "Kahlua milkshake - enjoy as a vanilla shake or create your own favourite", price: 8.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/Boozy_Shake_Kulua.jpg" },
        { id: "frangelico-shake", name: "Frangelico Milkshake", description: "Frangelico milkshake - enjoy as a vanilla shake or create your own favourite", price: 8.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/Boozy_Shake_Frangelico.jpg" },
        { id: "grand-marnier-shake", name: "Grand Marnier Milkshake", description: "Grand Marnier milkshake - enjoy as a vanilla shake or create your own favourite", price: 8.74, featured: false, bestSeller: false, image: "/images/menu/milkshakes/Boozy_Shake_grandmarinea.jpg" },
      ]
    },
  ]
};

async function main() {
  console.log('Starting menu seed...');

  // Clear existing data
  console.log('Clearing existing menu data...');
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  // Create categories and items
  for (let i = 0; i < menuData.categories.length; i++) {
    const cat = menuData.categories[i];
    console.log(`Creating category: ${cat.name}`);

    const category = await prisma.category.create({
      data: {
        name: cat.name,
        description: cat.description,
        sortOrder: i,
        active: true,
      },
    });

    // Create items for this category
    for (let j = 0; j < cat.items.length; j++) {
      const item = cat.items[j];
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          featured: item.featured || false,
          bestSeller: item.bestSeller || false,
          soldOut: false,
          active: true,
          sortOrder: j,
          categoryId: category.id,
        },
      });
    }

    console.log(`  Created ${cat.items.length} items`);
  }

  const totalCategories = await prisma.category.count();
  const totalItems = await prisma.menuItem.count();

  console.log('\nSeed completed!');
  console.log(`Total categories: ${totalCategories}`);
  console.log(`Total menu items: ${totalItems}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
