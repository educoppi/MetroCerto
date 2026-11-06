import { useEffect, useMemo, useState } from "react";

/**
 * Dashboard
 * ------------------------------------------------------------
 * Gráfico de barras (JavaScript + React, sem bibliotecas) que mostra
 * quantos metros foram retirados de cada rolo, do maior para o menor.
 *
 * Props:
 *   itens: [{ id, tecido, extraida, inserida?, cor? }]
 *     - `extraida` = metros retirados (é o que o gráfico mede)
 *     - `cor` (opcional) = cor da barra daquele rolo
 *   titulo: título da seção
 */

const css = `
.dashboard {
  text-align: left;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem); /* espaço até o conteúdo abaixo */
  --dash-text: var(--color-text, #6f6254);
  --dash-accent: var(--color-accent, #9a6545);
  --dash-bar: #cdb9a8;
  --dash-grid: rgb(111 98 84 / 0.18);
  --dash-label-w: clamp(5rem, 22%, 8rem);
  --dash-valor-w: 4.5rem;
  --dash-gap: 0.75rem;

  padding: clamp(1rem, 3vw, 2rem);
  border-radius: 1rem;
  background: #fff;
  color: var(--dash-text);
  box-shadow: 0 2px 12px rgb(111 98 84 / 0.08);
}

.dashboard__cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard__titulo {
  margin: 0;
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 500;
}

.dashboard__destaque {
  margin: 0;
  font-size: 0.95rem;
}

.dashboard__destaque strong { color: var(--dash-accent); }

.dashboard__vazio {
  margin: 0;
  padding: 2rem 0;
  text-align: center;
  font-style: italic;
}

/* ---------- Gráfico ---------- */
.dashboard__grafico {
  position: relative;
  padding-bottom: 1.75rem; /* espaço para os valores do eixo */
}

/* Eixo: ocupa exatamente a coluna das barras */
.dashboard__eixo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--dash-label-w) + var(--dash-gap));
  right: calc(var(--dash-valor-w) + var(--dash-gap));
  pointer-events: none;
}

.dashboard__marca {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed var(--dash-grid);
}

.dashboard__marca-valor {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translate(-50%, 100%);
  font-size: 0.75rem;
  opacity: 0.8;
}

.dashboard__linhas {
  position: relative; /* fica acima da grade */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dashboard__linha {
  display: grid;
  grid-template-columns: var(--dash-label-w) 1fr var(--dash-valor-w);
  align-items: center;
  gap: var(--dash-gap);
}

.dashboard__rotulo {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-serif, Georgia, serif);
  font-size: 1.15rem;
}

.dashboard__trilho {
  height: 1.75rem;
  border-radius: 0.5rem;
}

.dashboard__barra {
  height: 100%;
  min-width: 4px;
  border-radius: 0.5rem;
  background: var(--dash-bar);
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.dashboard__linha--lider .dashboard__barra { background: var(--dash-accent); }
.dashboard__linha--lider .dashboard__rotulo,
.dashboard__linha--lider .dashboard__valor { font-weight: 700; color: var(--dash-accent); }

.dashboard__valor {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-size: 0.95rem;
}

@media (max-width: 480px) {
  .dashboard { --dash-valor-w: 3.5rem; --dash-gap: 0.5rem; }
  .dashboard__rotulo { font-size: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard__barra { transition: none; }
}
`;

const NUM_DIVISOES = 4;

const formatar = (n) =>
  Number(n).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

// Arredonda o passo do eixo para valores "bonitos" (1, 2, 5, 10, 20, 50...)
function passoAgradavel(valor) {
  const expoente = Math.floor(Math.log10(valor));
  const base = 10 ** expoente;
  const fracao = valor / base;
  const fatorBonito = fracao <= 1 ? 1 : fracao <= 2 ? 2 : fracao <= 5 ? 5 : 10;
  return fatorBonito * base;
}

function calcularEscala(maximo) {
  const passo = passoAgradavel(maximo / NUM_DIVISOES);
  const teto = passo * Math.ceil(maximo / passo);
  const marcas = Array.from(
    { length: Math.round(teto / passo) + 1 },
    (_, i) => i * passo
  );
  return { teto, marcas };
}

export default function Dashboard({ itens = [], titulo = "Metros retirados por rolo" }) {
  // Dispara a animação de crescimento das barras depois da primeira pintura
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPronto(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { ranking, maximo, lideres, escala } = useMemo(() => {
    const lista = (Array.isArray(itens) ? itens : [])
      .map((item) => ({ ...item, extraida: Math.max(0, Number(item.extraida) || 0) }))
      .sort((a, b) => b.extraida - a.extraida);

    const max = lista.length ? lista[0].extraida : 0;
    return {
      ranking: lista,
      maximo: max,
      // empates: todos que chegaram ao máximo são destacados
      lideres: max > 0 ? lista.filter((i) => i.extraida === max) : [],
      escala: max > 0 ? calcularEscala(max) : null,
    };
  }, [itens]);

  const temDados = escala !== null;

  return (
    <section className="dashboard" aria-labelledby="dashboard-titulo">
      <style>{css}</style>
      <div className="dashboard__cabecalho">
        <h2 id="dashboard-titulo" className="dashboard__titulo">{titulo}</h2>

        {temDados && (
          <p className="dashboard__destaque">
            {lideres.length === 1 ? "Mais retirado: " : "Mais retirados: "}
            <strong>{lideres.map((l) => l.tecido).join(", ")}</strong>
            {" — "}
            {formatar(maximo)} m
          </p>
        )}
      </div>

      {!temDados ? (
        <p className="dashboard__vazio">Nenhum metro foi retirado ainda.</p>
      ) : (
        <div className="dashboard__grafico">
          {/* linhas de grade + valores do eixo (decorativo) */}
          <div className="dashboard__eixo" aria-hidden="true">
            {escala.marcas.map((marca) => (
              <span
                key={marca}
                className="dashboard__marca"
                style={{ left: `${(marca / escala.teto) * 100}%` }}
              >
                <span className="dashboard__marca-valor">{formatar(marca)}</span>
              </span>
            ))}
          </div>

          <ol className="dashboard__linhas">
            {ranking.map((item) => {
              const percentual = (item.extraida / escala.teto) * 100;
              const lider = lideres.includes(item);

              return (
                <li
                  key={item.id ?? item.tecido}
                  className={`dashboard__linha${lider ? " dashboard__linha--lider" : ""}`}
                >
                  <span className="dashboard__rotulo">{item.tecido}</span>

                  <div className="dashboard__trilho" aria-hidden="true">
                    <div
                      className="dashboard__barra"
                      style={{
                        width: pronto ? `${percentual}%` : "0%",
                        ...(item.cor ? { backgroundColor: item.cor } : {}),
                      }}
                    />
                  </div>

                  <span className="dashboard__valor">{formatar(item.extraida)} m</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}