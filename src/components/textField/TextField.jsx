import { useId } from "react";

export default function TextField({ label, id, ...inputProps }) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="rolo-field">
            <label htmlFor={inputId} className="rolo-label">{label}</label>
            <input id={inputId} className="rolo-input" {...inputProps} />
        </div>
    );
}