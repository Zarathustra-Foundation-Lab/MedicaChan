"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      value: 1000,
      suffix: "+",
      label: "Health Records Stored",
    },
    {
      value: 10000,
      suffix: "+",
      label: "$MEDCN Tokens Distributed",
    },
    {
      value: 100,
      suffix: "%",
      label: "Data Privacy Guaranteed",
    },
  ];

  const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
    const formatNumber = (num: number) => {
      const rounded = Math.round(num);
      return rounded.toLocaleString();
    };

    return (
      <span>
        {formatNumber(value)}
        {suffix}
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <section
      ref={ref}
      className="max-w-screen-xl mx-auto py-32 px-6 xl:px-0 border-b-5 border-dashed"
    >
      <motion.div
        className="grid gap-8 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="text-center"
            variants={statVariants}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <motion.div
              className="text-4xl font-bold text-primary mb-2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2 + 0.3,
                type: "spring",
                stiffness: 100,
              }}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
            </motion.div>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: index * 0.2 + 0.8 }}
            >
              {stat.label}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Stats;
