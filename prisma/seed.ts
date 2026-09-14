import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "BBQ", slug: "bbq", order: 1 },
  { name: "Chicken", slug: "chicken", order: 2 },
  { name: "Beef", slug: "beef", order: 3 },
  { name: "Fish", slug: "fish", order: 4 },
  { name: "Kebabs", slug: "kebabs", order: 5 },
  { name: "Main Course", slug: "main-course", order: 6 },
  { name: "Rice", slug: "rice", order: 7 },
  { name: "Sides", slug: "sides", order: 8 },
  { name: "Drinks", slug: "drinks", order: 9 },
];

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=80`;

const items: Record<string, Array<{
  name: string; description: string; price: number; image: string;
  spicy?: boolean; veg?: boolean; popular?: boolean;
}>> = {
  bbq: [
    { name: "Beef Undercut Tikka", description: "Slow-marinated beef undercut, char-grilled over open coals until smoky and tender.", price: 1450, image: img("photo-1544025162-d76694265947"), popular: true, spicy: true },
    { name: "Charcoal Kukar", description: "Whole spring chicken marinated overnight and roasted over charcoal.", price: 1650, image: img("photo-1529193591184-b1d58069ecdd"), popular: true },
    { name: "Malai Boti", description: "Creamy, mild chicken boti finished with butter and fresh cream.", price: 950, image: img("photo-1585937421612-70a008356fbe") },
    { name: "Mutton Chops", description: "Tender mutton chops marinated in a bold house spice blend, grilled to order.", price: 1850, image: img("photo-1544025162-d76694265947"), spicy: true },
  ],
  chicken: [
    { name: "Chicken Tikka Piece", description: "Classic bone-in chicken tikka, marinated in yogurt and grill spices.", price: 450, image: img("photo-1610057099431-d73a1c9d2f2f"), popular: true, spicy: true },
    { name: "Reshmi Kebab Chicken", description: "Silky, mildly spiced chicken kebab — a Courtyard Grill favourite.", price: 850, image: img("photo-1585937421612-70a008356fbe"), popular: true },
    { name: "Chicken Chilli Dry", description: "Wok-tossed chicken with peppers and onions in a spicy garlic-chilli glaze.", price: 950, image: img("photo-1603133872878-684f208fb84b"), spicy: true },
    { name: "Chicken Boneless Handi", description: "Boneless chicken simmered in a rich tomato-butter handi gravy.", price: 1100, image: img("photo-1631452180519-c014fe946bc7") },
  ],
  beef: [
    { name: "Beef Undercut Tikka", description: "Our signature — smoky beef undercut grilled over open coals.", price: 1450, image: img("photo-1544025162-d76694265947"), popular: true, spicy: true },
    { name: "CYG Premium Beef Kabab", description: "House-blend beef seekh kebab, hand-shaped and charcoal grilled.", price: 1050, image: img("photo-1529193591184-b1d58069ecdd"), popular: true },
    { name: "Beef Behari Boti", description: "Beef boti marinated Behari-style with papaya, mustard oil and spices.", price: 1250, image: img("photo-1529193591184-b1d58069ecdd"), spicy: true },
    { name: "Bihari Kabab", description: "Thin-sliced beef kebab marinated in a traditional Bihari spice mix.", price: 1150, image: img("photo-1544025162-d76694265947") },
  ],
  fish: [
    { name: "Rahu Grilled Fish", description: "Whole Rahu fish, marinated and grilled over charcoal until crisp outside, flaky within.", price: 1350, image: img("photo-1519708227418-c8fd9a32b7a2"), popular: true, spicy: true },
    { name: "Fish Tikka", description: "Boneless fish fillet marinated in tandoori spices and grilled.", price: 1150, image: img("photo-1519708227418-c8fd9a32b7a2") },
  ],
  kebabs: [
    { name: "Reshmi Kebab Chicken", description: "Silky, mildly spiced chicken seekh kebab.", price: 850, image: img("photo-1585937421612-70a008356fbe"), popular: true },
    { name: "CYG Premium Beef Kabab", description: "Hand-shaped beef seekh kebab, charcoal grilled to order.", price: 1050, image: img("photo-1529193591184-b1d58069ecdd"), popular: true },
    { name: "Malai Boti and Beef Kebab Platter", description: "A shareable platter combining creamy malai boti and beef kebabs.", price: 2100, image: img("photo-1544025162-d76694265947") },
  ],
  "main-course": [
    { name: "Makhni Malai Boti", description: "Chicken boti in a velvety butter and cream makhni gravy.", price: 1250, image: img("photo-1631452180519-c014fe946bc7"), popular: true },
    { name: "Chicken Karahi (Half)", description: "Traditional wok-cooked chicken karahi with tomato, ginger and green chilli.", price: 1400, image: img("photo-1631452180519-c014fe946bc7"), spicy: true },
    { name: "Mutton Karahi (Half)", description: "Slow-cooked mutton karahi, rich and deeply spiced.", price: 2200, image: img("photo-1585937421612-70a008356fbe"), spicy: true },
    { name: "Dal Makhni", description: "Black lentils simmered overnight with butter and cream.", price: 650, image: img("photo-1546833999-b9f581a1996d"), veg: true },
  ],
  rice: [
    { name: "Beef Pulao", description: "Fragrant basmati rice cooked in slow-simmered beef stock.", price: 550, image: img("photo-1596797038530-2c107229654b") },
    { name: "Chicken Biryani", description: "Layered basmati rice with spiced chicken, saffron and fried onions.", price: 500, image: img("photo-1631515243349-e0cb75fb8d3a"), spicy: true },
    { name: "Plain Steamed Rice", description: "Simple steamed basmati rice.", price: 250, image: img("photo-1596797038530-2c107229654b"), veg: true },
  ],
  sides: [
    { name: "Puri Paratha (2 pcs)", description: "Traditional fried flatbread, made fresh to order.", price: 200, image: img("photo-1601050690597-df0568f70950"), veg: true },
    { name: "Naan (Tandoori)", description: "Fresh baked naan from the tandoor.", price: 100, image: img("photo-1601050690597-df0568f70950"), veg: true },
    { name: "Raita", description: "Cool mint and yogurt raita — a perfect companion to BBQ.", price: 150, image: img("photo-1546833999-b9f581a1996d"), veg: true },
    { name: "Salad", description: "Fresh cucumber, tomato and onion salad with a lemon dressing.", price: 200, image: img("photo-1546833999-b9f581a1996d"), veg: true },
  ],
  drinks: [
    { name: "Fresh Lime Soda", description: "Chilled soda with fresh lime, sweet or salted.", price: 250, image: img("photo-1544145945-f90425340c7e"), veg: true },
    { name: "Soft Drink (Can)", description: "Chilled soft drink of your choice.", price: 150, image: img("photo-1544145945-f90425340c7e"), veg: true },
    { name: "Mint Margarita (Mocktail)", description: "A refreshing mint and lime mocktail.", price: 350, image: img("photo-1544145945-f90425340c7e"), veg: true },
  ],
};

async function main() {
  console.log("Seeding categories & menu items...");
  for (const cat of categories) {
    const category = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });

    const list = items[cat.slug] || [];
    for (const it of list) {
      const existing = await prisma.menuItem.findFirst({
        where: { name: it.name, categoryId: category.id },
      });
      if (existing) {
        await prisma.menuItem.update({
          where: { id: existing.id },
          data: {
            description: it.description,
            price: it.price,
            imageUrl: it.image,
            isSpicy: !!it.spicy,
            isVeg: !!it.veg,
            isPopular: !!it.popular,
          },
        });
      } else {
        await prisma.menuItem.create({
          data: {
            name: it.name,
            description: it.description,
            price: it.price,
            imageUrl: it.image,
            isSpicy: !!it.spicy,
            isVeg: !!it.veg,
            isPopular: !!it.popular,
            categoryId: category.id,
          },
        });
      }
    }
  }

  console.log("Seeding admin user...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@courtyardgrill.pk";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Courtyard Grill Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin ready → ${adminEmail} / ${adminPassword} (change this immediately)`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
