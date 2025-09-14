"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimpleTypewriter } from "@/components/ui/typewriter-effect";
import {
  ArrowUpRight,
  ChevronsRight,
  Stethoscope,
  Heart,
  Activity,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
import { useAuth } from "@/providers/auth-provider";

const Hero = () => {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-[100dvh] flex flex-col items-center pt-32 pb-28 px-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900/20" />

      {/* Floating Health Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-32 left-10 text-emerald-200 dark:text-emerald-800"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Stethoscope className="w-16 h-16 opacity-50" />
        </motion.div>

        <motion.div
          className="absolute top-48 right-16 text-green-200 dark:text-green-800"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Heart className="w-12 h-12 opacity-60" />
        </motion.div>

        <motion.div
          className="absolute bottom-48 left-20 text-purple-200 dark:text-purple-800"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Activity className="w-14 h-14 opacity-40" />
        </motion.div>

        <motion.div
          className="absolute top-64 left-1/4 text-indigo-200 dark:text-indigo-800"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Shield className="w-10 h-10 opacity-30" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-1/4 text-emerald-200 dark:text-emerald-800"
          animate={{
            y: [0, -25, 0],
            rotate: [0, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <Zap className="w-12 h-12 opacity-45" />
        </motion.div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-teal-600/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-emerald-600/10 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.div
        className="md:mt-6 flex items-center justify-center relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 rounded-full py-1 border border-emerald-500/30 backdrop-blur-sm">
              <Heart className="w-3 h-3 mr-1" />
              Built on Internet Computer (ICP)
            </Badge>
          </motion.div>

          <motion.h1
            className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-semibold !leading-[1.2] tracking-tight flex items-center justify-center bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 dark:from-white dark:via-emerald-100 dark:to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SimpleTypewriter
              text="Own Your Health Data, Earn Rewards"
              typeSpeed={100}
              showCursor={true}
            />
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[60ch] xs:text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Securely store your daily health checkups, control your privacy, and
            earn $MEDCN tokens by contributing to AI-powered health research.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={handleLogin}
                size="lg"
                className="w-full sm:w-auto rounded-lg text-base shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Get Started <ArrowUpRight className="!h-5 !w-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={scrollToFeatures}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-lg text-base dark:bg-background dark:hover:bg-background/50 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 border-emerald-200 dark:border-emerald-800"
              >
                Learn More <ChevronsRight className="!h-5 !w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Health Data Visualization */}
      <motion.div
        className="absolute bottom-20 right-10 z-10 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-emerald-200/50 dark:border-emerald-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Health Metrics
            </span>
          </div>
          <div className="flex gap-1">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-emerald-500 rounded-full"
                initial={{ height: 8 }}
                animate={{ height: Math.random() * 24 + 8 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.button
          onClick={scrollToFeatures}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-current rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
