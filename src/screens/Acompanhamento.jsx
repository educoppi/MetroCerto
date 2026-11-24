import { useMemo, useState } from "react";
import { hojeIso, situacaoRolo } from "../data/tecidos";
import { useTecidos } from "../data/TecidosContext";
import "./Acompanhamento.css";

const periodos = [
    { id: "7", rotulo: "7 dias", dias: 7 },
    { id: "30", rotulo: "30 dias", dias: 30 },
    { id: "tudo", rotulo: "Tudo", dias: null },
];

const statusInfo = {
    ok: { rotulo: "Saudável", icone: "✓" },
    alerta: { rotulo: "Abaixo do mínimo", icone: "!" },
    critico: { rotulo: "Crítico", icone: "!!" },
};

const DIA = 86400000;

const paraDia = (texto) => {
    const [a, m, d] = texto.slice(0, 10).split("-").map(Number);
    return Date.UTC(a, m - 1, d);
};

const metros = (valor, casas = 2) =>
    valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

const formatoDiaCurto = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });
const formatoDiaLongo = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });
const formatoData = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

const passoBonito = (bruto) => {
    const base = 10 ** Math.floor(Math.log10(bruto || 1));
    const opcoes = [1, 2, 2.5, 5, 10];
    return base * opcoes.find((o) => o * base >= bruto);
};

function StatusSelo({ status }) {
    const info = statusInfo[status];
    return (
        <span className={`acp-status acp-status--${status}`}>
            <span className="acp-status__icone" aria-hidden="true">{info.icone}</span>
            {info.rotulo}
        </span>
    );
}

function GraficoDiario({ dias }) {
    const [ativo, setAtivo] = useState(null);
    const maximo = Math.max(...dias.map((d) => d.valor), 1);
    const passo = passoBonito(maximo / 4);
    const topo = Math.ceil(maximo / passo) * passo;
    const ticks = Array.from({ length: Math.round(topo / passo) + 1 }, (_, i) => i * passo);
    const intervalo = Math.ceil(dias.length / 8);
    const atual = ativo != null ? dias[ativo] : null;

    return (
        <div className="acp-colunas" onPointerLeave={() => setAtivo(null)}>
            <div className="acp-colunas__eixo" aria-hidden="true">
                {ticks.map((t) => (
                    <span key={t} style={{ bottom: `${(t / topo) * 100}%` }}>
                        {metros(t, 0)}
                    </span>
                ))}
            </div>

            <div className="acp-colunas__area">
                {ticks.map((t) => (
                    <span key={t} className="acp-colunas__grade" style={{ bottom: `${(t / topo) * 100}%` }} aria-hidden="true" />
                ))}

                <div className="acp-colunas__barras" role="list" aria-label="Metros retirados por dia">
                    {dias.map((d, i) => (
                        <button
                            type="button"
                            role="listitem"
                            key={d.chave}
                            className={`acp-coluna ${ativo === i ? "acp-coluna--ativa" : ""}`}
                            onPointerEnter={() => setAtivo(i)}
                            onFocus={() => setAtivo(i)}
                            onBlur={() => setAtivo(null)}
                            aria-label={`${formatoDiaLongo.format(d.chave)}: ${metros(d.valor)} metros em ${d.quantidade} retiradas`}
                        >
                            <span
                                className="acp-coluna__barra"
                                style={{ height: `${(d.valor / topo) * 100}%`, "--i": i }}
                            />
                        </button>
                    ))}
                </div>

                {atual && (
                    <div
                        className="acp-tooltip"
                        style={{ left: `${((ativo + 0.5) / dias.length) * 100}%` }}
                        role="status"
                    >
                        <strong>{metros(atual.valor)} m</strong>
                        <span>{formatoDiaLongo.format(atual.chave)}</span>
                        <span>
                            {atual.quantidade} {atual.quantidade === 1 ? "retirada" : "retiradas"}
                        </span>
                        {atual.estampas.length > 0 && <em>{atual.estampas.join(" · ")}</em>}
                    </div>
                )}
            </div>

            <div className="acp-colunas__rotulos" aria-hidden="true">
                {dias.map((d, i) => (
                    <span key={d.chave}>{i % intervalo === 0 || i === dias.length - 1 ? formatoDiaCurto.format(d.chave) : ""}</span>
                ))}
            </div>
        </div>
    );
}

