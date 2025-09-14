import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppConfig } from "@/config/app-config";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: AppConfig.title + " - Decentralized health data platform",
  description: AppConfig.description,
  icons: {
    icon: "/medicachan-logo.png",
  },

  openGraph: {
    title: AppConfig.title + " - Decentralized health data platform",
    description: AppConfig.description,
    url: "https://rizkyreza.fun",
    siteName: "MedicaChan",
    images: [
      {
        url: "/medicachan-logo.png",
        width: 1200,
        height: 630,
        alt: AppConfig.title + " - Decentralized health data platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: AppConfig.title + " - Decentralized health data platform",
    description: AppConfig.description,
    images: ["/medicachan-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
