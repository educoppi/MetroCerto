import { useMemo, useState } from 'react';
import { retiradas } from '../data/tecidos';
import { useTecidos } from '../data/TecidosContext';
import './Info.css';

const PASSO = 5;

const colunas = [
    { chave: 'data', rotulo: 'Data' },
    { chave: 'rolo', rotulo: 'Id rolo' },
    { chave: 'estampa', rotulo: 'Estampa' },
    { chave: 'metros', rotulo: 'Metros retirados', numerica: true },
];

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
const formatoHora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const formatoMetros = (valor) =>
    valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const comparar = (a, b, chave) => {
    if (chave === 'metros') return a.metros - b.metros;
    if (chave === 'data') return new Date(a.data) - new Date(b.data);
    return String(a[chave]).localeCompare(String(b[chave]), 'pt-BR');
};

export default function Info() {
    const { tecidos } = useTecidos();
    const tecidoPorNome = useMemo(() => Object.fromEntries(tecidos.map((t) => [t.nome, t])), [tecidos]);
    const [busca, setBusca] = useState('');
    const [ordem, setOrdem] = useState({ chave: 'data', direcao: 'desc' });
    const [visiveis, setVisiveis] = useState(PASSO);

    const filtradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const lista = termo
            ? retiradas.filter((r) => r.estampa.toLowerCase().includes(termo) || r.rolo.toLowerCase().includes(termo))
            : retiradas;
        const fator = ordem.direcao === 'asc' ? 1 : -1;
        return [...lista].sort((a, b) => comparar(a, b, ordem.chave) * fator);
    }, [busca, ordem]);

    const linhas = filtradas.slice(0, visiveis);
    const temMais = visiveis < filtradas.length;
    const podeRecolher = !temMais && filtradas.length > PASSO;

    const ordenar = (chave) => {
        setOrdem((atual) =>
            atual.chave === chave
                ? { chave, direcao: atual.direcao === 'asc' ? 'desc' : 'asc' }
                : { chave, direcao: chave === 'data' || chave === 'metros' ? 'desc' : 'asc' }
        );
    };

    const alternarLinhas = () => {
        if (temMais) {
            setVisiveis((v) => v + PASSO);
        } else {
            setVisiveis(PASSO);
            document.getElementById('info')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="info">
            <header className="info__topo">
                <h2 className="info__titulo">Info</h2>

                <label className="info__busca">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Buscar estampa ou rolo"
                        value={busca}
                        onChange={(e) => {
                            setBusca(e.target.value);
                            setVisiveis(PASSO);
                        }}
                        aria-label="Buscar estampa ou id do rolo"
                    />
                </label>
            </header>

            <div className="info__tabela-wrap">
                <div className="info__rolagem">
                    <table className="info__tabela">
                        <thead>
                            <tr>
                                {colunas.map(({ chave, rotulo, numerica }) => {
                                    const ativa = ordem.chave === chave;
                                    return (
                                        <th
                                            key={chave}
                                            scope="col"
                                            className={numerica ? 'info__num' : undefined}
                                            aria-sort={ativa ? (ordem.direcao === 'asc' ? 'ascending' : 'descending') : 'none'}
                                        >
                                            <button
                                                type="button"
                                                className={`info__ordenar ${ativa ? 'info__ordenar--ativo' : ''}`}
                                                onClick={() => ordenar(chave)}
                                            >
                                                {rotulo}
                                                <span
                                                    className={`info__seta ${ativa && ordem.direcao === 'asc' ? 'info__seta--cima' : ''}`}
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {linhas.map((r, i) => {
                                const tecido = tecidoPorNome[r.estampa];
                                const data = new Date(r.data);
                                return (
                                    <tr key={r.id} style={{ '--i': i % PASSO }}>
                                        <td>
                                            <span className="info__data">{formatoData.format(data).replace('.', '')}</span>
                                            <span className="info__hora">{formatoHora.format(data)}</span>
                                        </td>
                                        <td>
                                            <span className="info__id">{r.rolo}</span>
                                        </td>
                                        <td>
                                            <span className="info__estampa">
                                                <span
                                                    className="info__amostra"
                                                    style={{ backgroundImage: tecido ? `url(${tecido.imagem})` : undefined }}
                                                    aria-hidden="true"
                                                />
                                                {r.estampa}
                                            </span>
                                        </td>
                                        <td className="info__num">
                                            <span className="info__metros">
                                                <strong>{formatoMetros(r.metros)}</strong>
                                                <small>m</small>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {linhas.length === 0 && (
                                <tr className="info__vazio">
                                    <td colSpan={colunas.length}>Nenhuma retirada encontrada para “{busca}”.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {(temMais || podeRecolher) && (
                    <div className="info__mais">
                        <button
                            type="button"
                            className={`info__mais-btn ${podeRecolher ? 'info__mais-btn--recolher' : ''}`}
                            onClick={alternarLinhas}
                            aria-label={temMais ? 'Mostrar mais retiradas' : 'Mostrar menos retiradas'}
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        <span className="info__contador">
                            {linhas.length} de {filtradas.length}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}
