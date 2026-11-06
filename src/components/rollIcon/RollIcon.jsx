// Ícone do rolo de tecido; `cor` pinta o rolo inteiro.
export default function RollIcon({ cor = '#111111', titulo = 'Rolo de tecido', tamanho = 220 }) {
    return (
        <svg
            width={tamanho}
            height={tamanho * 1.45}
            viewBox="0 0 210 290"
            role="img"
            aria-label={titulo}
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        >
            <title>{titulo}</title>

            {/* corpo do rolo */}
            <path
                d="M12 40v200c0 22 40 38 90 38s90-16 90-38V40"
                fill={cor} stroke="#000" strokeWidth="22" strokeLinejoin="round"
            />

            {/* topo do rolo (mesma cor, com um leve clareado para dar profundidade) */}
            <ellipse cx="102" cy="40" rx="90" ry="28" fill={cor} stroke="#000" strokeWidth="22" />
            <ellipse cx="102" cy="40" rx="90" ry="28" fill="#fff" fillOpacity="0.25" />
            <rect x="72" y="28" width="60" height="24" rx="12" fill="#000" />

            {/* dobra lateral */}
            <path d="M192 40v200c0 6-3 11-8 14l-6-30V50z" fill="#000" stroke="#000" strokeWidth="10" />
        </svg>
    );
}