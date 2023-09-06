import React, {useContext} from 'react';
import "./SignUp.css"
import {AuthContext} from "../../context/AuthContext";
// Components
import {Button} from "../../components/Button/Button"
import {Input} from "../../components/Input/Input"

function SignUp(props) {
    const { registerUser } = useContext(AuthContext)

    return (
        <div></div>
    );
}

export default SignUp;