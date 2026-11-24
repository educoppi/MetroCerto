import { useEffect, useState } from 'react';
import "./Estoque.css";
import Rolo from '../components/Rolo/Rolo';
import RoloDetalhe from './RoloDetalhe';
import { doBackend, situacaoRolo } from '../data/tecidos';
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
    const { tecidos, registros: retiradas, atualizar, ultimoId, backendOk, consumirRolagem } = useTecidos();
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
        const situacao = situacaoRolo(tecidoAtual, retiradas);
        const remoto = doBackend(tecidoAtual);
        const calculado = { iniciais: situacao.metrosIniciais, retirados: situacao.retirado, minimo: tecidoAtual.estoqueMin };

        // Rolo do backend: salva saldo e mínimo no servidor (retirados vêm dos registros).
        // Rolo local: continua salvando os ajustes só no navegador.
        const salvar = remoto
            ? (dados) =>
                  atualizar(tecidoAtual.id, {
                      nome: tecidoAtual.nome,
                      saldoAtual: Math.max(Number(dados.iniciais) - situacao.retirado, 0),
                      estoqueMin: Number(dados.minimo),
                  })
            : (dados) => setRegistros((atual) => ({ ...atual, [tecidoAtual.nome]: dados }));

        return (
            <section className="estoque-page">
                <RoloDetalhe
                    key={tecidoAtual.nome}
                    tecido={tecidoAtual}
                    dados={remoto ? calculado : registros[tecidoAtual.nome] ?? calculado}
                    remoto={remoto}
                    onSalvar={salvar}
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

                {!backendOk && (
                    <p className="estoque-aviso" role="alert">
                        Não foi possível conectar ao servidor. Exibindo apenas os rolos salvos no navegador.
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
                                <Rolo imagem={tecido.estampa} escala={tecido.escala} />

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
