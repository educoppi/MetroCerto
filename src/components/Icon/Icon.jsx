import Logo from '../../assets/logo.png';
import style from './Icon.module.css';

export default function Icon({ onClick }) {
    return (
        <button type="button" className={style.marca} onClick={onClick} aria-label="Ir para a página inicial">
            <img className={style.logo} src={Logo} alt="MetroCerto" />
        </button>
    );
}
