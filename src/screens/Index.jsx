import './Index.css';

const ondas = [
    'M-100 560 C 200 460, 420 680, 720 560 S 1200 420, 1540 540',
    'M-100 600 C 260 510, 480 720, 760 600 S 1240 470, 1540 580',
];

const brilhos = Array.from({ length: 6 }, (_, i) => i);

export default function Index({ setTela }) {
    return (
        <section className="inicio" aria-labelledby="inicio-titulo">
            <svg className="inicio__fios" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id="inicioOuro" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#b8893b" stopOpacity="0" />
                        <stop offset="30%" stopColor="#b8893b" stopOpacity="0.7" />
                        <stop offset="50%" stopColor="#e6c77a" />
                        <stop offset="70%" stopColor="#b8893b" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#b8893b" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {ondas.map((d, i) => (
                    <g key={d} className={`inicio__onda inicio__onda--${i + 1}`}>
                        <path className="inicio__fio" d={d} />
                        <path className="inicio__luz" d={d} pathLength="1000" />
                    </g>
                ))}
            </svg>

            <div className="inicio__brilhos" aria-hidden="true">
                {brilhos.map((i) => (
                    <span key={i} style={{ '--b': i }} />
                ))}
            </div>

            <div className="inicio__conteudo">
                <div className="inicio__marca">
                    <h1 id="inicio-titulo" className="inicio__titulo" data-texto="MAITÊ">MAITÊ</h1>
                    <span className="inicio__divisor" aria-hidden="true">
                        <span className="inicio__linha" />
                        <span className="inicio__losango" />
                        <span className="inicio__linha" />
                    </span>
                    <p className="inicio__subtitulo">Decorações</p>
                </div>

                <p className="inicio__descricao">
                    Aqui você gerencia todo o acervo de materiais, realiza o cadastro rápido de novos tecidos,
                    controla os saldos do almoxarifado e acessa relatórios para manter o estoque sempre organizado.
                </p>

                <div className="inicio__acoes">
                    <button type="button" className="inicio__btn inicio__btn--ouro" onClick={() => setTela('estoque')}>
                        Ver estoque
                    </button>
                    <button type="button" className="inicio__btn" onClick={() => setTela('cadastro')}>
                        Cadastrar tecido
                    </button>
                </div>
            </div>
        </section>
    );
}
