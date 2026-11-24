// Comunicação com o backend Spring (MetroCerto).
// A URL pode ser trocada com VITE_API_URL no .env do front.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

const requisitar = async (caminho, opcoes = {}) => {
    const resposta = await fetch(`${API_URL}${caminho}`, {
        ...opcoes,
        // Content-Type só quando há corpo: GET simples não dispara preflight de CORS
        headers: opcoes.body ? { 'Content-Type': 'application/json', ...opcoes.headers } : opcoes.headers,
    });
    if (!resposta.ok) {
        let mensagem = `Erro ${resposta.status} no servidor.`;
        try {
            const corpo = await resposta.json();
            if (corpo?.message || corpo?.detail) mensagem = corpo.message || corpo.detail;
        } catch {
            // resposta sem corpo JSON
        }
        const erro = new Error(mensagem);
        erro.status = resposta.status;
        throw erro;
    }
    return resposta.status === 204 ? null : resposta.json();
};

// LocalDateTime chega como "2026-11-24T13:02:55.756833": corta em segundos para o Date do navegador
const normalizarData = (texto) => (texto ? String(texto).slice(0, 19) : texto);

export const estampaUrl = (id) => `${API_URL}/tecidos/${id}/estampa`;

// TecidoResponseDTO -> mesmo formato do front (a imagem vem da rota /estampa)
const deTecido = (t) => ({
    id: t.id,
    nome: t.nome,
    estampa: estampaUrl(t.id),
    saldoAtual: Number(t.saldoAtual),
    estoqueMin: Number(t.estoqueMin),
});

// RegistroResponseDTO -> mesmo formato do front (usuário é ignorado: não há login)
const deRegistro = (r) => ({
    id: r.id,
    idTecido: r.idTecido,
    nomeTecido: r.nomeTecido,
    metroMovimentado: Number(r.metroMovimentado),
    dataHora: normalizarData(r.dataHora),
});

export const buscarTecidos = async () => (await requisitar('/tecidos')).map(deTecido);

export const buscarRegistros = async () => (await requisitar('/registros')).map(deRegistro);

// estampa: data URL ("data:image/jpeg;base64,...") -> o backend espera só o base64 (byte[])
export const criarTecido = async ({ nome, estampa, saldoAtual, estoqueMin }) =>
    deTecido(
        await requisitar('/tecidos', {
            method: 'POST',
            body: JSON.stringify({ nome, estampa: estampa.split(',').pop(), saldoAtual, estoqueMin }),
        })
    );

// Sem estampa no corpo o backend mantém a imagem atual
export const atualizarTecido = async (id, { nome, saldoAtual, estoqueMin }) =>
    deTecido(
        await requisitar(`/tecidos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nome, saldoAtual, estoqueMin }),
        })
    );