function GraficoEstampas({ linhas, selecionada, onSelecionar }) {
    const maximo = Math.max(...linhas.map((l) => l.valor), 1);

    return (
        <ul className="acp-barras">
            {linhas.map((l) => {
                const ativa = selecionada === l.nome;
                return (
                    <li key={l.nome}>
                        <button
                            type="button"
                            className={`acp-barra ${ativa ? "acp-barra--ativa" : ""}`}
                            onClick={() => onSelecionar(ativa ? "todas" : l.nome)}
                            aria-pressed={ativa}
                            aria-label={`${l.nome}: ${metros(l.valor)} metros em ${l.quantidade} retiradas. ${ativa ? "Remover filtro" : "Filtrar por esta estampa"}`}
                        >
                            <span className="acp-barra__nome">
                                <span className="acp-amostra" style={{ backgroundImage: `url(${l.estampa})` }} aria-hidden="true" />
                                {l.nome}
                            </span>
                            <span className="acp-barra__trilho">
                                <span className="acp-barra__valor" style={{ width: `${(l.valor / maximo) * 100}%` }} />
                                <span className="acp-barra__rotulo">{metros(l.valor)} m</span>
                            </span>
                        </button>
                    </li>
                );
            })}
            {linhas.length === 0 && <li className="acp-vazio">Sem retiradas no período.</li>}
        </ul>
    );
}

