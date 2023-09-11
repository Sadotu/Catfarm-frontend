import React, {useContext, useEffect, useState} from 'react';
import "./SignUp.css"
import { useForm } from 'react-hook-form';
import {AuthContext} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
// Components
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

function SignUp() {
    const navigate = useNavigate();
    const { registerUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch("password");

    const [statusMessages, setStatusMessages] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        if (password) {
            const updateStatus = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password),
                specialChar: /[!@#$%^&*]/.test(password),
            };
            setStatusMessages(updateStatus);
        }
    }, [password]);


    const submitHandler = (data) => {
        const { repeatPassword, ...restData } = data;
        if (Object.keys(errors).length === 0) {
            restData.enabled = "true";
            restData.newsletter = false;
            console.log(restData);
            registerUser(restData);
            if (restData.age !== undefined && restData.age !== null) {
                restData.age = String(restData.age);
            }
        }
    };

    return (
        <div className="register-outer-container">
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="register-inner-container">
                    <div className="sign-up-form">
                        <div className="form-inputs">
                            <label htmlFor="fullName">Full Name:</label>
                            <Input
                                inputType="text"
                                inputName="fullName"
                                className="input-field"
                                inputId="fullName"
                                validationRules={{
                                    required: "This field is required",
                                    maxLength: { value: 75, message: "Full name cannot be more than 75 characters long" }
                                }}
                                register={register}
                                error={errors}
                            />

                            <label htmlFor="age">Age:</label>
                            <Input
                                inputType="number"
                                inputName="age"
                                className="input-field"
                                inputId="age"
                                validationRules={{
                                    required: "This field is required",
                                    min: { value: 0, message: "Age must be between 0 and 120" },
                                    max: { value: 120, message: "Age must be between 0 and 120" }
                                }}
                                register={register}
                                error={errors}
                            />

                            <label htmlFor="pronouns">Pronouns:</label>
                            <Input
                                inputType="text"
                                inputName="pronouns"
                                className="input-field"
                                inputId="pronouns"
                                validationRules={{
                                    required: "This field is required"
                                }}
                                register={register}
                                error={errors}
                            />

                            <label htmlFor="email">Email:</label>
                            <Input
                                inputType="text"
                                inputName="email"
                                className="input-field"
                                inputId="email"
                                validationRules={{
                                    required: "This field is required",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Valid email is required"
                                    }
                                }}
                                register={register}
                                error={errors}
                            />

                            <label htmlFor="phoneNumber">Phone:</label>
                            <Input
                                inputType="text"
                                inputName="phoneNumber"
                                className="input-field"
                                inputId="phoneNumber"
                                validationRules={{
                                    required: "This field is required",
                                    pattern: {
                                        value: /^\+?[0-9-]+$/,
                                        message: "Invalid phone number"
                                    }
                                }}
                                register={register}
                                error={errors}
                            />

                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                className="full-width-textarea"
                                rows="6"
                                cols="80"
                                {...register("bio", {
                                    maxLength: { value: 5000, message: "Bio cannot be more than 5000 characters" }
                                })}
                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="password">Password:</label>
                            <Input
                                inputType="password"
                                inputName="password"
                                className="input-field"
                                inputId="password"
                                validationRules={{
                                    required: "This field is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters long" },
                                    pattern: {
                                        value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
                                        message: "Password does not meet requirements"
                                    }
                                }}
                                register={register}
                                error={errors}
                            />
                            <label htmlFor="password">Repeat Password:</label>
                            <Input
                                inputType="password"
                                inputName="repeatPassword"
                                className="input-field"
                                inputId="repeatPassword"
                                validationRules={{
                                    required: "This field is required",
                                    validate: value => value === password || "Passwords must match"
                                }}
                                register={register}
                                error={errors}
                            />
                            <div className="password-requirements">
                                <p style={{ color: statusMessages.length ? 'black' : 'red' }}>
                                    Password must be at least 8 characters long
                                </p>
                                <p style={{ color: statusMessages.uppercase ? 'black' : 'red' }}>
                                    Password must contain at least one uppercase letter
                                </p>
                                <p style={{ color: statusMessages.lowercase ? 'black' : 'red' }}>
                                    Password must contain at least one lowercase letter
                                </p>
                                <p style={{ color: statusMessages.number ? 'black' : 'red' }}>
                                    Password must contain at least one number
                                </p>
                                <p style={{ color: statusMessages.specialChar ? 'black' : 'red' }}>
                                    Password must contain at least one special character
                                </p>
                                <p style={{ color: statusMessages.specialChar ? 'black' : 'red' }}>
                                    (such as !@#$%^&*)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="register-form-buttons">
                        <Button
                            buttonType="submit"
                            buttonText="Sign up"
                            className="general-button"
                        ></Button>
                        <Button
                            buttonText="Sign in"
                            className="filter-sort-button"
                            clickHandler={() => {navigate("/login")}}
                        ></Button>
                    </div>
                </div>
            </form>
        </div>

)};

export default SignUp;