"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function BuscaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "Iphone";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Faz a chamada para a nossa própria API Next.js que vai se encarregar do scraping!
  const buscarProdutos = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if(data.results) {
        setResults(data.results);
      }
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarProdutos(query);
  }, []);

  const handleSearchKeys = (e: any) => {
    if (e.key === 'Enter') {
      buscarProdutos(query);
    }
  }

  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "100px" }}>
      {/* Search Input Again for convenience */}
      <div className="search-wrapper" style={{ marginTop: 0, marginBottom: "24px" }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Busque produtos..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchKeys}
        />
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Resultados para "{query}"</h2>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          {results.length} resultados
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--accent-color)' }}>
          Pesquisando em tempo real...
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((prod) => (
            <div key={prod.id} className="card flex gap-4" onClick={() => router.push(`/produto?slug=${encodeURIComponent(prod.slug)}`)} style={{ cursor: "pointer" }}>
              <div style={{ width: "90px", height: "90px", background: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {prod.imageUrl ? (
                    <img src={prod.imageUrl} alt={prod.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ fontSize: "40px" }}>📦</div>
                  )}
              </div>
              <div className="flex-col justify-center" style={{ flex: 1 }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.3 }}>{prod.title}</div>
                <div className="flex gap-2" style={{ marginTop: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.7rem", padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }}>
                    🏪 {prod.storesCount} ofertas
                  </span>
                  <span style={{ fontSize: "0.7rem", padding: "2px 6px", background: "rgba(16,185,129,0.1)", borderRadius: "4px", color: "var(--accent-color)" }}>
                    Toque para ver todas →
                  </span>
                </div>
                
                <div className="flex justify-between items-center" style={{ marginTop: "12px" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>A partir de</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-color)" }}>U$ {prod.minPriceUsd}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>~ R$ {prod.minPriceBrl}</div>
                    <div className="badge-profit" style={{ fontSize: "0.6rem", marginTop: "2px", padding: "2px 4px" }}>Lucro Teto: R$ {prod.resellProfitBrl}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Busca() {
  return (
    <Suspense fallback={<div className="container" style={{paddingTop: "24px"}}>Carregando resultados...</div>}>
      <BuscaContent />
    </Suspense>
  )
}