export default function Acompanhamento() {
    const { tecidos, registros: retiradas } = useTecidos();
    const [periodo, setPeriodo] = useState("30");
    const [estampa, setEstampa] = useState("todas");
    const hoje = paraDia(hojeIso());

    const dados = useMemo(() => {
        const primeiroDia = retiradas.length ? Math.min(...retiradas.map((r) => paraDia(r.dataHora))) : hoje;
        const config = periodos.find((p) => p.id === periodo);
        const inicio = config.dias ? hoje - (config.dias - 1) * DIA : primeiroDia;
        const totalDias = Math.round((hoje - inicio) / DIA) + 1;
        const anteriorInicio = config.dias ? inicio - config.dias * DIA : null;

        const daEstampa = (r) => estampa === "todas" || r.nomeTecido === estampa;
        const noIntervalo = (r, de, ate) => {
            const d = paraDia(r.dataHora);
            return d >= de && d <= ate;
        };

        const atuais = retiradas.filter((r) => daEstampa(r) && noIntervalo(r, inicio, hoje));
        const anteriores = anteriorInicio != null
            ? retiradas.filter((r) => daEstampa(r) && noIntervalo(r, anteriorInicio, inicio - DIA))
            : null;

        const total = atuais.reduce((s, r) => s + r.metroMovimentado, 0);
        const totalAnterior = anteriores ? anteriores.reduce((s, r) => s + r.metroMovimentado, 0) : null;
        const variacao = totalAnterior ? ((total - totalAnterior) / totalAnterior) * 100 : null;

        const dias = Array.from({ length: totalDias }, (_, i) => {
            const chave = inicio + i * DIA;
            const doDia = atuais.filter((r) => paraDia(r.dataHora) === chave);
            return {
                chave,
                valor: doDia.reduce((s, r) => s + r.metroMovimentado, 0),
                quantidade: doDia.length,
                estampas: [...new Set(doDia.map((r) => r.nomeTecido))],
            };
        });

        const porEstampa = tecidos
            .map((t) => {
                const lista = atuais.filter((r) => r.idTecido === t.id);
                return { ...t, valor: lista.reduce((s, r) => s + r.metroMovimentado, 0), quantidade: lista.length };
            })
            .filter((l) => l.quantidade > 0)
            .sort((a, b) => b.valor - a.valor);

        const inicio30 = hoje - 29 * DIA;
        const rolos = tecidos
            .filter((t) => estampa === "todas" || t.nome === estampa)
            .map((t) => {
                const s = situacaoRolo(t, retiradas);
                const consumo30 = retiradas
                    .filter((r) => r.idTecido === t.id && noIntervalo(r, inicio30, hoje))
                    .reduce((soma, r) => soma + r.metroMovimentado, 0) / 30;
                const diasRestantes = consumo30 > 0 ? Math.floor(s.saldo / consumo30) : null;
                return { ...s, consumo30, diasRestantes };
            })
            .sort((a, b) => (a.diasRestantes ?? Infinity) - (b.diasRestantes ?? Infinity));

        const saldoTotal = rolos.reduce((s, r) => s + r.saldo, 0);
        const iniciaisTotal = rolos.reduce((s, r) => s + r.metrosIniciais, 0);

        return {
            inicio,
            total,
            variacao,
            config,
            quantidade: atuais.length,
            media: atuais.length ? total / atuais.length : 0,
            dias,
            porEstampa,
            rolos,
            saldoTotal,
            iniciaisTotal,
            emAlerta: rolos.filter((r) => r.status !== "ok").length,
        };
    }, [periodo, estampa, tecidos, retiradas, hoje]);

    const filtrado = periodo !== "30" || estampa !== "todas";

    return (
        <section className="acp">
            <header className="acp-topo">
                <div>
                    <h2 className="acp-titulo">Acompanhamento</h2>
                    <p className="acp-subtitulo">
                        {formatoData.format(dados.inicio)} — {formatoData.format(hoje)}
                    </p>
                </div>
            </header>

            <div className="acp-filtros" role="group" aria-label="Filtros do painel">
                <div className="acp-segmento" role="radiogroup" aria-label="Período">
                    {periodos.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={periodo === p.id}
                            className={periodo === p.id ? "acp-segmento--ativo" : undefined}
                            onClick={() => setPeriodo(p.id)}
                        >
                            {p.rotulo}
                        </button>
                    ))}
                </div>

                <label className="acp-select">
                    <span>Estampa</span>
                    <select value={estampa} onChange={(e) => setEstampa(e.target.value)}>
                        <option value="todas">Todas</option>
                        {tecidos.map((t) => (
                            <option key={t.nome} value={t.nome}>
                                {t.nome}
                            </option>
                        ))}
                    </select>
                </label>

                {filtrado && (
                    <button
                        type="button"
                        className="acp-limpar"
                        onClick={() => {
                            setPeriodo("30");
                            setEstampa("todas");
                        }}
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            <dl className="acp-kpis">
                <div className="acp-kpi acp-kpi--destaque">
                    <dt>Total retirado</dt>
                    <dd>
                        <span className="acp-kpi__valor">
                            {metros(dados.total)}
                            <small>m</small>
                        </span>
                        {dados.variacao != null && (
                            <span className="acp-kpi__delta">
                                {dados.variacao >= 0 ? "▲" : "▼"} {metros(Math.abs(dados.variacao), 0)}% vs {dados.config.dias} dias anteriores
                            </span>
                        )}
                    </dd>
                </div>
                <div className="acp-kpi">
                    <dt>Retiradas</dt>
                    <dd>
                        <span className="acp-kpi__valor">{dados.quantidade}</span>
                        <span className="acp-kpi__nota">média de {metros(dados.media)} m cada</span>
                    </dd>
                </div>
                <div className="acp-kpi">
                    <dt>Saldo em estoque</dt>
                    <dd>
                        <span className="acp-kpi__valor">
                            {metros(dados.saldoTotal)}
                            <small>m</small>
                        </span>
                        <span className="acp-kpi__nota">
                            {dados.iniciaisTotal ? metros((dados.saldoTotal / dados.iniciaisTotal) * 100, 0) : 0}% do total recebido
                        </span>
                    </dd>
                </div>
                <div className="acp-kpi">
                    <dt>Rolos em alerta</dt>
                    <dd>
                        <span className="acp-kpi__valor">
                            {dados.emAlerta}
                            <small>de {dados.rolos.length}</small>
                        </span>
                        <span className="acp-kpi__nota">abaixo do estoque mínimo</span>
                    </dd>
                </div>
            </dl>

            <div className="acp-grade">
                <article className="acp-card acp-card--largo">
                    <header className="acp-card__topo">
                        <h3>Metros retirados por dia</h3>
                    </header>
                    <GraficoDiario dias={dados.dias} />
                </article>

                <article className="acp-card">
                    <header className="acp-card__topo">
                        <h3>Retirado por estampa</h3>
                    </header>
                    <GraficoEstampas linhas={dados.porEstampa} selecionada={estampa} onSelecionar={setEstampa} />
                </article>

                <article className="acp-card">
                    <header className="acp-card__topo">
                        <h3>Nível e reposição</h3>
                        <p>Saldo atual e previsão pelo consumo dos últimos 30 dias</p>
                    </header>
                    <ul className="acp-niveis">
                        {dados.rolos.map((r) => {
                            const pct = r.metrosIniciais ? (r.saldo / r.metrosIniciais) * 100 : 0;
                            const pctMin = r.metrosIniciais ? Math.min((r.estoqueMin / r.metrosIniciais) * 100, 100) : 0;
                            return (
                                <li key={r.id} className="acp-nivel">
                                    <div className="acp-nivel__topo">
                                        <span className="acp-nivel__nome">
                                            <span className="acp-amostra" style={{ backgroundImage: `url(${r.estampa})` }} aria-hidden="true" />
                                            {r.nome}
                                        </span>
                                        <span className="acp-nivel__saldo">
                                            <strong>{metros(r.saldo)}</strong> / {metros(r.metrosIniciais, 0)} m
                                            {r.diasRestantes != null && <em> · acaba em {r.diasRestantes} dias</em>}
                                        </span>
                                    </div>
                                    <div
                                        className={`acp-medidor acp-medidor--${r.status}`}
                                        role="meter"
                                        aria-label={`Saldo do rolo ${r.nome}`}
                                        aria-valuemin={0}
                                        aria-valuemax={r.metrosIniciais}
                                        aria-valuenow={r.saldo}
                                    >
                                        <span className="acp-medidor__fill" style={{ width: `${pct}%` }} />
                                        <span className="acp-medidor__min" style={{ left: `${pctMin}%` }} title={`Mínimo: ${r.estoqueMin} m`} />
                                    </div>
                                    <StatusSelo status={r.status} />
                                </li>
                            );
                        })}
                    </ul>
                </article>

            </div>
        </section>
    );
}
