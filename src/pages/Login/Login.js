import React, { useContext } from 'react';
import "./Login.css"
import {useNavigate} from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import axios from "axios";
// Components
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

function Login() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();

    const submitHandler = async (data) => {
        try {
            const res = await axios.post(
                'http://localhost:8080/authenticate', {
                    'username': data.email,
                    'password': data.password
                }
            )
            login(res.data.jwt, "/profile");
        } catch (e) {
            reset();
            console.error("Invalid email or password", e);
            setError("email", {
                type: "manual",
                message: "Invalid email or password"
            });
            setError("password", {
                type: "manual",
                message: "Invalid email or password"
            });
        }

    };

    return (
        <>
            <div className="login-outer-container">
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="login-inner-container">
                        <div className="login-form-inputs">
                            <label className="form-label">Email: </label>
                            <Input
                                className="input-field"
                                inputType="text"
                                inputName="email"
                                inputId="email"
                                validationRules={{ required: "Dit veld is verplicht" }}
                                register={register}
                                error={errors}
                            />
                            <label className="form-label">Password: </label>
                            <Input
                                className="input-field"
                                inputType="password"
                                inputName="password"
                                inputId="password"
                                validationRules={{ required: "Dit veld is verplicht" }}
                                register={register}
                                error={errors}
                            />
                        </div>
                        <div className="login-form-buttons">
                            <Button
                                buttonType="submit"
                                buttonText="Inloggen"
                                className="general-button"
                            ></Button>
                            <Button
                                buttonText="Sign up!"
                                className="filter-sort-button"
                                clickHandler={() => {navigate("/signup")}}
                            ></Button>
                        </div>
                    </div>
                </form>
            </div>


        </>
    );
}

export default Login;