import { useId } from 'react';

/**
 * RollIcon
 * ------------------------------------------------------------
 * cor:     cor lisa que pinta o rolo inteiro
 * imagem:  URL de uma estampa (ex.: floral.png); tem prioridade sobre `cor`
 * titulo:  texto alternativo para leitores de tela
 * tamanho: largura em px (a altura segue a proporção)
 */
export default function RollIcon({
    cor = '#9a6545',
    imagem = null,
    titulo = 'Rolo de tecido',
    tamanho = 220,
}) {
    // id único por ícone (vários rolos na mesma página); remove ":" do useId
    const patternId = `estampa-${useId().replace(/:/g, '')}`;
    const preenchimento = imagem ? `url(#${patternId})` : cor;

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

            {imagem && (
                <defs>
                    {/* a estampa cobre o ícone todo, sem distorcer (slice) */}
                    <pattern
                        id={patternId}
                        patternUnits="userSpaceOnUse"
                        x="0" y="0" width="210" height="290"
                    >
                        <image
                            href={imagem}
                            x="0" y="0" width="210" height="290"
                            preserveAspectRatio="xMidYMid slice"
                        />
                    </pattern>
                </defs>
            )}

            {/* corpo do rolo */}
            <path
                d="M12 40v200c0 22 40 38 90 38s90-16 90-38V40"
                fill={preenchimento} stroke="#000" strokeWidth="22" strokeLinejoin="round"
            />

            {/* topo do rolo (mesmo preenchimento, levemente clareado) */}
            <ellipse cx="102" cy="40" rx="90" ry="28" fill={preenchimento} stroke="#000" strokeWidth="22" />
            <ellipse cx="102" cy="40" rx="90" ry="28" fill="#fff" fillOpacity="0.25" />
            <rect x="72" y="28" width="60" height="24" rx="12" fill="#000" />

            {/* dobra lateral */}
            <path d="M192 40v200c0 6-3 11-8 14l-6-30V50z" fill="#000" stroke="#000" strokeWidth="10" />
        </svg>
    );
}