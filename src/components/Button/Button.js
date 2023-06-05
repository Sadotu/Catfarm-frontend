import React from 'react';
import './Button.css'

function Button({ buttonText, buttonType = "button", className, clickHandler, disabled = false, icon }) {
    return (
        <button
            type={buttonType}
            className={className}
            onClick={clickHandler}
            disabled={disabled}
        >
            {icon && <span className="button-icon">{icon}</span>}
            {buttonText && <span className="button-text">{buttonText}</span>}
        </button>
    );
}

export default Button;