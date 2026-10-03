

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./Home.css";



export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <main>
        <h1 className="home-titulo">MAITÊ</h1>
        <hr className="home-linha" />
        <h2 className="home-subtitulo">Decorações</h2>

        <p className="home-texto">
            Aqui você gerencia todo o acervo de materiais, realiza o cadastro
            rápido de novos tecidos, controla os saldos do almoxarifado e acessa
            relatórios para manter o estoque sempre organizado.
        </p>
      </main>
      <Footer />
    </div>
  );
}