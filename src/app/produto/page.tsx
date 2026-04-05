"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ProdutoContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const [product, setProduct] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States para filtros
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [sortOrder, setSortOrder] = useState("price_asc");

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/product?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.product) setProduct(data.product);
        if (data.offers) setOffers(data.offers);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "40px", textAlign: "center" }}>
        <div style={{ color: "var(--accent-color)", fontSize: "1.1rem", fontWeight: 600 }}>
          Carregando ofertas de todas as lojas...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: "40px", textAlign: "center" }}>
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  const uniqueStores = Array.from(new Set(offers.map(o => o.storeName))).filter(Boolean).sort();

  const handleToggleStore = (store: string) => {
    setSelectedStores(prev => prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]);
  };

  const handleApplyPrice = () => {
    setPriceRange({
      min: parseFloat(minPrice) || 0,
      max: parseFloat(maxPrice) || 999999
    });
  };

  const filteredOffers = offers
    .filter(o => {
      if (selectedStores.length > 0 && !selectedStores.includes(o.storeName)) return false;
      const price = parseFloat(o.priceUsd) || 0;
      if (price < priceRange.min || price > priceRange.max) return false;
      return true;
    })
    .sort((a, b) => {
      const pA = parseFloat(a.priceUsd) || 0;
      const pB = parseFloat(b.priceUsd) || 0;
      return sortOrder === "price_asc" ? pA - pB : pB - pA;
    });

  return (
    <div className="container" style={{ paddingTop: "16px", paddingBottom: "100px", maxWidth: "900px" }}>
      {/* Header do Produto (Span Full Width) */}
      <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
        <div className="flex gap-4 items-center">
          <div style={{ width: "100px", height: "100px", background: "#fff", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>📦</div>
            )}
          </div>
          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.3 }}>{product.title}</h1>
            <div style={{ marginTop: "8px" }}>
              <span className="text-secondary" style={{ fontSize: "0.85rem" }}>A partir de </span>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-color)" }}>US$ {product.minPriceUsd}</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>R$ {product.minPriceBrl}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Sidebar de Filtros */}
        <div className="card" style={{ width: "100%", maxWidth: "260px", padding: "20px", flexShrink: 0, position: "sticky", top: "20px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", color: "#3b82f6" }}>Filtros</h3>
          
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "12px", fontWeight: 600 }}>Lojas</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
              {uniqueStores.map(store => (
                <label key={store} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedStores.includes(store)} 
                    onChange={() => handleToggleStore(store)} 
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#3b82f6" }}
                  />
                  {store}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "12px", fontWeight: 600 }}>Preço (US$)</h4>
            <div style={{ display: "flex", gap: "8px" }}>
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "white", width: "100%" }}
              />
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "white", width: "100%" }}
              />
              <button 
                onClick={handleApplyPrice}
                style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "6px", padding: "0 12px", fontWeight: 700, cursor: "pointer" }}
              >
                Ok
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "12px", fontWeight: 600 }}>Ordenar por</h4>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "white" }}
            >
              <option value="price_asc">Menor Preço ↑</option>
              <option value="price_desc">Maior Preço ↓</option>
            </select>
          </div>
        </div>

        {/* Lista Principal */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div className="flex justify-between items-center" style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              <span className="text-accent">{filteredOffers.length}</span> ofertas encontradas
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {filteredOffers.map((offer, idx) => (
              <div key={idx} className="card" style={{ padding: "16px" }}>
                <div className="flex gap-4 items-center">
                  <div style={{ width: "60px", height: "60px", background: "#fff", borderRadius: "8px", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {offer.productImgUrl ? (
                      <img src={offer.productImgUrl} alt={offer.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ fontSize: "24px" }}>📦</div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {offer.title || offer.storeName}
                    </div>
                    <div className="flex items-center gap-2" style={{ marginTop: "4px" }}>
                      {offer.storeLogoUrl && (
                        <img src={offer.storeLogoUrl} alt={offer.storeName} style={{ height: "20px", objectFit: "contain", borderRadius: "4px", background: "#fff" }} />
                      )}
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{offer.storeName}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-color)" }}>US$ {offer.priceUsd}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>R$ {offer.priceBrl}</div>
                  </div>
                </div>

                <div className="flex gap-2" style={{ marginTop: "12px" }}>
                  {offer.whatsappUrl && (
                    <a href={offer.whatsappUrl} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#25D366", color: "#fff", padding: "10px", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem" }}>
                      WhatsApp
                    </a>
                  )}
                  {offer.storeUrl && (
                    <a href={offer.storeUrl} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "var(--bg-color-lighter)", color: "#fff", padding: "10px", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", border: "1px solid var(--border-color)" }}>
                      Ver na Loja
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {filteredOffers.length === 0 && (
              <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                Nenhuma oferta encontrada para estes filtros.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProdutoPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: "40px", textAlign: "center", color: "var(--accent-color)" }}>Carregando...</div>}>
      <ProdutoContent />
    </Suspense>
  );
}
