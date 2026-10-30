import Header from "../components/Header/Header";
import Footer from "../components/footer/Footer";
import "./Home.css";


export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <main>
        <h1>MAITÊ</h1>
        <h2>Decorações</h2>
        <p>Aqui você gerencia todo o acervo de materiais, realiza o cadastro rápido de novos tecidos, controla os saldos do almoxarifado e acessa relatórios para manter o estoque sempre organizado.</p>
      </main>
      <Footer />
    </div>
  );
}