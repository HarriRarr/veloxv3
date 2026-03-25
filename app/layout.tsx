import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Velox - Reddit Marketing for Solopreneurs",
  description: "Turn Reddit into your #1 Source of Revenue",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalFetch = window.fetch;
                Object.defineProperty(window, 'fetch', {
                  configurable: true,
                  enumerable: true,
                  get: () => originalFetch,
                  set: (val) => {
                    console.warn('Ignored attempt to set window.fetch');
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        className="bg-background text-foreground antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
