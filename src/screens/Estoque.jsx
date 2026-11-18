import { useEffect, useState } from 'react';
import "./Estoque.css";
import Rolo from '../components/Rolo/Rolo';
import RoloDetalhe from './RoloDetalhe';
import { retiradoPorEstampa } from '../data/tecidos';
import { useTecidos } from '../data/TecidosContext';

const CHAVE = 'metrocerto:estoque';

const carregar = () => {
    try {
        return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch {
        return {};
    }
};

export default function Estoque({ setTela }) {
    const { tecidos, ultimoId, erroArmazenamento, consumirRolagem } = useTecidos();
    const [selecionado, setSelecionado] = useState(null);
    const [registros, setRegistros] = useState(carregar);

    useEffect(() => {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(registros));
        } catch {
            return;
        }
    }, [registros]);

    useEffect(() => {
        if (!ultimoId) return;
        const espera = setTimeout(() => {
            if (!consumirRolagem()) return;
            document.getElementById(`rolo-${ultimoId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 350);
        return () => clearTimeout(espera);
    }, [ultimoId, consumirRolagem]);

    const irParaTopo = () =>
        setTimeout(() => document.getElementById('estoque')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);

    const abrir = (nome) => {
        setSelecionado(nome);
        irParaTopo();
    };

    const voltar = () => {
        setSelecionado(null);
        irParaTopo();
    };

    const tecidoAtual = tecidos.find((t) => t.nome === selecionado);

    if (tecidoAtual) {
        return (
            <section className="estoque-page">
                <RoloDetalhe
                    key={tecidoAtual.nome}
                    tecido={tecidoAtual}
                    dados={registros[tecidoAtual.nome] ?? {
                        iniciais: tecidoAtual.metrosIniciais,
                        retirados: retiradoPorEstampa(tecidoAtual.nome),
                        minimo: tecidoAtual.estoqueMinimo,
                    }}
                    onSalvar={(dados) => setRegistros((atual) => ({ ...atual, [tecidoAtual.nome]: dados }))}
                    onVoltar={voltar}
                />
            </section>
        );
    }

    return (
        <section className="estoque-page">
            <div className="estoque-main">
                <header className="estoque-topo">
                    <h2 className="estoque-titulo">Estoque</h2>
                    <p className="estoque-contagem">{tecidos.length} rolos cadastrados</p>
                </header>

                {erroArmazenamento && (
                    <p className="estoque-aviso" role="alert">
                        O rolo foi adicionado, mas não coube no armazenamento do navegador e sumirá ao recarregar a página.
                    </p>
                )}

                <div className="estoque-conteudo">
                    <ul className="rolos-grid">
                        {tecidos.map((tecido, i) => (
                            <li
                                className={`rolo-card ${tecido.id === ultimoId ? "rolo-card--novo" : ""}`}
                                key={tecido.id}
                                id={`rolo-${tecido.id}`}
                                style={{ "--i": i }}
                            >
                                {tecido.id === ultimoId && <span className="rolo-novo">Novo</span>}
                                <Rolo imagem={tecido.imagem} escala={tecido.escala} />

                                <div className="rolo-rodape">
                                    <p className="rolo-nome">
                                        <span className="rolo-rotulo">Rolo</span>
                                        {tecido.nome}
                                    </p>

                                    <button
                                        type="button"
                                        className="rolo-info-btn"
                                        onClick={() => abrir(tecido.nome)}
                                        aria-label={`Ver informações do rolo ${tecido.nome}`}
                                    >
                                        Info
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button type="button" className="rolo-add-btn" aria-label="Cadastrar novo rolo" onClick={() => setTela("cadastro")}>
                        <span aria-hidden="true">+</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
