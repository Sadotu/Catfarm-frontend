import React from 'react';

function Button({ buttonText, buttonType = "button", className, clickHandler, disabled = "false" }) {
    return (
        <button
            type={buttonType}
            className={className}
            onClick={clickHandler}
            disabled={disabled}
        >{buttonText}</button>
    );
}

export default Button;