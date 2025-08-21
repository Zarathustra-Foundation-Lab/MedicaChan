import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Logo } from "./navbar/logo";
import { AppConfig } from "@/config/app-config";
import { Badge } from "@/components/ui/badge";
import { Brain, Globe } from "lucide-react";
import { motion } from "motion/react";

const footerLinks = [
  {
    title: "Privacy Policy",
    href: "#privacy-policy",
  },
  {
    title: "Terms of Service",
    href: "#terms-of-service",
  },
];

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <footer className="border-t mt-40 bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Logo />
            <motion.ul
              className="mt-6 flex items-center gap-4 flex-wrap"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {footerLinks.map(({ title, href }) => (
                <motion.li key={title} variants={itemVariants}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {title}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        <Separator />

        <motion.div
          className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 xl:px-0 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="text-muted-foreground text-center sm:text-start">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" target="_blank">
              {AppConfig.title}
            </Link>
            . All rights reserved.
          </span>

          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="mr-2">Built on</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant="outline">
                <Globe className="size-3" />
                Internet Computer
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Badge variant="outline">
                <Brain className="size-3" />
                Fetch AI
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
