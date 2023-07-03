import React from 'react';
import './Button.css'

function Button({ buttonText, buttonType = "button", className, id, clickHandler, disabled = false, icon }) {
    return (
        <button
            type={buttonType}
            className={className}
            id={id}
            onClick={clickHandler}
            disabled={disabled}
        >
            {icon && <img src={icon} alt="icon" className="icon-space" />}
            {buttonText && <span className="button-text">{buttonText}</span>}
        </button>
    );
}

export default Button;