"use client";

import CTABanner from "./components/cta-banner";
import Features from "./components/features";
import Footer from "./components/footer";
import Hero from "./components/hero";
import HowItWorks from "./components/how-it-works";
import { Navbar } from "./components/navbar";
import Stats from "./components/stats";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTABanner />
        <Footer />
      </motion.main>
    </>
  );
}
