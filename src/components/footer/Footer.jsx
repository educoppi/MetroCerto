import s from "./Footer.module.css";

const links = [
    { id: "estoque", rotulo: "Estoque" },
    { id: "info", rotulo: "Info" },
    { id: "acompanhamento", rotulo: "Acompanhamento" },
    { id: "cadastro", rotulo: "Cadastrar tecido" },
];

export default function Footer({ tela, onNavegar = () => {} }) {
    const ano = new Date().getFullYear();

    return (
        <footer className={s.rodape}>
            <span className={s.rodape__fio} aria-hidden="true" />

            <div className={s.rodape__inner}>
                <button type="button" className={s.rodape__marca} onClick={() => onNavegar("home")}>
                    <span className={s.rodape__nome}>MAITÊ</span>
                    <span className={s.rodape__linha} aria-hidden="true" />
                    <span className={s.rodape__sub}>Decorações</span>
                </button>

                <nav className={s.rodape__nav} aria-label="Navegação do rodapé">
                    <ul>
                        {links.map((link) => (
                            <li key={link.id}>
                                <button
                                    type="button"
                                    className={tela === link.id ? `${s.rodape__link} ${s["rodape__link--ativo"]}` : s.rodape__link}
                                    aria-current={tela === link.id ? "page" : undefined}
                                    onClick={() => onNavegar(link.id)}
                                >
                                    {link.rotulo}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button type="button" className={s.rodape__topo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <span aria-hidden="true">↑</span> Voltar ao topo
                </button>
            </div>

            <div className={s.rodape__base}>
                <p>© {ano} Maitê Decorações. Todos os direitos reservados.</p>
                <p>Gestão de estoque de tecidos</p>
            </div>
        </footer>
    );
}
