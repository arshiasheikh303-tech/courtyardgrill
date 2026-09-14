import type { Metadata } from "next";
import Image from "next/image";
import { Flame, Leaf, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story behind Courtyard Grill — a charcoal BBQ restaurant in DHA Phase 2, Lahore built on quality ingredients and authentic Pakistani flavours.",
};

export default function AboutPage() {
  return (
    <div className="bg-char-900">
      <section className="container-px mx-auto max-w-7xl py-20">
        <p className="text-sm text-ember-400">About Courtyard Grill</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl text-cream sm:text-5xl">
          Charcoal, patience, and a menu we&apos;d cook for our own family.
        </h1>
      </section>

      <section className="container-px mx-auto grid max-w-7xl items-center gap-12 pb-20 md:grid-cols-2">
        <div className="relative order-2 h-80 w-full overflow-hidden rounded-sm md:order-1 md:h-[28rem]">
          <Image
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80"
            alt="Interior of Courtyard Grill restaurant"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="font-display text-3xl text-cream">Our Story</h2>
          <p className="mt-5 max-w-prose2 text-parchment/70">
            Courtyard Grill started as a small, no-frills spot in DHA Phase 2 with four tables and
            one very hot charcoal grill. Word travelled fast — not through advertising, but through
            people who tried the beef undercut tikka and came back the next week with three friends.
          </p>
          <p className="mt-4 max-w-prose2 text-parchment/70">
            Over half a decade later, the philosophy hasn&apos;t changed. We buy quality meat, we
            marinate it properly, and we let the charcoal do the rest — no over-seasoning, no
            shortcuts to mask the ingredients. It&apos;s BBQ the way it should be: honest, smoky, and
            made to order.
          </p>
        </div>
      </section>

      <section className="border-y border-parchment/10 bg-char-800">
        <div className="container-px mx-auto grid max-w-7xl gap-10 py-16 sm:grid-cols-3">
          <div className="text-center">
            <Flame className="mx-auto text-ember-400" size={28} />
            <h3 className="mt-4 font-display text-xl text-cream">Freshly Grilled</h3>
            <p className="mt-2 text-sm text-parchment/60">
              Every skewer goes on the charcoal only after your order is placed.
            </p>
          </div>
          <div className="text-center">
            <Award className="mx-auto text-ember-400" size={28} />
            <h3 className="mt-4 font-display text-xl text-cream">Quality Ingredients</h3>
            <p className="mt-2 text-sm text-parchment/60">
              Sourced meat and fresh spices — nothing frozen for weeks, nothing pre-mixed.
            </p>
          </div>
          <div className="text-center">
            <Leaf className="mx-auto text-ember-400" size={28} />
            <h3 className="mt-4 font-display text-xl text-cream">Authentic Flavours</h3>
            <p className="mt-2 text-sm text-parchment/60">
              Recipes rooted in Pakistani BBQ tradition, refined over years of service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
