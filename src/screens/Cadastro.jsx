import { useId, useRef, useState } from 'react';
import Rolo from '../components/Rolo/Rolo';
import { useTecidos } from '../data/TecidosContext';
import './Cadastro.css';

const TIPOS = ['image/png', 'image/jpeg', 'image/webp'];
const TAMANHO_MAX = 8 * 1024 * 1024;
const LADO_MAX = 600;

const estadoInicial = { nome: '', metros: '', minimo: '', escala: 90 };

const otimizarImagem = (arquivo) =>
    new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
        leitor.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
            img.onload = () => {
                const fator = Math.min(1, LADO_MAX / Math.max(img.width, img.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * fator);
                canvas.height = Math.round(img.height * fator);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.src = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    });

export default function Cadastro({ setTela }) {
    const id = useId();
    const { adicionar, nomeExiste, backendOk } = useTecidos();
    const inputArquivo = useRef(null);
    const [form, setForm] = useState(estadoInicial);
    const [imagem, setImagem] = useState(null);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [arrastando, setArrastando] = useState(false);
    const [erroImagem, setErroImagem] = useState('');
    const [tocado, setTocado] = useState({});
    const [enviado, setEnviado] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState('');

    const nome = form.nome.trim();
    const metros = form.metros === '' ? null : Number(form.metros);
    const minimo = form.minimo === '' ? null : Number(form.minimo);

    const erros = {};
    if (!nome) erros.nome = 'Informe o nome da estampa.';
    else if (nome.length > 40) erros.nome = 'Use no máximo 40 caracteres.';
    else if (nomeExiste(nome)) erros.nome = 'Já existe um rolo com esse nome.';
    if (!imagem) erros.imagem = erroImagem || 'Envie uma imagem do tecido.';
    if (metros == null) erros.metros = 'Informe a metragem do rolo.';
    else if (!(metros > 0)) erros.metros = 'A metragem deve ser maior que zero.';
    else if (metros > 10000) erros.metros = 'Metragem muito alta.';
    if (minimo != null && minimo < 0) erros.minimo = 'Informe um valor positivo.';
    else if (minimo != null && metros != null && minimo > metros) erros.minimo = 'Não pode ser maior que a metragem do rolo.';

    const mostrar = (campo) => (tocado[campo] || enviado) && erros[campo];
    const valido = Object.keys(erros).length === 0;
    const minimoSugerido = metros > 0 ? Math.max(1, Math.round(metros * 0.2)) : null;

    const alterar = (campo) => (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value }));
    const sair = (campo) => () => setTocado((atual) => ({ ...atual, [campo]: true }));

    const processarArquivo = async (arquivo) => {
        if (!arquivo) return;
        setTocado((atual) => ({ ...atual, imagem: true }));
        if (!TIPOS.includes(arquivo.type)) {
            setErroImagem('Use uma imagem PNG, JPG ou WEBP.');
            return;
        }
        if (arquivo.size > TAMANHO_MAX) {
            setErroImagem('A imagem deve ter no máximo 8 MB.');
            return;
        }
        setCarregando(true);
        setErroImagem('');
        try {
            const url = await otimizarImagem(arquivo);
            setImagem(url);
            setNomeArquivo(arquivo.name);
        } catch (erro) {
            setErroImagem(erro.message);
        } finally {
            setCarregando(false);
        }
    };

    const removerImagem = () => {
        setImagem(null);
        setNomeArquivo('');
        if (inputArquivo.current) inputArquivo.current.value = '';
    };

    const soltar = (e) => {
        e.preventDefault();
        setArrastando(false);
        processarArquivo(e.dataTransfer.files?.[0]);
    };

    const limpar = () => {
        setForm(estadoInicial);
        removerImagem();
        setErroImagem('');
        setTocado({});
        setEnviado(false);
        setErroEnvio('');
    };

    const enviar = async (e) => {
        e.preventDefault();
        if (salvando) return;
        setEnviado(true);
        if (!valido) {
            const primeiro = ['nome', 'imagem', 'metros', 'minimo'].find((c) => erros[c]);
            document.getElementById(`${id}-${primeiro}`)?.focus();
            return;
        }
        setSalvando(true);
        setErroEnvio('');
        try {
            // Novo rolo vai para o backend
            await adicionar({
                nome,
                estampa: imagem,
                escala: `${form.escala}px`,
                saldoAtual: metros,
                estoqueMin: minimo ?? minimoSugerido,
            });
            limpar();
            setTela('estoque');
        } catch (erro) {
            if (erro.status === 409) setErroEnvio('Já existe um rolo com esse nome no servidor.');
            else if (erro.status) setErroEnvio(erro.message);
            else setErroEnvio('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <section className="cad">
            <header className="cad__topo">
                <h2 className="cad__titulo">Cadastrar tecido</h2>
                <p className="cad__subtitulo">Adicione um novo rolo ao estoque</p>
            </header>

            <form className="cad__grid" onSubmit={enviar} noValidate>
                <aside className="cad__vitrine" aria-label="Pré-visualização do rolo">
                    <span className="cad__selo">Novo</span>
                    <div className={`cad__palco ${imagem ? '' : 'cad__palco--vazio'}`}>
                        <Rolo imagem={imagem} escala={`${form.escala}px`} grande interativo />
                    </div>
                    <div className="cad__previa">
                        <span className="cad__rotulo">Rolo</span>
                        <strong>{nome || 'Nome da estampa'}</strong>
                        <span className="cad__metros">
                            {metros > 0 ? `${metros.toLocaleString('pt-BR')} m` : '— m'}
                        </span>
                    </div>

                    <label className="cad__escala" htmlFor={`${id}-escala`}>
                        <span>
                            Tamanho da estampa
                            <output htmlFor={`${id}-escala`}>{form.escala}px</output>
                        </span>
                        <input
                            id={`${id}-escala`}
                            type="range"
                            min="40"
                            max="200"
                            step="5"
                            value={form.escala}
                            onChange={alterar('escala')}
                            disabled={!imagem}
                            style={{ '--progresso': `${((form.escala - 40) / 160) * 100}%` }}
                        />
                    </label>
                </aside>

                <div className="cad__form">
                    <div className={`cad__campo ${mostrar('nome') ? 'cad__campo--erro' : ''}`}>
                        <label htmlFor={`${id}-nome`}>Nome da estampa:</label>
                        <input
                            id={`${id}-nome`}
                            type="text"
                            placeholder="Ex.: Linho Areia"
                            value={form.nome}
                            onChange={alterar('nome')}
                            onBlur={sair('nome')}
                            maxLength={60}
                            autoComplete="off"
                            aria-invalid={Boolean(mostrar('nome'))}
                            aria-describedby={`${id}-nome-msg`}
                        />
                        <p id={`${id}-nome-msg`} className="cad__msg">
                            {mostrar('nome')}
                        </p>
                    </div>

                    <div className={`cad__campo ${mostrar('imagem') ? 'cad__campo--erro' : ''}`}>
                        <span className="cad__label" id={`${id}-imagem-rotulo`}>Imagem do tecido:</span>
                        <div
                            className={`cad__upload ${arrastando ? 'cad__upload--ativo' : ''} ${imagem ? 'cad__upload--preenchido' : ''}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setArrastando(true);
                            }}
                            onDragLeave={() => setArrastando(false)}
                            onDrop={soltar}
                        >
                            <input
                                ref={inputArquivo}
                                id={`${id}-imagem`}
                                className="cad__arquivo"
                                type="file"
                                accept={TIPOS.join(',')}
                                onChange={(e) => processarArquivo(e.target.files?.[0])}
                                aria-labelledby={`${id}-imagem-rotulo`}
                                aria-describedby={`${id}-imagem-msg`}
                                aria-invalid={Boolean(mostrar('imagem'))}
                            />
                            {imagem ? (
                                <div className="cad__arquivo-info">
                                    <span className="cad__miniatura" style={{ backgroundImage: `url(${imagem})` }} aria-hidden="true" />
                                    <span className="cad__arquivo-nome">
                                        <strong>{nomeArquivo}</strong>
                                        <span>Imagem pronta</span>
                                    </span>
                                    <label htmlFor={`${id}-imagem`} className="cad__link">Trocar</label>
                                    <button type="button" className="cad__link" onClick={removerImagem}>
                                        Remover
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor={`${id}-imagem`} className="cad__upload-vazio">
                                    <span className="cad__upload-icone" aria-hidden="true">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5" />
                                            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                                        </svg>
                                    </span>
                                    <span>
                                        <strong>{carregando ? 'Processando imagem…' : 'Clique para enviar'}</strong> ou arraste aqui
                                    </span>
                                    <small>PNG, JPG ou WEBP · até 8 MB</small>
                                </label>
                            )}
                        </div>
                        <p id={`${id}-imagem-msg`} className="cad__msg">
                            {mostrar('imagem') || erroImagem}
                        </p>
                    </div>

                    <div className="cad__linha">
                        <div className={`cad__campo ${mostrar('metros') ? 'cad__campo--erro' : ''}`}>
                            <label htmlFor={`${id}-metros`}>Metros do rolo:</label>
                            <div className="cad__entrada">
                                <input
                                    id={`${id}-metros`}
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    value={form.metros}
                                    onChange={alterar('metros')}
                                    onBlur={sair('metros')}
                                    aria-invalid={Boolean(mostrar('metros'))}
                                    aria-describedby={`${id}-metros-msg`}
                                />
                                <span>m</span>
                            </div>
                            <p id={`${id}-metros-msg`} className="cad__msg">
                                {mostrar('metros')}
                            </p>
                        </div>

                        <div className={`cad__campo ${mostrar('minimo') ? 'cad__campo--erro' : ''}`}>
                            <label htmlFor={`${id}-minimo`}>Estoque mínimo:</label>
                            <div className="cad__entrada">
                                <input
                                    id={`${id}-minimo`}
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    placeholder={minimoSugerido ? String(minimoSugerido) : 'Opcional'}
                                    value={form.minimo}
                                    onChange={alterar('minimo')}
                                    onBlur={sair('minimo')}
                                    aria-invalid={Boolean(mostrar('minimo'))}
                                    aria-describedby={`${id}-minimo-msg`}
                                />
                                <span>m</span>
                            </div>
                            <p id={`${id}-minimo-msg`} className="cad__msg">
                                {mostrar('minimo') || (minimoSugerido ? `Se vazio, usamos ${minimoSugerido} m.` : '')}
                            </p>
                        </div>
                    </div>

                    <div className="cad__acoes">
                        <button type="button" className="cad__btn cad__btn--secundario" onClick={limpar}>
                            Limpar
                        </button>
                        <button type="submit" className="cad__btn" disabled={carregando || salvando}>
                            {salvando ? 'Salvando…' : 'Cadastrar rolo'}
                        </button>
                    </div>
                    {(erroEnvio || !backendOk) && (
                        <p className="cad__msg cad__msg--erro" role="alert">
                            {erroEnvio || 'Servidor indisponível: o cadastro de rolos só funciona com o backend rodando.'}
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
