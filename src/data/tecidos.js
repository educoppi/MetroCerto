import marrom from '../assets/Images/marrom.png';
import cinza from '../assets/Images/cinza.png';
import morangos from '../assets/Images/morangos.png';
import amarelo from '../assets/Images/amarelo.png';
import floral from '../assets/Images/floral.png';
import sakura from '../assets/Images/sakura.png';

export const tecidos = [
    { id: 'RL-0101', nome: 'Marrom', imagem: marrom, escala: '120px', metrosIniciais: 30, estoqueMinimo: 10 },
    { id: 'RL-0102', nome: 'Cinza', imagem: cinza, escala: '120px', metrosIniciais: 50, estoqueMinimo: 10 },
    { id: 'RL-0103', nome: 'Morangos', imagem: morangos, escala: '70px', metrosIniciais: 25, estoqueMinimo: 8 },
    { id: 'RL-0104', nome: 'Amarelo', imagem: amarelo, escala: '120px', metrosIniciais: 20, estoqueMinimo: 6 },
    { id: 'RL-0105', nome: 'Floral', imagem: floral, escala: '90px', metrosIniciais: 40, estoqueMinimo: 8 },
    { id: 'RL-0106', nome: 'Sakura', imagem: sakura, escala: '80px', metrosIniciais: 15, estoqueMinimo: 5 },
];

export const tecidoPorNome = Object.fromEntries(tecidos.map((t) => [t.nome, t]));

export const retiradas = [
    { id: 1, data: '2026-11-17T09:42', rolo: 'RL-0105', estampa: 'Floral', metros: 4.5 },
    { id: 2, data: '2026-11-16T16:10', rolo: 'RL-0103', estampa: 'Morangos', metros: 2.25 },
    { id: 3, data: '2026-11-16T11:05', rolo: 'RL-0101', estampa: 'Marrom', metros: 8 },
    { id: 4, data: '2026-11-14T15:30', rolo: 'RL-0106', estampa: 'Sakura', metros: 3 },
    { id: 5, data: '2026-11-14T10:18', rolo: 'RL-0102', estampa: 'Cinza', metros: 12.5 },
    { id: 6, data: '2026-11-13T17:45', rolo: 'RL-0104', estampa: 'Amarelo', metros: 1.75 },
    { id: 7, data: '2026-11-12T14:02', rolo: 'RL-0105', estampa: 'Floral', metros: 6 },
    { id: 8, data: '2026-11-11T09:20', rolo: 'RL-0103', estampa: 'Morangos', metros: 5.5 },
    { id: 9, data: '2026-11-10T13:37', rolo: 'RL-0101', estampa: 'Marrom', metros: 3.25 },
    { id: 10, data: '2026-11-07T16:55', rolo: 'RL-0106', estampa: 'Sakura', metros: 7 },
    { id: 11, data: '2026-11-06T10:40', rolo: 'RL-0102', estampa: 'Cinza', metros: 2 },
    { id: 12, data: '2026-11-05T15:12', rolo: 'RL-0104', estampa: 'Amarelo', metros: 9.5 },
    { id: 13, data: '2026-11-04T11:28', rolo: 'RL-0105', estampa: 'Floral', metros: 1.5 },
    { id: 14, data: '2026-11-03T14:50', rolo: 'RL-0103', estampa: 'Morangos', metros: 4 },
    { id: 15, data: '2026-10-31T09:15', rolo: 'RL-0101', estampa: 'Marrom', metros: 10 },
    { id: 16, data: '2026-10-30T17:05', rolo: 'RL-0106', estampa: 'Sakura', metros: 2.75 },
    { id: 17, data: '2026-10-29T13:22', rolo: 'RL-0102', estampa: 'Cinza', metros: 6.5 },
    { id: 18, data: '2026-10-28T10:00', rolo: 'RL-0104', estampa: 'Amarelo', metros: 3.5 },
];

export const HOJE = '2026-11-17';

export const retiradoPorEstampa = (nome) =>
    retiradas.filter((r) => r.estampa === nome).reduce((soma, r) => soma + r.metros, 0);

export const situacaoRolo = (tecido) => {
    const retirado = retiradoPorEstampa(tecido.nome);
    const saldo = Math.max(tecido.metrosIniciais - retirado, 0);
    let status = 'ok';
    if (saldo <= tecido.estoqueMinimo / 2) status = 'critico';
    else if (saldo <= tecido.estoqueMinimo) status = 'alerta';
    return { ...tecido, retirado, saldo, status };
};
