"use client";
import { useState } from "react";

export default function Rotas() {
  const [origem, setOrigem] = useState("");
  const [chegadaPrevista, setChegadaPrevista] = useState("06:00");
  const [saidaPrevista, setSaidaPrevista] = useState("14:00");

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Trip State
  const [buserData, setBuserData] = useState<any>(null);
  const [tripData, setTripData] = useState<any>(null);

  const handleSearch = async () => {
    if (!origem) return;
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      // 1. Calc Fake Distance for Car
      let dist = Math.floor(Math.random() * 800) + 300;
      if (origem.toLowerCase().includes("são paulo") || origem.toLowerCase().includes("sp")) {
        dist = 1050;
      } else if (origem.toLowerCase().includes("curitiba")) {
        dist = 640;
      }
      const pricePerKm = 0.58; 
      const tollsEstimated = Math.floor(dist * 0.12);
      const horasViagem = Math.floor(dist / 80); // Média de 80km/h

      // Lógica reversa de horários
      let sugestaoSaida = "";
      if (chegadaPrevista) {
        const [horasCh, minCh] = chegadaPrevista.split(":").map(Number);
        let dataAux = new Date();
        dataAux.setHours(horasCh, minCh, 0, 0);
        dataAux.setHours(dataAux.getHours() - horasViagem);
        
        let prefixo = "Hoje";
        if (dataAux.getHours() > horasCh || horasViagem > 24) {
          prefixo = "Um dia antes";
        }
        
        const formatoHora = dataAux.getHours().toString().padStart(2, '0') + ":" + dataAux.getMinutes().toString().padStart(2, '0');
        sugestaoSaida = `${prefixo} às ${formatoHora}`;
      }

      setTripData({
        km: dist,
        horas: horasViagem,
        gasolina: (dist * pricePerKm).toFixed(2),
        pedagio: tollsEstimated.toFixed(2),
        totalIda: (dist * pricePerKm + tollsEstimated).toFixed(2),
        sugestaoSaida
      });

      // 2. Search real Buser API prices
      const res = await fetch(`/api/rotas?origem=${encodeURIComponent(origem)}`);
      const apiData = await res.json();
      
      setBuserData(apiData);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "100px" }}>
      <h1 className="text-accent" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>
        Rotas & Custo de Viagem
      </h1>
      <p className="text-secondary" style={{ fontSize: "0.9rem", marginBottom: "24px" }}>
        Descubra seu custo logístico e confira opções para chegar ao Paraguai (Ponte da Amizade).
      </p>

      {/* Rota Form */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Origem (Sua Cidade)</label>
          <input 
            type="text" 
            placeholder="Ex: São Paulo, SP" 
            className="search-input" 
            style={{ paddingLeft: "16px", borderRadius: "8px" }}
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Destino</label>
          <input 
            type="text" 
            className="search-input" 
            style={{ paddingLeft: "16px", color: "var(--accent-color)", borderRadius: "8px" }}
            value="Ciudad del Este (Paraguai)"
            disabled
          />
        </div>
        
        {/* Novos Campos de Horário */}
        <div className="flex gap-3" style={{ marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Quero chegar lá às (Ida)</label>
            <input 
              type="time" 
              className="search-input" 
              style={{ paddingLeft: "12px", borderRadius: "8px", color: "var(--text-primary)" }}
              value={chegadaPrevista}
              onChange={(e) => setChegadaPrevista(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Quero ir embora às (Volta)</label>
            <input 
              type="time" 
              className="search-input" 
              style={{ paddingLeft: "12px", borderRadius: "8px", color: "var(--text-primary)" }}
              value={saidaPrevista}
              onChange={(e) => setSaidaPrevista(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleSearch}
          disabled={!origem || isSearching}
          style={{ 
            width: "100%",
            background: origem ? "var(--accent-color)" : "var(--bg-color-lighter)", 
            color: origem ? "#fff" : "var(--text-secondary)", 
            border: "none", 
            padding: "14px", 
            borderRadius: "8px", 
            fontWeight: 700,
            cursor: origem && !isSearching ? "pointer" : "not-allowed",
            transition: "all 0.2s"
          }}>
          {isSearching ? "Calculando logística..." : "Planejar Minha Rota"}
        </button>
      </div>

      {hasSearched && tripData && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Section 1: Vou de Carro */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🚗</span> Simulador "Vou de Carro"
            </h3>
            <div className="card" style={{ border: "1px solid var(--accent-color)", background: "rgba(16, 185, 129, 0.05)" }}>
              <div className="flex justify-between" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Distância Estimada</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>~ {tripData.km} km</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Tempo Dirigindo</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>~ {tripData.horas} hs</div>
                </div>
              </div>
              
              {/* Sugestão de Horário Inteligente */}
              {tripData.sugestaoSaida && (
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px", marginBottom: "16px", borderLeft: "4px solid var(--accent-color)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>⏰ Melhor horário para você sair de casa:</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{tripData.sugestaoSaida}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "4px" }}>Para conseguir chegar na ponte Paraguai às {chegadaPrevista}</div>
                </div>
              )}
              
              <div style={{ marginBottom: "16px" }}>
                <div className="flex justify-between" style={{ marginBottom: "8px", fontSize: "0.85rem" }}>
                  <span>Gasolina (Estimativa)</span>
                  <span style={{ fontWeight: 600 }}>R$ {tripData.gasolina}</span>
                </div>
                <div className="flex justify-between" style={{ marginBottom: "8px", fontSize: "0.85rem" }}>
                  <span>Pedágios (Estimativa)</span>
                  <span style={{ fontWeight: 600 }}>R$ {tripData.pedagio}</span>
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Custo Estimado (Só Ida):</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--alert-usd)" }}>
                  R$ {tripData.totalIda}
                </span>
              </div>
              
              <div style={{ marginTop: "16px", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4, textAlign: "center" }}>
                💡 <strong>Dica de Revendedor:</strong> Multiplique por 2 (Ida e Volta). Suas compras na viagem precisam ter pelo menos <strong style={{ color: "var(--alert-usd)" }}>R$ {(tripData.totalIda * 2).toFixed(2)}</strong> de Margem de Lucro para sua viagem "se pagar".
              </div>
            </div>
          </div>

          {/* Section 2: Onibus e Excursoes */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🚌</span> Melhores Opções de Transporte
            </h3>
            
            <div className="flex flex-col gap-4">
              {/* Opção Ônibus / Buser REAL dividida em IDA e VOLTA */}
              <div className="card flex flex-col gap-4">
                {/* Viagem de Ida */}
                <div className="flex gap-4 items-center">
                  <div style={{ fontSize: "28px" }}>👉</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>Ida (Buser)</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      {buserData?.horaRealSaida ? (
                        <>Saindo às {buserData.horaRealSaida} • Chegada às <strong style={{ color: "var(--accent-color)" }}>{buserData.horaRealChegada}</strong> no dia seguinte</>
                      ) : (
                        <>Chegada no PY aprox. às <strong style={{ color: "var(--accent-color)" }}>{chegadaPrevista}</strong></>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {buserData?.menorPreco > 0 ? (
                      <>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>R$ {buserData.menorPreco}</div>
                        {buserData.horaRealSaida && <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Preço Exato</div>}
                      </>
                    ) : (
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>Consultar</div>
                    )}
                  </div>
                </div>

                {/* Viagem de Volta */}
                <div className="flex gap-4 items-center pt-3" style={{ borderTop: "1px dashed var(--border-color)" }}>
                  <div style={{ fontSize: "28px" }}>👈</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>Volta (Buser)</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      Saída do PY aprox. às <strong style={{ color: "var(--alert-usd)" }}>{saidaPrevista}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {buserData?.menorPreco > 0 ? (
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>R$ {Math.floor(buserData.menorPreco * 1.05)}</div>
                    ) : (
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>Consultar</div>
                    )}
                  </div>
                </div>

                {/* Resumo Buser */}
                {buserData?.menorPreco > 0 && (
                  <div className="flex justify-between items-center mt-2 p-3" style={{ background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Total Passagens:</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-color)" }}>R$ {buserData.menorPreco + Math.floor(buserData.menorPreco * 1.05)}</span>
                  </div>
                )}

                {buserData?.linkDiretoBuser && (
                  <a href={buserData.linkDiretoBuser} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: "#E5007B", color: "#fff", padding: "12px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, marginTop: "8px" }}>
                    Reservar Ida e Volta na Buser
                  </a>
                )}
              </div>

              {/* Opção BlaBlaCar Mock */}
              <div className="card flex gap-4 items-center opacity-75">
                <div style={{ fontSize: "32px" }}>🚗</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>BlaBlaCar (Caronas)</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Rápido • Preço motoristas</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--alert-usd)" }}>~R$ 150</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Custo médio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
