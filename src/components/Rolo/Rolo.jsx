import './Rolo.css';

export default function Rolo({ imagem, escala, grande = false, interativo = false }) {
    const estilo = {
        '--estampa': imagem ? `url(${imagem})` : 'none',
        '--escala': escala,
    };

    const classes = ['rolo', grande && 'rolo--grande', interativo && 'rolo--interativo'].filter(Boolean).join(' ');

    return (
        <div className={classes} style={estilo} aria-hidden="true">
            <span className="rolo__sombra" />
            <span className="rolo__aba" />
            <span className="rolo__corpo" />
            <span className="rolo__ponta">
                <span className="rolo__tubo" />
            </span>
        </div>
    );
}
