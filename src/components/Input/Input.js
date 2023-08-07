import React from 'react';

function Input({ inputType, className, inputName, inputLabel, register, inputId, validationRules, error }) {

    return (
        <>
            <input
                type={inputType}
                className={className}
                id={inputId}
                placeholder={inputLabel}
                {...register(inputName, validationRules)}
            />
            {error[inputName] && <p>{error[inputName].message}</p>}
        </>
    );
}

export default Input;