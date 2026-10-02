import Header from "../components/Header/Header";
import Footer from "../components/footer/Footer";
import "./Acompanhamento.css";

// Dados de exemplo: depois vêm do estado, de uma API ou do Estoque
const itens = [
  { id: 1, tecido: "Marrom", extraida: 12, inserida: 30 },
  { id: 2, tecido: "Floral", extraida: 5, inserida: 0 },
  { id: 3, tecido: "Sakura", extraida: 0, inserida: 20 },
];

export default function Acompanhamento() {
  return (
    <div className="pagina">
      <Header />

      <main className="acompanhamento">
        <h1 className="acompanhamento__titulo">ACOMPANHAMENTO</h1>

        <section className="acompanhamento__conteudo">
          {itens.map((item) => (
            <article key={item.id} className="acompanhamento-card">
              <h2 className="acompanhamento-card__tecido">{item.tecido}</h2>

              <dl className="acompanhamento-card__quantidades">
                <div className="acompanhamento-card__linha">
                  <dt>Extraída</dt>
                  <dd>{item.extraida} m</dd>
                </div>
                <div className="acompanhamento-card__linha">
                  <dt>Inserida</dt>
                  <dd>{item.inserida} m</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}