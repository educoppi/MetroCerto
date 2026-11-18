import "./Footer.css";

const links = [
    { id: "estoque", rotulo: "Estoque" },
    { id: "info", rotulo: "Info" },
    { id: "acompanhamento", rotulo: "Acompanhamento" },
    { id: "cadastro", rotulo: "Cadastrar tecido" },
];

export default function Footer({ tela, onNavegar }) {
    const ano = new Date().getFullYear();

    return (
        <footer className="rodape">
            <span className="rodape__fio" aria-hidden="true" />

            <div className="rodape__inner">
                <button type="button" className="rodape__marca" onClick={() => onNavegar("home")}>
                    <span className="rodape__nome">MAITÊ</span>
                    <span className="rodape__linha" aria-hidden="true" />
                    <span className="rodape__sub">Decorações</span>
                </button>

                <nav className="rodape__nav" aria-label="Navegação do rodapé">
                    <ul>
                        {links.map((link) => (
                            <li key={link.id}>
                                <button
                                    type="button"
                                    className={tela === link.id ? "rodape__link rodape__link--ativo" : "rodape__link"}
                                    aria-current={tela === link.id ? "page" : undefined}
                                    onClick={() => onNavegar(link.id)}
                                >
                                    {link.rotulo}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button type="button" className="rodape__topo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <span aria-hidden="true">↑</span> Voltar ao topo
                </button>
            </div>

            <div className="rodape__base">
                <p>© {ano} Maitê Decorações. Todos os direitos reservados.</p>
                <p>Gestão de estoque de tecidos</p>
            </div>
        </footer>
    );
}
