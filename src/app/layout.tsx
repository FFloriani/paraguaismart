import type { Metadata } from "next";
import "./globals.css";

import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Paraguai Smart - Super App",
  description: "Busque produtos, rotas e dicas de compras no Paraguai com inteligência.",
  themeColor: "#0b0f19",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Top Dollar Bar */}
        <div className="top-dollar-bar">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            <span style={{ color: "var(--text-primary)" }}>Dólar Comercial: <span className="text-gold">R$ 5,03</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--text-primary)" }}>Paraguai: <span className="text-accent">R$ 5,14</span></span>
          </div>
        </div>

        {/* Main Content Area */}
        <main style={{ paddingBottom: "80px" }}>
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
