"use client";

import CTABanner from "./components/cta-banner";
import Features from "./components/features";
import Footer from "./components/footer";
import Hero from "./components/hero";
import HowItWorks from "./components/how-it-works";
import { Navbar } from "./components/navbar";
import Stats from "./components/stats";
import { motion } from "motion/react";

import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { useAuth } from "@/providers/auth-provider";
import { useUserProfile } from "@/hooks/use-backend";

export default function LandingPage() {
  const router = useRouter();
  const { isAuth, principal } = useAuth();

  const { data, error } = useUserProfile(principal?.toString() || "");

  useEffect(() => {
    if (isAuth && principal && data?.full_name && data.id && !error) {
      router.push("/dashboard");
    } else if (isAuth && principal && !data?.full_name) {
      if (isAuth === true && principal) {
        router.replace("/register");
      }
    }
  }, [isAuth, data?.full_name, data?.id, router, principal, error]);

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
