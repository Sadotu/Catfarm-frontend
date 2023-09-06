import React, {createContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import axios from "axios";
// Helpers
import {checkTokenValidity} from "../helpers/checkTokenValidity";

function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState({
        isAuth: false,
        user: null,
        status: "pending"
    });

    const navigate = useNavigate();

    const registerUser = async (data) => {
        try {
            await axios.post('http://localhost:8080/users/create', data, {
                headers: {
                    'Content-type': 'application/json'
                }
            });
            console.log("Hoera, je hebt een nieuw account aangemaakt!")
            console.log("Probeer ermee in te loggen")
            navigate("/login")
        } catch (error) {
            console.error("Er is iets misgegaan bij de invoer, probeer het nog eens", error);
        }
    };

    useEffect( () => {
        const storedToken = localStorage.getItem('token')
        // const storedToken = `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbWlseS5kYXZpc0BleGFtcGxlLmNvbSIsImlhdCI6MTY5MjE3Mzg3OSwiZXhwIjoxNjkzMDM3ODc5fQ.zOPCxUUib2xv0Jp7d_fgVU8ZC3BAK-9RfTdFi_oWDeE`;
        if (storedToken && checkTokenValidity(storedToken)) {
            void login( storedToken )
        } else {
            setAuth({
                ...auth,
                isAuth: false,
                user: null,
                status: "done"
            })
        }
    }, [])

    async function login(jwt_token, redirect) {
        const decodedToken = jwt_decode(jwt_token);
        localStorage.setItem('token', jwt_token);

        try {
            const response = await axios.get(`http://localhost:8080/users/${decodedToken.sub}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                }
            });

            setAuth({
                ...auth,
                isAuth: true,
                user: response.data,
                status: "done"
            });
            console.log("De gebruiker is ingelogd!");
            if (redirect) {navigate(redirect);}
        } catch (error) {
            console.error("Er is een fout opgetreden bij het ophalen van de gebruikersgegevens", error);
        }
    }

    const updateUser = (updatedUser) => {
        setAuth(prevAuth => ({
            ...prevAuth,
            user: updatedUser
        }));
    };

    function logout() {
        localStorage.removeItem('token')
        setAuth({
            ...auth,
            isAuth: false,
            user: null
        })
        console.log("De gebruiker is uitgelogd!")
        navigate("/login")
    }

    const data = {
        isAuth: auth.isAuth,
        user: auth.user,
        registerUser,
        login: login,
        logout: logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={data}>
            { auth.status === "done" ? children : <p>Loading...</p> }
        </AuthContext.Provider>
    );
}

export const AuthContext = createContext(null)

export default AuthContextProvider;