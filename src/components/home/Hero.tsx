"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-char-950">
      <Image
        src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80"
        alt="Charcoal-grilled beef tikka skewers at Courtyard Grill"
        fill
        priority
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/70 to-char-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-char-950/80 via-char-950/20 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="container-px relative mx-auto max-w-7xl pb-20 pt-40"
      >
        <motion.p variants={item} className="text-sm text-ember-400">
          DHA Phase 2, Lahore · 4.5★ (806 reviews)
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-4 max-w-2xl text-balance font-display text-5xl leading-[1.05] text-cream sm:text-6xl md:text-7xl"
        >
          Authentic BBQ.
          <br />
          <span className="italic text-gold-400">Bold Flavours.</span>
        </motion.h1>
        <motion.p variants={item} className="mt-6 max-w-md text-lg text-parchment/75">
          Freshly grilled BBQ and Pakistani favourites, served hot in the heart of DHA Lahore.
        </motion.p>
        <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/menu"
            className="rounded-sm bg-ember-500 px-7 py-3.5 font-medium text-char-950 shadow-ember transition hover:bg-ember-400"
          >
            View Menu
          </Link>
          <Link
            href="/reservations"
            className="rounded-sm border border-parchment/30 px-7 py-3.5 font-medium text-cream transition hover:border-cream"
          >
            Reserve a Table
          </Link>
          <Link
            href="/order"
            className="rounded-sm border border-parchment/30 px-7 py-3.5 font-medium text-cream transition hover:border-cream"
          >
            Order Now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
