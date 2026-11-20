import { useCallback, useMemo, useRef, useState } from 'react';
import { tecidos as tecidosBase } from './tecidos';
import { TecidosContext } from './TecidosContext';

const CHAVE = 'metrocerto:rolos-cadastrados';

const carregar = () => {
    try {
        const salvos = JSON.parse(localStorage.getItem(CHAVE));
        return Array.isArray(salvos) ? salvos : [];
    } catch {
        return [];
    }
};

const salvar = (lista) => {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(lista));
        return true;
    } catch {
        return false;
    }
};

const proximoId = (lista) => {
    const maior = Math.max(...lista.map((t) => Number(t.id.replace(/\D/g, '')) || 0), 100);
    return `RL-${String(maior + 1).padStart(4, '0')}`;
};

export default function TecidosProvider({ children }) {
    const [cadastrados, setCadastrados] = useState(carregar);
    const [ultimoId, setUltimoId] = useState(null);
    const [erroArmazenamento, setErroArmazenamento] = useState(false);
    const rolagemPendente = useRef(false);

    const consumirRolagem = useCallback(() => {
        const pendente = rolagemPendente.current;
        rolagemPendente.current = false;
        return pendente;
    }, []);

    const tecidos = useMemo(() => [...tecidosBase, ...cadastrados], [cadastrados]);

    const adicionar = useCallback(
        (dados) => {
            const novo = { ...dados, id: proximoId(tecidos), criadoEm: new Date().toISOString() };
            const lista = [...cadastrados, novo];
            setCadastrados(lista);
            setErroArmazenamento(!salvar(lista));
            setUltimoId(novo.id);
            rolagemPendente.current = true;
            return novo;
        },
        [tecidos, cadastrados]
    );

    const nomeExiste = useCallback(
        (nome) => tecidos.some((t) => t.nome.trim().toLowerCase() === nome.trim().toLowerCase()),
        [tecidos]
    );

    const valor = useMemo(
        () => ({ tecidos, adicionar, nomeExiste, ultimoId, erroArmazenamento, consumirRolagem, proximoId: proximoId(tecidos) }),
        [tecidos, adicionar, nomeExiste, ultimoId, erroArmazenamento, consumirRolagem]
    );

    return <TecidosContext.Provider value={valor}>{children}</TecidosContext.Provider>;
}
