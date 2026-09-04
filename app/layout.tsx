import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono, Courier_Prime } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const courierFont = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Arcade Vault · Portal Retro",
  description: "Arcade Vault — juega y compite por el high score.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${pixelFont.variable} ${monoFont.variable} ${courierFont.variable} h-full`}
    >
      <body className="h-full">
        <div className="av-bg" />
        <div className="av-noise" />
        <Nav />
        <main className="av-main">{children}</main>
        <footer
          style={{
            borderTop: "1px solid var(--line)",
            padding: "20px 32px",
            textAlign: "center",
            color: "var(--ink-faint)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
          }}
        >
          © 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0
        </footer>
      </body>
    </html>
  );
}
