import React from 'react';
import './Button.css'

function Button({ buttonText, buttonType = "button", className, id, clickHandler, disabled = false, icon, buttonClass, iconClass }) {
    return (
        <button
            type={buttonType}
            className={className}
            id={id}
            onClick={clickHandler}
            disabled={disabled}
        >
            {icon && <img src={icon} alt="icon" className={iconClass} />}
            {buttonText && <span className={buttonClass ? "menu-pane-buttons" : "button-text"}>{buttonText}</span>}
        </button>
    );
}

export default Button;