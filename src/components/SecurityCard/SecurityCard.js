import React from 'react';
import "./SecurityCard.css"
import Input from "../Input/Input";
import Button from "../Button/Button";
import {useForm} from "react-hook-form";

function SecurityCard(passwordCardVisibility, setPasswordCardVisibility) {
    const { register: password, handleSubmit: submitPassword, formState: { passwordErrors } } = useForm();

    return (
        <div className="security-content">
            {passwordCardVisibility
                ?
                <div className="password-outer-container">
                    <div className="password-inner-container">
                        <label htmlFor="password">Password: </label>
                        <Input
                            inputType="password"
                            inputName="password"
                            className="input-field"
                            inputId="password"
                            validationRules={{ required: "This field is required" }}
                            register={password}
                            error={passwordErrors}
                        />
                    </div>
                    <div className="password-inner-container">
                        <label htmlFor="password">Repeat Password: </label>
                        <div className="input-container">
                            <Input
                                inputType="password"
                                inputName="repeatPassword"
                                className="input-field"
                                inputId="password"
                                validationRules={{ required: "This field is required" }}
                                register={password}
                                error={passwordErrors}
                            />
                        </div>
                    </div>
                    <div className="requirements-and-button">
                        <div className="password-requirements">
                            <p>Password must be at least 8 characters long</p>
                            <p>Password must contain at least one uppercase letter</p>
                            <p>Password must contain at least one lowercase letter</p>
                            <p>Password must contain at least one number</p>
                            <p>Password must contain at least one special character</p>
                            <p>(such as !@#$%^&*)</p>
                        </div>
                        <div className="save-password">
                            <Button
                                buttonText="Save password"
                                className="event-task-general-button"
                            ></Button>
                        </div>
                    </div>
                </div>
                :
                <Button
                    buttonText="Change password..."
                    className="filter-sort-button"
                    clickHandler={() => {setPasswordCardVisibility(true)}}
                ></Button>
            }
        </div>
    );
}

export default SecurityCard;