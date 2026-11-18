import { useEffect, useState } from 'react';
import Icon from '../Icon/Icon';
import style from './Header.module.css';

const links = [
    { id: 'estoque', label: 'Estoque' },
    { id: 'info', label: 'Info' },
    { id: 'acompanhamento', label: 'Acompanhamento' },
    { id: 'cadastro', label: 'Cadastrar Tecido', destaque: true },
];

const onda1 = 'M0 24 C 180 8, 360 40, 540 24 S 900 8, 1080 24 S 1350 36, 1440 22';
const onda2 = 'M0 18 C 220 34, 420 6, 640 20 S 1020 34, 1220 16 S 1400 12, 1440 20';
const onda3 = 'M0 28 C 160 16, 300 30, 480 18 S 820 30, 1000 20 S 1300 10, 1440 26';

export default function Header({ tela, setTela }) {
    const [aberto, setAberto] = useState(false);
    const [rolado, setRolado] = useState(false);

    useEffect(() => {
        const aoRolar = () => setRolado(window.scrollY > 8);
        aoRolar();
        window.addEventListener('scroll', aoRolar, { passive: true });
        return () => window.removeEventListener('scroll', aoRolar);
    }, []);

    useEffect(() => {
        if (!aberto) return;
        const aoTeclar = (e) => {
            if (e.key === 'Escape') setAberto(false);
        };
        const aoRedimensionar = () => {
            if (window.innerWidth > 900) setAberto(false);
        };
        window.addEventListener('keydown', aoTeclar);
        window.addEventListener('resize', aoRedimensionar);
        return () => {
            window.removeEventListener('keydown', aoTeclar);
            window.removeEventListener('resize', aoRedimensionar);
        };
    }, [aberto]);

    const navegar = (id) => {
        setTela(id);
        setAberto(false);
    };

    return (
        <>
        <header className={`${style.header} ${rolado ? style.rolado : ''}`}>
            <div className={style.inner}>
                <Icon onClick={() => navegar('home')} />

                <button
                    type="button"
                    className={style.toggle}
                    aria-expanded={aberto}
                    aria-controls="menu-principal"
                    aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
                    onClick={() => setAberto((valor) => !valor)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav
                    id="menu-principal"
                    className={`${style.nav} ${aberto ? style.aberto : ''}`}
                    aria-label="Navegação principal"
                >
                    <ul className={style.lista}>
                        {links.map((link, i) => {
                            const ativo = tela === link.id;
                            return (
                                <li key={link.id} style={{ '--i': i }}>
                                    <button
                                        type="button"
                                        className={[style.link, ativo && style.ativo, link.destaque && style.destaque].filter(Boolean).join(' ')}
                                        aria-current={ativo ? 'page' : undefined}
                                        onClick={() => navegar(link.id)}
                                    >
                                        <span className={style.texto}>{link.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            <svg className={style.fios} viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id="ouroFio" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#b8893b" stopOpacity="0" />
                        <stop offset="18%" stopColor="#b8893b" />
                        <stop offset="50%" stopColor="#e6c77a" />
                        <stop offset="82%" stopColor="#b8893b" />
                        <stop offset="100%" stopColor="#b8893b" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path className={style.fio} d={onda1} />
                <path className={`${style.fio} ${style.fio2}`} d={onda2} />
                <path className={`${style.fio} ${style.fio3}`} d={onda3} />
                <path className={style.brilho} d={onda1} pathLength="1000" />
                <path className={`${style.brilho} ${style.brilho2}`} d={onda2} pathLength="1000" />
            </svg>

            <span className={style.linha} aria-hidden="true" />
        </header>
        {aberto && <div className={style.veu} onClick={() => setAberto(false)} aria-hidden="true" />}
        </>
    );
}
