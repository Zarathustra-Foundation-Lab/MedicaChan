import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, CheckCircle, Coins, Shield } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
    },
  };

  const listItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const features = [
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your health data is private by default. You decide what to share and when.",
      iconBg: "bg-emerald-100 dark:bg-emerald-900",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      items: [
        "End-to-end encryption",
        "Granular privacy controls",
        "Your keys, your data",
      ],
    },
    {
      icon: Coins,
      title: "Earn Rewards",
      description:
        "Get DHT tokens when you share your anonymized data for research.",
      iconBg: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      items: [
        "10 DHT per public checkup",
        "Bonus rewards for consistency",
        "Stake tokens for governance",
      ],
    },
    {
      icon: Brain,
      title: "AI Insights",
      description:
        "Get personalized health insights powered by Fetch AI and ASI1.",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
      items: [
        "Health trend analysis",
        "Early warning system",
        "Personalized recommendations",
      ],
    },
  ];

  return (
    <section
      id="features"
      className="max-w-screen-xl mx-auto py-28 px-6 xl:px-0"
    >
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="lg:text-4xl text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Why Choose DeHealth?
        </motion.h2>
        <motion.p
          className="text-muted-foreground lg:text-lg text-base mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Take control of your health data with Web3 technology
        </motion.p>
      </motion.div>

      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="group"
          >
            <Card className="h-full transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-black/5 dark:group-hover:shadow-white/5">
              <CardHeader>
                <div className="flex mb-4">
                  <motion.div
                    className={`${feature.iconBg} p-2 rounded-full`}
                    variants={iconVariants}
                    transition={{
                      duration: 0.5,
                      delay: 0.3,
                      ease: "backOut",
                    }}
                  >
                    <feature.icon className={`size-8 ${feature.iconColor}`} />
                  </motion.div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.ul
                  className="space-y-2 text-sm text-muted-foreground"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.4,
                      },
                    },
                  }}
                >
                  {feature.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      className="flex items-center gap-2"
                      variants={listItemVariants}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
