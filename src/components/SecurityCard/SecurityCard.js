import React, {useContext, useEffect, useState} from 'react';
import "./SecurityCard.css"
import {useForm} from "react-hook-form";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
// Components
import Input from "../Input/Input";
import Button from "../Button/Button";
// Helpers
import {fetchEnabledUsers} from "../../helpers/CRUDTaskHelper";

function SecurityCard({ passwordCardVisibility, setPasswordCardVisibility, activeSecurityHeader }) {
    const {user} = useContext(AuthContext);
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const roles = ['ROLE_KITTEN', 'ROLE_CAT', 'ROLE_LION'];
    const {register, handleSubmit: submitPassword, formState: {errors}, watch} = useForm();
    const {handleSubmit: submitRole} = useForm();
    const password = watch("password");

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
    }, [selectedUser]);

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

    async function updatePassword(data) {
        if (Object.values(statusMessages).every(value => value === true)) {
            const token = localStorage.getItem('token');

            try {
                await axios.put(
                    `http://localhost:8080/users/update_password/${user.email}`,
                    data,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json'
                        }
                    }
                );

                setPasswordCardVisibility(false)
                setStatusMessages([{successPasswordChange: "Password updated successfully!"}]);

            } catch (error) {
                console.error("Failed to update user:", error);
            }

        }
    }

    const updateRole = async (selectedUserEmail, selectedRole) => {
        const token = localStorage.getItem('token');

        const selectedUser = activeUsers.find(user => user.email === selectedUserEmail);

        if (selectedUser.authorities.some(auth => auth.authority === selectedRole)) {
            setStatusMessages([{roleChange: "Role is already assigned to the user."}]);
            return;
        }

        // Remove current role
        if (selectedUser.authorities.length > 0) {
            try {
                await axios.delete(
                    `http://localhost:8080/users/remove_authorities/${selectedUserEmail}/${selectedUser.authorities[0].authority}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (error) {
                console.error("Failed to remove current role:", error);
                return;
            }
        }

        // Add new role
        try {
            await axios.post(
                `http://localhost:8080/users/add_authorities/${selectedUserEmail}`,
                {
                    authority: selectedRole
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    }
                }
            );
            setSelectedRole('')
            setSelectedUser('')
            setStatusMessages([{roleChange: "Role is assigned to the user."}]);
        } catch (error) {
            console.error("Failed to add new role:", error);
        }
    };


    return (
        <div className="security-content">
            {passwordCardVisibility
                ? (
                    <div className="password-outer-container">
                        <div className="password-inner-container">
                            <div className="password-card-label">
                                <label htmlFor="password">Password: </label>
                            </div>
                            <div className="input-container">
                                <Input
                                    inputType="password"
                                    inputName="password"
                                    inputId="password"
                                    className={`input-field ${Object.values(statusMessages).some(value => value === false) ? 'password-error' : ''}`}
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
                            </div>
                        </div>
                        <div className="password-inner-container">
                            <div className="password-card-label">
                                <label htmlFor="password">Repeat Password: </label>
                            </div>
                            <div className="input-container">
                                <Input
                                    inputType="password"
                                    inputName="repeatPassword"
                                    className={`input-field ${Object.values(statusMessages).some(value => value === false) ? 'password-error' : ''}`}
                                    inputId="repeatPassword"
                                    validationRules={{
                                        required: "This field is required",
                                        validate: value => value === password || "Passwords must match"
                                    }}
                                    register={register}
                                    error={errors}
                                />
                            </div>
                        </div>
                        <div className="requirements-and-button">
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
                        <div className="password-content">
                            <Button
                                buttonText="Change password..."
                                className="filter-sort-button"
                                clickHandler={() => {
                                    setPasswordCardVisibility(true);
                                }}
                            ></Button>
                            {statusMessages[0]?.successPasswordChange && (
                                <p className="success-message-password">{statusMessages[0].successPasswordChange}</p>
                            )}
                        </div>
                    )
                )}
            {activeSecurityHeader === "Roles" && passwordCardVisibility === false && (
                <div className="role-card">
                    <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
                        <option value="" disabled>
                            Choose user
                        </option>
                        {activeUsers.map((user, index) => (
                            <option key={index} value={user.email}>
                                {user.email}
                            </option>
                        ))}
                    </select>

                    <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
                        <option value="" disabled>
                            Choose role
                        </option>
                        {roles.map((role, index) => (
                            <option key={index} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    {statusMessages[0]?.roleChange && (
                        <p className="success-message-password">{statusMessages[0].roleChange}</p>
                    )}
                    <div className="save-password">
                        <Button
                            buttonText="Update role"
                            className="event-task-general-button"
                            clickHandler={submitRole(() => {
                                updateRole(selectedUser, selectedRole);
                            }, (errors) => {
                                console.log("Failed", errors);
                            })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SecurityCard;