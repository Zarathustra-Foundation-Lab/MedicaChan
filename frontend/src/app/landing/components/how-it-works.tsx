"use client";

import { Wallet, User, Activity, TrendingUp } from "lucide-react";
import React from "react";
import { motion } from "motion/react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description:
        "Login with Internet Identity for secure, decentralized access",
    },
    {
      icon: User,
      title: "Complete Profile",
      description: "Fill out your health profile with our step-by-step wizard",
    },
    {
      icon: Activity,
      title: "Daily Checkups",
      description:
        "Record your health metrics - all data is private by default",
    },
    {
      icon: TrendingUp,
      title: "Earn & Analyze",
      description:
        "Choose to publish data for rewards and get AI-powered insights",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="bg-muted/50 py-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="lg:text-4xl text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground lg:text-lg text-base mt-4">
            Simple steps to start earning from your health data
          </p>
        </motion.div>
        <motion.div
          className="grid gap-8 md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={index}
                className="text-center"
                variants={stepVariants}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-4 shadow-lg shadow-primary/30"
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <IconComponent className="h-6 w-6" />
                </motion.div>
                <motion.h3
                  className="font-semibold mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
