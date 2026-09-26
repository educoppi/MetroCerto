import "./Estoque.css";

const tecidos = [
    { nome: "Marrom", imagem: "/images/tecidos/marrom.png" },
    { nome: "Cinza", imagem: "/images/tecidos/cinza.png" },
    { nome: "Morangos", imagem: "/images/tecidos/morangos.png" },
    { nome: "Amarelo", imagem: "/images/tecidos/amarelo.png" },
    { nome: "Floral", imagem: "/images/tecidos/floral.png" },
    { nome: "Sakura", imagem: "/images/tecidos/sakura.png" },
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