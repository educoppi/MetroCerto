import { useId, useState } from 'react';
import Rolo from '../components/Rolo/Rolo';
import './RoloDetalhe.css';

const campos = [
    { chave: 'iniciais', rotulo: 'Metros iniciais' },
    { chave: 'retirados', rotulo: 'Metros retirados' },
    { chave: 'minimo', rotulo: 'Estoque mínimo' },
];

const formatar = (valor) =>
    Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const paraNumero = (valor) => (valor === '' || valor == null ? null : Number(valor));

// remoto = rolo do backend: "Metros retirados" vem dos registros e não é editável
export default function RoloDetalhe({ tecido, dados, remoto = false, onSalvar, onVoltar }) {
    const id = useId();
    const [form, setForm] = useState({
        iniciais: dados?.iniciais ?? '',
        retirados: dados?.retirados ?? '',
        minimo: dados?.minimo ?? '',
    });
    const [salvo, setSalvo] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState('');

    const iniciais = paraNumero(form.iniciais);
    const retirados = paraNumero(form.retirados) ?? 0;
    const minimo = paraNumero(form.minimo);

    const erros = {};
    if (iniciais != null && iniciais < 0) erros.iniciais = 'Informe um valor positivo.';
    if (form.retirados !== '' && retirados < 0) erros.retirados = 'Informe um valor positivo.';
    if (iniciais != null && retirados > iniciais) erros.retirados = 'Não pode ser maior que os metros iniciais.';
    if (minimo != null && minimo < 0) erros.minimo = 'Informe um valor positivo.';
    if (remoto && iniciais == null) erros.iniciais = 'Informe os metros iniciais.';
    if (remoto && minimo == null) erros.minimo = 'Informe o estoque mínimo.';

    const temErro = Object.keys(erros).length > 0;
    const saldo = iniciais != null ? Math.max(iniciais - retirados, 0) : null;
    const progresso = iniciais ? Math.min(Math.max((saldo / iniciais) * 100, 0), 100) : 0;

    let status = { tipo: 'neutro', texto: 'Aguardando dados' };
    if (saldo != null && !temErro) {
        if (saldo === 0) status = { tipo: 'critico', texto: 'Esgotado' };
        else if (minimo != null && saldo <= minimo) status = { tipo: 'alerta', texto: 'Abaixo do mínimo' };
        else status = { tipo: 'ok', texto: 'Estoque saudável' };
    }

    const alterar = (chave) => (e) => {
        setForm((atual) => ({ ...atual, [chave]: e.target.value }));
        setSalvo(false);
        setErroEnvio('');
    };

    const enviar = async (e) => {
        e.preventDefault();
        if (temErro || salvando) return;
        setSalvando(true);
        try {
            await onSalvar({
                iniciais: form.iniciais,
                retirados: form.retirados,
                minimo: form.minimo,
            });
            setSalvo(true);
        } catch (erro) {
            setErroEnvio(erro.status ? erro.message : 'Não foi possível conectar ao servidor.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <section className="detalhe">
            <button type="button" className="detalhe__voltar" onClick={onVoltar}>
                <span aria-hidden="true">←</span> Voltar ao estoque
            </button>

            <h2 className="detalhe__titulo">
                <span className="detalhe__rotulo">Rolo</span>
                {tecido.nome}
            </h2>

            <div className="detalhe__grid">
                <div className="detalhe__vitrine">
                    <div className="detalhe__palco">
                        <Rolo imagem={tecido.estampa} escala={tecido.escala} grande interativo />
                    </div>

                    <dl className="detalhe__resumo">
                        <div className="detalhe__metrica">
                            <dt>Saldo atual</dt>
                            <dd>
                                {saldo != null ? formatar(saldo) : '—'}
                                <small>m</small>
                            </dd>
                        </div>
                        <div className="detalhe__metrica">
                            <dt>Situação</dt>
                            <dd>
                                <span className={`detalhe__status detalhe__status--${status.tipo}`}>{status.texto}</span>
                            </dd>
                        </div>
                    </dl>

                    <div
                        className={`detalhe__barra detalhe__barra--${status.tipo}`}
                        role="progressbar"
                        aria-label="Saldo restante do rolo"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progresso)}
                    >
                        <span style={{ width: `${progresso}%` }} />
                        {iniciais != null && minimo != null && iniciais > 0 && minimo <= iniciais && (
                            <i style={{ left: `${(minimo / iniciais) * 100}%` }} aria-hidden="true" />
                        )}
                    </div>
                </div>

                <form className="detalhe__form" onSubmit={enviar} noValidate>
                    {campos.map(({ chave, rotulo }) => {
                        const campoId = `${id}-${chave}`;
                        const erro = erros[chave];
                        return (
                            <div className={`detalhe__campo ${erro ? 'detalhe__campo--erro' : ''}`} key={chave}>
                                <label htmlFor={campoId}>{rotulo}:</label>
                                <div className="detalhe__entrada">
                                    <input
                                        id={campoId}
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="0.01"
                                        placeholder="0"
                                        value={form[chave]}
                                        onChange={alterar(chave)}
                                        disabled={remoto && chave === 'retirados'}
                                        title={remoto && chave === 'retirados' ? 'Calculado pelas retiradas registradas' : undefined}
                                        aria-invalid={Boolean(erro)}
                                        aria-describedby={`${campoId}-dica`}
                                    />
                                    <span className="detalhe__unidade">m</span>
                                </div>
                                <p id={`${campoId}-dica`} className="detalhe__dica">
                                    {erro}
                                </p>
                            </div>
                        );
                    })}

                    <div className="detalhe__acoes">
                        <button type="button" className="detalhe__btn detalhe__btn--secundario" onClick={onVoltar}>
                            Cancelar
                        </button>
                        <button type="submit" className="detalhe__btn" disabled={temErro || salvando}>
                            {salvando ? 'Salvando…' : 'Salvar'}
                        </button>
                    </div>

                    <p className={`detalhe__aviso ${salvo || erroEnvio ? 'detalhe__aviso--visivel' : ''}`} role="status">
                        {erroEnvio || (salvo ? 'Alterações salvas com sucesso.' : '')}
                    </p>
                </form>
            </div>
        </section>
    );
}
