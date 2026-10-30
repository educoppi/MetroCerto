import Icon from '../Icon/Icon';
import style from './Header.module.css';

// Receba setTela como desestruturação nas props
export default function Header({ setTela }) {
    return (
        <header>
            <Icon onClick={() => setTela('home')} />
            <nav>
                <a onClick={() => setTela('estoque')}>ESTOQUE</a>
                <a onClick={() => setTela('info')}>INFO</a>
                <a onClick={() => setTela('acompanhamento')}>ACOMPANHAMENTO</a>
                <a onClick={() => setTela('cadastro')}>CADASTRAR TECIDO</a>
            </nav>
        </header>
    )
}