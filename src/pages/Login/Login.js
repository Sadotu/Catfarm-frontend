import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

function Login() {
    const { login } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const submitHandler = async (data) => {
        try {
            const res = await axios.post(
                'http://localhost:8080/authenticate', {
                    'username': data.email,
                    'password': data.password
                }
            )
            login(res.data.jwt, "/profile")
        } catch (e) {
            console.error("Onjuist email and wachtwoord combinatie", e)
            reset()
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="container">
                    <div className="input-container">
                        <label className="form-label">Email: </label>
                        <Input
                            inputType="text"
                            inputName="email"
                            inputId="email"
                            validationRules={{ required: "Dit veld is verplicht" }}
                            register={register}
                            error={errors}
                        />
                    </div>
                    <div className="input-container">
                        <label className="form-label">Password: </label>
                        <Input
                            inputType="text"
                            inputName="password"
                            inputId="password"
                            validationRules={{ required: "Dit veld is verplicht" }}
                            register={register}
                            error={errors}
                        />
                    </div>
                    <Button
                        buttonType="submit"
                        buttonText="Inloggen"
                        className="general-button"
                    ></Button>
                </div>
            </form>

            <Link to="/signup">Sign up!</Link>
        </>
    );
}

export default Login;