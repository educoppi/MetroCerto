import Icon from '../Icon';
import style from './style.module.css';

export default function Header() {

    return (
        <>
            <header>
                <Icon />
                <nav>
                    <a href="">ESTOQUE</a>
                    <a href="">INFO</a>
                    <a href="">ACOMPANHAMENTO</a>
                    <a href="">CADASTRAR TECIDO</a>
                </nav>
            </header>
        </>
    )
}

