import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "./animated-grid-pattern";
import { AppConfig } from "@/config/app-config";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/providers/auth-provider";

export default function CTABanner() {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <section className="px-6">
      <motion.div
        className="border relative overflow-hidden my-20 w-full dark:bg-background text-foreground max-w-screen-lg mx-auto rounded-2xl py-10 md:py-16 px-6 md:px-14"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_right,white,rgba(255,255,255,0.6),transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_top_left,white,rgba(255,255,255,0.6),transparent)]",
            "inset-x-0 inset-y-0 h-[200%] skew-y-12"
          )}
        />
        <motion.div
          className="relative z-0 flex flex-col gap-3"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-semibold">
            Ready to Take Control?
          </h3>
          <p className="mt-2 text-base">
            Join thousands of users already earning from their health data with{" "}
            <span className="font-bold">{AppConfig.title}</span>
          </p>
        </motion.div>
        <motion.div
          className="relative z-0 mt-14 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={handleLogin}
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started <ArrowUpRight className="!h-5 !w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
