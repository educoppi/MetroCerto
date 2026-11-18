import { forwardRef } from 'react';
import style from './Button.module.css';



const Button = forwardRef(function Button(
    {
        children,
        variant = 'primary',
        size = 'md',
        loading = false,
        fullWidth = false,
        iconLeft = null,
        iconRight = null,
        disabled = false,
        type = 'button', // evita submit acidental dentro de <form>
        className = '',
        ...rest
    },
    ref
) {
    const classes = [
        style.button,
        style[variant],
        style[size],
        fullWidth && style.fullWidth,
        loading && style.loading,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            ref={ref}
            type={type}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...rest}
        >
            {loading && <span className={style.spinner} aria-hidden="true" />}
            {!loading && iconLeft && <span className={style.icon} aria-hidden="true">{iconLeft}</span>}
            <span className={style.label}>{children}</span>
            {!loading && iconRight && <span className={style.icon} aria-hidden="true">{iconRight}</span>}
            {loading && <span className={style.srOnly}>Carregando</span>}
        </button>
    );
});

export default Button;