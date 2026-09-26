import "./Estoque.css";
import marrom from '../assets/Images/marrom.png';
import cinza from '../assets/Images/cinza.png';
import morangos from '../assets/Images/morangos.png';
import amarelo from '../assets/Images/amarelo.png';
import floral from '../assets/Images/floral.png';
import sakura from '../assets/Images/sakura.png';

const tecidos = [
  { nome: "Marrom", imagem: marrom },
  { nome: "Cinza", imagem: cinza },
  { nome: "Morangos", imagem: morangos },
  { nome: "Amarelo", imagem: amarelo },
  { nome: "Floral", imagem: floral },
  { nome: "Sakura", imagem: sakura },
];

export default function Estoque() {
    return (
        <div className="estoque-page">
            <header className="estoque-header">
                <div className="estoque-logo">
                    <h1>MAITÊ</h1>
                    <span>Decorações</span>
                </div>

                <nav className="estoque-nav">
                    <a href="#" className="ativo">ESTOQUE</a>
                    <a href="#">INFO</a>
                    <a href="#">ACOMPANHAMENTO</a>
                </nav>

                <a href="#" className="estoque-cadastrar">CADASTRAR TECIDO</a>
            </header>

            <main className="estoque-main">
                <h2 className="estoque-titulo">ESTOQUE</h2>

                <div className="estoque-conteudo">
                    <div className="rolos-grid">
                        {tecidos.map((tecido) => (
                            <div className="rolo-card" key={tecido.nome}>
                                <div className="rolo-icone">
                                    <div className="rolo-topo">
                                        <div className="rolo-furo"></div>
                                    </div>
                                    <div className="rolo-corpo"></div>
                                    <div
                                        className="rolo-tecido"
                                        style={{ backgroundImage: `url(${tecido.imagem})` }}
                                    ></div>
                                </div>

                                <p className="rolo-nome">Rolo: {tecido.nome}</p>

                                <button className="rolo-info-btn">Info</button>
                            </div>
                        ))}
                    </div>

                    <button className="rolo-add-btn">+</button>
                </div>
            </main>
        </div>
    );
}