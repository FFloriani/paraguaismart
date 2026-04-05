export default function Dicas() {
  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "100px" }}>
      <h1 className="text-accent" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>
        Manual da Fronteira
      </h1>
      <p className="text-secondary" style={{ fontSize: "0.9rem", marginBottom: "24px" }}>
        Segredos, limites e "jeitinhos" lícitos para você não ter dor de cabeça com a Receita.
      </p>

      <div className="flex flex-col gap-4">
        
        {/* Card Regra da Cota */}
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.5rem" }}>🛂</span> A Regra dos US$ 500
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>
            Via terrestre, seu limite de isenção é de <b>US$ 500</b> por pessoa a cada 30 dias. Acima disso, paga-se 50% de imposto sobre o excedente.
          </p>
          <div className="badge-profit" style={{ display: "inline-block" }}>
            Dica de Ouro:
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.5, marginTop: "8px" }}>
            Celulares, relógios de pulso e câmeras ("um de cada") para uso pessoal <b>NÃO</b> entram na cota. O segredo? Jogue a caixa fora e passe com o produto no bolso ou punho como se fosse seu de uso contínuo!
          </p>
        </div>

        {/* Card Dicas de Ônibus */}
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.5rem" }}>🚌</span> Rota do Comboio
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>
            Os ônibus de turismo ("sacoleiros") costumam ser parados no posto da PRF. Viajar de BlaBlaCar, carro particular com famílias ou voos convencionais reduzem as chances de pente-fino rigoroso.
          </p>
        </div>

        {/* Card Declare Fácil */}
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.5rem" }}>📄</span> Como Declarar Online
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Se for ultrapassar a cota absurdamente, faça a "DBA" (Declaração de Bens) pelo app da Receita <b>antes</b> de cruzar a ponte. Pagar 50% é melhor que perder 100% da mercadoria por omissão.
          </p>
        </div>

      </div>
    </div>
  );
}
