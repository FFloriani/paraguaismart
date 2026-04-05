"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: any) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "24px" }}>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Paraguai <span className="text-accent">Smart</span></h1>
          <p className="text-secondary" style={{ fontSize: "0.85rem", marginTop: "4px" }}>Compre com inteligência, lucre mais.</p>
        </div>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
      </div>

      {/* Main Search Input */}
      <div className="search-wrapper">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Busque perfumes, eletrônicos, marcas..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Hero Banner / Marketing */}
      <div className="hero-banner shimmer-effect">
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Sua viagem mais lucrativa</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>Encontre os menores preços no Paraguai, simule sua rota e saiba o quanto vai lucrar na revenda.</p>
        <button style={{ 
          background: "var(--accent-color)", 
          color: "#fff", 
          border: "none", 
          padding: "10px 24px", 
          borderRadius: "8px", 
          fontWeight: 600,
          opacity: 0.9,
          cursor: "pointer"
        }}>
          Simular Rota Agora
        </button>
      </div>

      {/* Quick Categories */}
      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px" }}>Categorias em Alta</h3>
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
          
          <div className="card" style={{ flex: "0 0 110px", textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📱</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>Smartphones</div>
          </div>
          
          <div className="card" style={{ flex: "0 0 110px", textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>✨</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>Perfumes Árabes</div>
          </div>
          
          <div className="card" style={{ flex: "0 0 110px", textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>💻</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>Informática</div>
          </div>
          
          <div className="card" style={{ flex: "0 0 110px", textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎮</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>Videogames</div>
          </div>
          
        </div>
      </div>

      {/* Featured Products (Mockup) */}
      <div style={{ marginTop: "24px", marginBottom: "40px" }}>
        <div className="flex justify-between items-center" style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Alta Lucratividade</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-color)", fontWeight: 600 }}>Ver Todos</span>
        </div>

        <div className="flex flex-col gap-4">
          
          {/* Product Card 1 */}
          <div className="card flex gap-4">
            <div style={{ width: "80px", height: "80px", background: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
               {/* Usando um Emoji p/ protótipo, dps substituiremos pela img */}
               <div style={{ fontSize: "40px" }}>🕋</div>
            </div>
            <div className="flex-col justify-center" style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.3 }}>Perfume Lattafa Asad Eau de Parfum 100ml</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>Na <span style={{color:"#fff"}}>Nissei</span> e mais 12 lojas</div>
              <div className="flex justify-between items-center" style={{ marginTop: "8px" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>U$ 21,50</div>
                <div className="badge-profit">Lucro até R$ 120</div>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="card flex gap-4">
            <div style={{ width: "80px", height: "80px", background: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <div style={{ fontSize: "40px" }}>📱</div>
            </div>
            <div className="flex-col justify-center" style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.3 }}>Apple iPhone 15 Pro Max 256GB Titanium</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>Na <span style={{color:"#fff"}}>Cellshop</span> e mais 4 lojas</div>
              <div className="flex justify-between items-center" style={{ marginTop: "8px" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>U$ 1.150,00</div>
                <div className="badge-profit">Lucro até R$ 900</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
