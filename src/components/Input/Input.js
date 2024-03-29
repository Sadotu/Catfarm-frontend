import React from 'react';
import "./Input.css"

function Input({
                   signup = false,
                   inputType,
                   className,
                   inputName,
                   defaultValue,
                   register,
                   inputId,
                   validationRules,
                   error,
                   disabled = false,
                   style = {},
               }) {

    return (
        <>
            <input
                type={inputType}
                className={className}
                id={inputId}
                defaultValue={defaultValue}
                {...register(inputName, validationRules)}
                disabled={disabled}
                style={style}
            />
            {error && error[inputName] && <p className={signup ? 'input-error-signup' : 'input-error'}>{error[inputName].message}</p>}

        </>
    );
}

export default Input;
