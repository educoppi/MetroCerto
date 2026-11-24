import marrom from '../assets/Images/marrom.png';
import cinza from '../assets/Images/cinza.png';
import morangos from '../assets/Images/morangos.png';
import amarelo from '../assets/Images/amarelo.png';
import floral from '../assets/Images/floral.png';
import sakura from '../assets/Images/sakura.png';

// Dados locais do front, no mesmo formato do backend:
//   Tecido   -> { id, nome, estampa, saldoAtual, estoqueMin }      (+ escala: só visual)
//   Registro -> { id, idTecido, nomeTecido, metroMovimentado, dataHora }
// Ids locais são texto ('RL-0101'); ids do backend são números.

export const tecidos = [
    { id: 'RL-0101', nome: 'Marrom', estampa: marrom, escala: '120px', saldoAtual: 8.75, estoqueMin: 10 },
    { id: 'RL-0102', nome: 'Cinza', estampa: cinza, escala: '120px', saldoAtual: 29, estoqueMin: 10 },
    { id: 'RL-0103', nome: 'Morangos', estampa: morangos, escala: '70px', saldoAtual: 13.25, estoqueMin: 8 },
    { id: 'RL-0104', nome: 'Amarelo', estampa: amarelo, escala: '120px', saldoAtual: 5.25, estoqueMin: 6 },
    { id: 'RL-0105', nome: 'Floral', estampa: floral, escala: '90px', saldoAtual: 28, estoqueMin: 8 },
    { id: 'RL-0106', nome: 'Sakura', estampa: sakura, escala: '80px', saldoAtual: 2.25, estoqueMin: 5 },
];

export const registros = [
    { id: 'L1', dataHora: '2026-11-17T09:42', idTecido: 'RL-0105', nomeTecido: 'Floral', metroMovimentado: 4.5 },
    { id: 'L2', dataHora: '2026-11-16T16:10', idTecido: 'RL-0103', nomeTecido: 'Morangos', metroMovimentado: 2.25 },
    { id: 'L3', dataHora: '2026-11-16T11:05', idTecido: 'RL-0101', nomeTecido: 'Marrom', metroMovimentado: 8 },
    { id: 'L4', dataHora: '2026-11-14T15:30', idTecido: 'RL-0106', nomeTecido: 'Sakura', metroMovimentado: 3 },
    { id: 'L5', dataHora: '2026-11-14T10:18', idTecido: 'RL-0102', nomeTecido: 'Cinza', metroMovimentado: 12.5 },
    { id: 'L6', dataHora: '2026-11-13T17:45', idTecido: 'RL-0104', nomeTecido: 'Amarelo', metroMovimentado: 1.75 },
    { id: 'L7', dataHora: '2026-11-12T14:02', idTecido: 'RL-0105', nomeTecido: 'Floral', metroMovimentado: 6 },
    { id: 'L8', dataHora: '2026-11-11T09:20', idTecido: 'RL-0103', nomeTecido: 'Morangos', metroMovimentado: 5.5 },
    { id: 'L9', dataHora: '2026-11-10T13:37', idTecido: 'RL-0101', nomeTecido: 'Marrom', metroMovimentado: 3.25 },
    { id: 'L10', dataHora: '2026-11-07T16:55', idTecido: 'RL-0106', nomeTecido: 'Sakura', metroMovimentado: 7 },
    { id: 'L11', dataHora: '2026-11-06T10:40', idTecido: 'RL-0102', nomeTecido: 'Cinza', metroMovimentado: 2 },
    { id: 'L12', dataHora: '2026-11-05T15:12', idTecido: 'RL-0104', nomeTecido: 'Amarelo', metroMovimentado: 9.5 },
    { id: 'L13', dataHora: '2026-11-04T11:28', idTecido: 'RL-0105', nomeTecido: 'Floral', metroMovimentado: 1.5 },
    { id: 'L14', dataHora: '2026-11-03T14:50', idTecido: 'RL-0103', nomeTecido: 'Morangos', metroMovimentado: 4 },
    { id: 'L15', dataHora: '2026-10-31T09:15', idTecido: 'RL-0101', nomeTecido: 'Marrom', metroMovimentado: 10 },
    { id: 'L16', dataHora: '2026-10-30T17:05', idTecido: 'RL-0106', nomeTecido: 'Sakura', metroMovimentado: 2.75 },
    { id: 'L17', dataHora: '2026-10-29T13:22', idTecido: 'RL-0102', nomeTecido: 'Cinza', metroMovimentado: 6.5 },
    { id: 'L18', dataHora: '2026-10-28T10:00', idTecido: 'RL-0104', nomeTecido: 'Amarelo', metroMovimentado: 3.5 },
];

export const ESCALA_PADRAO = '90px';

// Tecido do backend tem id numérico; os do front, texto
export const doBackend = (tecido) => typeof tecido?.id === 'number';

// Código exibido na tela: locais já são 'RL-0101'; backend vira 'RL-0001', 'RL-0002'...
export const codigoRolo = (id) => (typeof id === 'number' ? `RL-${String(id).padStart(4, '0')}` : id);

// Data de hoje no fuso local, no formato 'AAAA-MM-DD'
export const hojeIso = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const registrosDoTecido = (lista, tecido) => lista.filter((r) => r.idTecido === tecido.id);

export const retiradoDoTecido = (lista, tecido) =>
    registrosDoTecido(lista, tecido).reduce((soma, r) => soma + r.metroMovimentado, 0);

// O backend guarda só o saldo; os metros iniciais são o saldo + tudo que já foi retirado
export const situacaoRolo = (tecido, lista) => {
    const retirado = retiradoDoTecido(lista, tecido);
    const saldo = Math.max(tecido.saldoAtual, 0);
    const metrosIniciais = saldo + retirado;
    let status = 'ok';
    if (saldo <= tecido.estoqueMin / 2) status = 'critico';
    else if (saldo <= tecido.estoqueMin) status = 'alerta';
    return { ...tecido, retirado, saldo, metrosIniciais, status };
};
