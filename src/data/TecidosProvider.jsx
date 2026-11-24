import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { tecidos as tecidosBase, registros as registrosBase, ESCALA_PADRAO } from './tecidos';
import { TecidosContext } from './TecidosContext';
import { atualizarTecido, buscarRegistros, buscarTecidos, criarTecido } from './api';

// Rolos cadastrados antes da integração: continuam só no navegador, como sempre estiveram
const CHAVE_LOCAIS = 'metrocerto:rolos-cadastrados';
// Escala da estampa dos rolos do backend (é só visual, não existe no backend)
const CHAVE_ESCALAS = 'metrocerto:escalas';
const ATUALIZAR_A_CADA = 30000;

const ler = (chave, padrao) => {
    try {
        return JSON.parse(localStorage.getItem(chave)) ?? padrao;
    } catch {
        return padrao;
    }
};

// Formato antigo salvo no navegador -> formato atual (igual ao backend)
const deLocalAntigo = (t) => ({
    id: t.id,
    nome: t.nome,
    estampa: t.estampa ?? t.imagem,
    escala: t.escala ?? ESCALA_PADRAO,
    saldoAtual: Number(t.saldoAtual ?? t.metrosIniciais ?? 0),
    estoqueMin: Number(t.estoqueMin ?? t.estoqueMinimo ?? 0),
});

const carregarLocais = () => {
    const salvos = ler(CHAVE_LOCAIS, []);
    return Array.isArray(salvos) ? salvos.map(deLocalAntigo) : [];
};

export default function TecidosProvider({ children }) {
    const [locais] = useState(carregarLocais);
    const [remotos, setRemotos] = useState([]);
    const [registrosRemotos, setRegistrosRemotos] = useState([]);
    const [escalas, setEscalas] = useState(() => ler(CHAVE_ESCALAS, {}));
    const [ultimoId, setUltimoId] = useState(null);
    const [backendOk, setBackendOk] = useState(true);
    const rolagemPendente = useRef(false);

    const recarregar = useCallback(async () => {
        try {
            const [t, r] = await Promise.all([buscarTecidos(), buscarRegistros()]);
            setRemotos(t);
            setRegistrosRemotos(r);
            setBackendOk(true);
        } catch {
            setBackendOk(false);
        }
    }, []);

    // Carrega ao abrir, a cada 30s e quando a aba volta ao foco (novas retiradas do hardware)
    useEffect(() => {
        const primeira = setTimeout(recarregar, 0);
        const intervalo = setInterval(recarregar, ATUALIZAR_A_CADA);
        window.addEventListener('focus', recarregar);
        return () => {
            clearTimeout(primeira);
            clearInterval(intervalo);
            window.removeEventListener('focus', recarregar);
        };
    }, [recarregar]);

    useEffect(() => {
        try {
            localStorage.setItem(CHAVE_ESCALAS, JSON.stringify(escalas));
        } catch {
            // sem espaço: a escala volta ao padrão ao recarregar
        }
    }, [escalas]);

    const consumirRolagem = useCallback(() => {
        const pendente = rolagemPendente.current;
        rolagemPendente.current = false;
        return pendente;
    }, []);

    const tecidos = useMemo(
        () => [
            ...tecidosBase,
            ...locais,
            ...remotos.map((t) => ({ ...t, escala: escalas[t.id] ?? ESCALA_PADRAO })),
        ],
        [locais, remotos, escalas]
    );

    const registros = useMemo(() => [...registrosBase, ...registrosRemotos], [registrosRemotos]);

    // Novo rolo vai para o backend
    const adicionar = useCallback(async ({ escala, ...dados }) => {
        const novo = await criarTecido(dados);
        setRemotos((atual) => [...atual, novo]);
        setEscalas((atual) => ({ ...atual, [novo.id]: escala }));
        setUltimoId(novo.id);
        rolagemPendente.current = true;
        return novo;
    }, []);

    // Só para rolos do backend: atualiza saldo e estoque mínimo
    const atualizar = useCallback(async (id, dados) => {
        const atualizado = await atualizarTecido(id, dados);
        setRemotos((atual) => atual.map((t) => (t.id === id ? atualizado : t)));
        return atualizado;
    }, []);

    const nomeExiste = useCallback(
        (nome) => tecidos.some((t) => t.nome.trim().toLowerCase() === nome.trim().toLowerCase()),
        [tecidos]
    );

    const valor = useMemo(
        () => ({ tecidos, registros, adicionar, atualizar, nomeExiste, ultimoId, backendOk, consumirRolagem, recarregar }),
        [tecidos, registros, adicionar, atualizar, nomeExiste, ultimoId, backendOk, consumirRolagem, recarregar]
    );

    return <TecidosContext.Provider value={valor}>{children}</TecidosContext.Provider>;
}
