import React, {useContext, useEffect} from 'react';
import "./SignUp.css"
import { useForm } from 'react-hook-form';
import {AuthContext} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
// Components
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
// Helpers
import { validateRegisterForm } from "../../helpers/validationHelper"

function SignUp() {
    const navigate = useNavigate();
    const { registerUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    const submitHandler = (data) => {
        validateRegisterForm(data, setError);
        const { repeatPassword, ...restData } = data;
        if (Object.keys(errors).length === 0) {
            restData.enabled = "true";
            restData.newsletter = false;
            console.log(restData);
            registerUser(restData);
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
                                validationRules={{ required: "This field is required" }}
                                register={register}
                                error={errors}
                            />
                            <label htmlFor="age">Age:</label>
                            <Input
                                inputType="text"
                                inputName="age"
                                className="input-field"
                                inputId="age"
                                validationRules={{ required: "This field is required" }}
                                register={register}
                                error={errors}
                            />
                            <label htmlFor="pronouns">Pronouns:</label>
                            <Input
                                inputType="text"
                                inputName="pronouns"
                                className="input-field"
                                inputId="pronouns"
                                validationRules={{ required: "This field is required" }}
                                register={register}
                                error={errors}
                            />
                            <label htmlFor="email">Email:</label>
                            <Input
                                inputType="text"
                                inputName="email"
                                className="input-field"
                                inputId="email"
                                validationRules={{ required: "This field is required" }}
                                register={register}
                                error={errors}
                            />
                            <label htmlFor="phoneNumber">Phone:</label>
                            <Input
                                inputType="text"
                                inputName="phoneNumber"
                                className="input-field"
                                inputId="phoneNumber"
                                validationRules={{ required: "This field is required" }}
                                register={register}
                                error={errors}
                            />
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                className="full-width-textarea"
                                rows="6"
                                cols="80"
                                {...register("bio")}
                            />
                        </div>
                        <div className="form-inputs">
                            <label htmlFor="password">Password:</label>
                            <Input
                                inputType="password"
                                inputName="password"
                                className="input-field"
                                inputId="password"
                                validationRules={{ required: "This field is required" }}
                                register={register}
                                error={errors}
                            />
                            <label htmlFor="password">Repeat Password:</label>
                            <Input
                                inputType="password"
                                inputName="repeatPassword"
                                className="input-field"
                                inputId="password"
                                validationRules={{ required: "This field is required" }}
                                register={register}
                                error={errors}
                            />
                            <div className="password-requirements">
                                <p>Password must be at least 8 characters long</p>
                                <p>Password must contain at least one uppercase letter</p>
                                <p>Password must contain at least one lowercase letter</p>
                                <p>Password must contain at least one number</p>
                                <p>Password must contain at least one special character (such as !@#$%^&*)</p>
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

);
}

export default SignUp;