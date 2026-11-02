import RollIcon from "../components/rollIcon/RollIcon";
import TextField from "../components/textField/TextField";
import Header from '../components/Header/Header';
import { useId, useState } from 'react';

const css = `
.rolo-page {
    --color-text: #6f6254;
    --color-accent: #9a6545;
    --font-serif: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;

    min-height: 100vh;
    background: #f7f2ec;
    color: var(--color-text);
}
.rolo-content { padding: 1rem clamp(1rem, 6vw, 5rem) 4rem; }
.rolo-title {
    margin: 0 0 2rem;
    font-family: var(--font-serif);
    font-weight: 400;
    font-size: clamp(2rem, 4vw, 3rem);
}
.rolo-body {
    display: grid;
    grid-template-columns: minmax(180px, 1fr) minmax(280px, 1.2fr);
    align-items: center;
    gap: clamp(2rem, 8vw, 7rem);
}
.rolo-icon-wrap { display: flex; justify-content: center; }
.rolo-icon { display: block; max-width: 100%; height: auto; }
.rolo-form {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    max-width: 420px;
}

.rolo-field { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
.rolo-label {
    font-family: var(--font-serif);
    font-size: clamp(1.25rem, 2.2vw, 1.75rem);
    color: var(--color-text);
}
.rolo-input {
    width: 100%;
    height: 3.25rem;
    padding: 0 1rem;
    border: 2px solid transparent;
    border-radius: 0.75rem;
    background: #fff;
    color: var(--color-text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.rolo-input:focus-visible {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgb(154 101 69 / 0.2);
}

@media (max-width: 720px) {
    .rolo-body { grid-template-columns: 1fr; }
    .rolo-form { max-width: none; }
}
`;

const CAMPOS = [
    { name: 'metrosIniciais', label: 'Metros iniciais:' },
    { name: 'metrosRetirados', label: 'Metros retirados:' },
    { name: 'estoqueMinimo', label: 'Estoque Mínimo:' },
];

export default function Cadastro({ setTela, nome = 'Marrom', cor = '#9a6545' }) {
    const [valores, setValores] = useState({
        metrosIniciais: '',
        metrosRetirados: '',
        estoqueMinimo: '',
    });

    const handleChange = ({ target }) =>
        setValores((prev) => ({ ...prev, [target.name]: target.value }));

    return (
        <div className="rolo-page">
            <style>{css}</style>

            <Header setTela={setTela} />

            <main className="rolo-content">
                <h1 className="rolo-title">Rolo: {nome}</h1>

                <section className="rolo-body">
                    <div className="rolo-icon-wrap">
                        <RollIcon cor={cor} titulo={`Rolo de tecido ${nome}`} />
                    </div>

                    <form className="rolo-form" onSubmit={(e) => e.preventDefault()}>
                        {CAMPOS.map((campo) => (
                            <TextField
                                key={campo.name}
                                name={campo.name}
                                label={campo.label}
                                type="number"
                                inputMode="decimal"
                                min="0"
                                step="0.01"
                                value={valores[campo.name]}
                                onChange={handleChange}
                            />
                        ))}
                    </form>
                </section>
            </main>
        </div>
    );
}