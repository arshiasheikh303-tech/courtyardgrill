import Image from "next/image";
import Link from "next/link";
import { Star, Utensils, ShoppingBag, Bike } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";
import { DishCard } from "@/components/menu/DishCard";
import type { MenuItemDTO } from "@/types";

export const dynamic = "force-dynamic";

const FALLBACK_FEATURED: MenuItemDTO[] = [
  { id: "f1", name: "Beef Undercut Tikka", description: "Slow-marinated beef undercut, char-grilled over open coals.", price: 1450, imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80", isSpicy: true, isVeg: false, isPopular: true, isAvailable: true, categoryId: "bbq" },
  { id: "f2", name: "Makhni Malai Boti", description: "Chicken boti in a velvety butter and cream makhni gravy.", price: 1250, imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80", isSpicy: false, isVeg: false, isPopular: true, isAvailable: true, categoryId: "main-course" },
  { id: "f3", name: "Chicken Tikka Piece", description: "Classic bone-in chicken tikka, marinated in yogurt and grill spices.", price: 450, imageUrl: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=900&q=80", isSpicy: true, isVeg: false, isPopular: true, isAvailable: true, categoryId: "chicken" },
  { id: "f4", name: "CYG Premium Beef Kabab", description: "House-blend beef seekh kebab, hand-shaped and charcoal grilled.", price: 1050, imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=80", isSpicy: false, isVeg: false, isPopular: true, isAvailable: true, categoryId: "kebabs" },
  { id: "f5", name: "Rahu Grilled Fish", description: "Whole Rahu fish, marinated and grilled over charcoal.", price: 1350, imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80", isSpicy: true, isVeg: false, isPopular: true, isAvailable: true, categoryId: "fish" },
  { id: "f6", name: "Charcoal Kukar", description: "Whole spring chicken marinated overnight and roasted over charcoal.", price: 1650, imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=80", isSpicy: false, isVeg: false, isPopular: true, isAvailable: true, categoryId: "bbq" },
];

async function getFeatured(): Promise<MenuItemDTO[]> {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isPopular: true, isAvailable: true },
      distinct: ["name"],
      take: 6,
      orderBy: { name: "asc" },
    });
    return items.length ? items : FALLBACK_FEATURED;
  } catch {
    return FALLBACK_FEATURED;
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      <Hero />

      {/* Highlights */}
      <section className="border-y border-parchment/10 bg-char-800">
        <div className="container-px mx-auto grid max-w-7xl grid-cols-2 gap-8 py-14 text-center md:grid-cols-4">
          <div>
            <div className="flex items-center justify-center gap-1 font-display text-3xl text-gold-400">
              <AnimatedCounter value={4.5} suffix="" />
              <Star size={22} className="fill-gold-400 text-gold-400" />
            </div>
            <p className="mt-2 text-sm text-parchment/60">Google Rating</p>
          </div>
          <div>
            <div className="font-display text-3xl text-gold-400">
              <AnimatedCounter value={800} suffix="+" />
            </div>
            <p className="mt-2 text-sm text-parchment/60">Reviews</p>
          </div>
          <div>
            <Utensils className="mx-auto text-ember-400" size={26} />
            <p className="mt-2 text-sm text-parchment/60">Dine-in</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-3">
              <ShoppingBag className="text-ember-400" size={26} />
              <Bike className="text-ember-400" size={26} />
            </div>
            <p className="mt-2 text-sm text-parchment/60">Pickup & Delivery</p>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="container-px mx-auto max-w-7xl py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-ember-400">Fan favourites</p>
            <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">Featured Dishes</h2>
          </div>
          <Link href="/menu" className="text-sm text-parchment/70 underline underline-offset-4 hover:text-cream">
            View full menu →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="border-t border-parchment/10 bg-char-800">
        <div className="container-px mx-auto grid max-w-7xl items-center gap-12 py-20 md:grid-cols-2">
          <div className="relative h-80 w-full overflow-hidden rounded-sm md:h-[26rem]">
            <Image
              src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80"
              alt="Charcoal grill at Courtyard Grill"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-sm text-ember-400">Our story</p>
            <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
              Grilled the way it should be
            </h2>
            <p className="mt-5 max-w-prose2 text-parchment/70">
              Tucked into a quiet basement corner of DHA Phase 2, Courtyard Grill has spent years
              perfecting one thing: BBQ that tastes like it should — smoky, generous, and built on
              honest ingredients. No shortcuts, no gimmicks. Just charcoal, good meat, and a menu
              we&apos;d cook for our own family.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Freshly Grilled", "Quality Ingredients", "Authentic Flavours", "Family Recipes"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-parchment/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
                    {t}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/about"
              className="mt-8 inline-block rounded-sm border border-parchment/30 px-6 py-3 text-sm text-cream transition hover:border-cream"
            >
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px mx-auto max-w-7xl py-20 text-center">
        <h2 className="font-display text-3xl text-cream sm:text-4xl">
          Hungry already?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-parchment/70">
          Book a table for tonight or get Courtyard Grill delivered straight to your door.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/reservations" className="rounded-sm bg-ember-500 px-7 py-3.5 font-medium text-char-950 hover:bg-ember-400">
            Reserve a Table
          </Link>
          <Link href="/order" className="rounded-sm border border-parchment/30 px-7 py-3.5 font-medium text-cream hover:border-cream">
            Order Online
          </Link>
        </div>
      </section>
    </>
  );
}