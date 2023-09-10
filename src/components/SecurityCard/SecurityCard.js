import React, {useContext, useEffect, useState} from 'react';
import "./SecurityCard.css"
import {Controller, useForm} from "react-hook-form";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
// Components
import Input from "../Input/Input";
import Button from "../Button/Button";
// Helpers
import {fetchEnabledUsers} from "../../helpers/fetchHelper";

function SecurityCard({ passwordCardVisibility, setPasswordCardVisibility, activeSecurityHeader }) {
    const { user } = useContext(AuthContext);
    const [activeUsers, setActiveUsers] = useState([]);
    const roles = ['ROLE_KITTEN', 'ROLE_CAT', 'ROLE_LION'];
    const { register: password, handleSubmit: submitPassword, formState: { passwordErrors } } = useForm();
    const { control, handleSubmit: submitRole } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await fetchEnabledUsers();
                setActiveUsers(users);
            } catch (error) {
                console.log(error)
            }
        };
        fetchData();
    },[]);

    async function updatePassword(data) {
        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `http://localhost:8080/users/update_password/${user.email}`,
                data,
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setPasswordCardVisibility(false)

        } catch (error) {
            console.error("Failed to update user:", error);
        }
    }

    const updateRole = () => {
        // Your role updating logic here
    };

    return (
        <div className="security-content">
            {passwordCardVisibility
                ? (
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
                                inputId="repeatPassword"
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
                                clickHandler={submitPassword(updatePassword, (errors) => {
                                    console.log("Failed", errors);
                                })}
                            ></Button>
                        </div>
                    </div>
                </div>
                ) : (
            activeSecurityHeader === "Password" && (
            <Button
                buttonText="Change password..."
                className="filter-sort-button"
                clickHandler={() => {
                    setPasswordCardVisibility(true);
                }}
            ></Button>
            )
            )}
            {activeSecurityHeader === "Roles" && passwordCardVisibility === false &&
                <>
                    <Controller
                        name="user"
                        control={control}
                        render={({ field }) => (
                            <select {...field}>
                                {activeUsers.map((user, index) => (
                                    <option key={index} value={user.fullName}>{user.fullName}</option>
                                ))}
                            </select>
                        )}
                    />

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <select {...field}>
                                {roles.map((role, index) => (
                                    <option key={index} value={role}>{role}</option>
                                ))}
                            </select>
                        )}
                    />

                    <Button
                        buttonText="Save role"
                        className="event-task-general-button"
                        clickHandler={submitRole(updateRole, (errors) => {
                            console.log("Failed", errors);
                        })}
                    ></Button>
                </>
            }
        </div>
    );
}

export default SecurityCard;