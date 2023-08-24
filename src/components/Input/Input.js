import React from 'react';

function Input({
                   inputType,
                   className,
                   inputName,
                   defaultValue,
                   register,
                   inputId,
                   validationRules,
                   error,
                   disabled = false,
                   style = {}
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
            {error[inputName] && <p>{error[inputName].message}</p>}
        </>
    );
}

export default Input;
