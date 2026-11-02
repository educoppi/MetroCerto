export default function RollIcon({ cor = '#9a6545', titulo = 'Rolo de tecido', tamanho = 220 }) {
    return (
        <svg
            className="rolo-icon"
            width={tamanho}
            height={tamanho * 1.45}
            viewBox="0 0 210 290"
            role="img"
            aria-label={titulo}
        >
            <title>{titulo}</title>
            <path
                d="M12 40v200c0 22 40 38 90 38s90-16 90-38V40"
                fill="#fff" stroke="#000" strokeWidth="22" strokeLinejoin="round"
            />
            <ellipse cx="102" cy="40" rx="90" ry="28" fill="#fff" stroke="#000" strokeWidth="22" />
            <rect x="72" y="28" width="60" height="24" rx="12" fill="#000" />
            <path d="M192 40v200c0 6-3 11-8 14l-6-30V50z" fill="#000" stroke="#000" strokeWidth="10" />
            <rect x="40" y="100" width="124" height="130" fill={cor} />
        </svg>
    );
}