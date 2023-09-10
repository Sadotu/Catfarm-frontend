import React, {useContext, useEffect, useState} from 'react';
import "./SecurityCard.css"
import {useForm} from "react-hook-form";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
// Components
import Input from "../Input/Input";
import Button from "../Button/Button";
// Helpers
import {fetchEnabledUsers} from "../../helpers/fetchHelper";
import {validatePassword} from "../../helpers/validationHelper";

function SecurityCard({ passwordCardVisibility, setPasswordCardVisibility, activeSecurityHeader }) {
    const {user} = useContext(AuthContext);
    const [statusMessages, setStatusMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const roles = ['ROLE_KITTEN', 'ROLE_CAT', 'ROLE_LION'];
    const {register: password, handleSubmit: submitPassword, formState: {passwordErrors}} = useForm();
    const {handleSubmit: submitRole} = useForm();

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

    async function updatePassword(data) {
        const messages = validatePassword(data.password, data.repeatPassword)

        if (Object.keys(messages).length > 0) {
            setStatusMessages(messages);
            return;
        }

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
            setStatusMessages()

        } catch (error) {
            console.error("Failed to update user:", error);
        }
    }

    const updateRole = async (selectedUserEmail, selectedRole) => {
        const token = localStorage.getItem('token');

        const selectedUser = activeUsers.find(user => user.email === selectedUserEmail);

        if (selectedUser.authorities.some(auth => auth.authority === selectedRole)) {
            console.log("Role is already assigned to the user.");
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
                            <label htmlFor="password">Password: </label>
                            <Input
                                inputType="password"
                                inputName="password"
                                inputId="password"
                                className={`input-field ${Object.values(statusMessages).some(Boolean) ? 'password-error' : ''}`}
                                validationRules={{required: "This field is required"}}
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
                                    className={`input-field ${Object.values(statusMessages).some(Boolean) ? 'password-error' : ''}`}
                                    inputId="repeatPassword"
                                    validationRules={{required: "This field is required"}}
                                    register={password}
                                    error={passwordErrors}
                                />
                                {statusMessages.repeatPassword && <p className="error">{statusMessages.repeatPassword}</p>}
                            </div>
                        </div>
                        <div className="requirements-and-button">
                            <div className="password-requirements">
                                <p style={{ color: statusMessages.length ? 'red' : 'black' }}>
                                    Password must be at least 8 characters long
                                </p>
                                <p style={{ color: statusMessages.uppercase ? 'red' : 'black' }}>
                                    Password must contain at least one uppercase letter
                                </p>
                                <p style={{ color: statusMessages.lowercase ? 'red' : 'black' }}>
                                    Password must contain at least one lowercase letter
                                </p>
                                <p style={{ color: statusMessages.number ? 'red' : 'black' }}>
                                    Password must contain at least one number
                                </p>
                                <p style={{ color: statusMessages.specialChar ? 'red' : 'black' }}>
                                    Password must contain at least one special character
                                </p>
                                <p style={{ color: statusMessages.specialChar ? 'red' : 'black' }}>
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
                        <Button
                            buttonText="Change password..."
                            className="filter-sort-button"
                            clickHandler={() => {
                                setPasswordCardVisibility(true);
                            }}
                        ></Button>
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