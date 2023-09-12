import React, {useContext, useEffect, useState} from 'react';
import "./Profile.css"
import { useForm } from 'react-hook-form';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
// Components
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import Input from "../../components/Input/Input";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import DragAndDrop from "../../components/DragAndDrop/DragAndDrop";
import SecurityCard from "../../components/SecurityCard/SecurityCard";

function Profile() {
    const { user, updateUser } = useContext(AuthContext)
    const { register: profileInfo, handleSubmit: submitProfileInfo, formState: { errors }, setValue } = useForm();
    const [isEditable, setEditable] = useState(false);
    const [triggerUpload, setTriggerUpload] = useState(false);
    const [passwordCardVisibility, setPasswordCardVisibility] = useState(false)
    const [activeSecurityHeader, setActiveSecurityHeader] = useState('Password');

    useEffect(() => {
        if (user) {
            setValue("enabled", user.enabled);
            setValue("phoneNumber", user.phoneNumber);
            setValue("fullName", user.fullName);
            setValue("age", user.age);
            setValue("pronouns", user.pronouns);
            setValue("email", user.email);
            setValue("bio", user.bio);
        }
    }, [user, setValue]);

    const disabledStyle = isEditable ? {} : { backgroundColor: "#e0e0e0" };

    const toggleAndSave = async (data) => {
        setTriggerUpload(true); // Set to trigger file upload in DragAndDrop component
        const token = localStorage.getItem('token');

        if (isEditable) {
            try {
                const response = await axios.put(
                    `http://localhost:8080/users/update/${user.email}`,
                    data,
                    {
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                updateUser(response.data);

            } catch (error) {
                console.error("Failed to update user:", error);
            }
        }

        setEditable(!isEditable);
    };

    useEffect(() => {
        if (triggerUpload) {
            setTriggerUpload(false);
        }
    }, [triggerUpload]);

    const handleFileDrop = () => {
        setEditable(true);
    };

    return (
        <>
            <div className="outer-container">
                <div className="outer-content-container">
                    <Navigation
                        profileInfo={user}
                    ></Navigation>
                    <div className="inner-content-container profile-page">
                        <Header
                            profileInfo={user}
                        ></Header>

                        <main>
                            <form className="form-outer-container">
                                <div className="form-top-options">
                                    <div className="form-top-options-left">
                                        <div className="radio-group-newsletter">
                                            <label className="main-label-newsletter">Monthly newsletter</label>
                                            <div className="radio-options-newsletter">
                                                <div className="newsletter-choice">
                                                    <label htmlFor="yes">Yes</label>
                                                    <input type="radio" id="yes" name="newsletterChoice" value="yes" className="not-allowed"/>
                                                </div>

                                                <div className="newsletter-choice">
                                                    <label htmlFor="no">No</label>
                                                    <input type="radio" id="no" name="newsletterChoice" value="no" className="not-allowed"/>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            buttonText={isEditable ? "Save" : "Edit Profile"}
                                            className={isEditable ? "event-task-done-button-editable" : "event-task-done-button"}
                                            clickHandler={isEditable ? submitProfileInfo(toggleAndSave) : toggleAndSave}
                                        ></Button>
                                    </div>
                                    <DragAndDrop
                                        onFileDrop={handleFileDrop}
                                        isSaveTriggered={triggerUpload}
                                        user={user}
                                    />
                                </div>
                                <div className="form-inner-container">
                                    <div className="profile-form-wrapper">

                                        <div className="form-inputs profile-top-margin">
                                            <div className="profile-input">
                                                <div className="profile-label">
                                                    <label htmlFor="fullName">Full Name:</label>
                                                </div>
                                                <Input
                                                    defaultValue={user.fullName}
                                                    inputType="text"
                                                    inputName="fullName"
                                                    className="input-field"
                                                    inputId="fullName"
                                                    validationRules={{
                                                        required: "This field is required",
                                                        maxLength: { value: 75, message: "Full name cannot be more than 75 characters long" }
                                                    }}
                                                    register={profileInfo}
                                                    error={errors}
                                                    disabled={!isEditable}
                                                    style={disabledStyle}
                                                />
                                            </div>
                                            <div className="profile-input">
                                                <div className="profile-label">
                                                    <label htmlFor="age">Age:</label>
                                                </div>
                                                <Input
                                                    defaultValue={user.age}
                                                    inputType="number"
                                                    inputName="age"
                                                    className="input-field"
                                                    inputId="age"
                                                    validationRules={{
                                                        required: "Please enter your age",
                                                        min: { value: 0, message: "Age must be between 0 and 120" },
                                                        max: { value: 120, message: "Age must be between 0 and 120" }
                                                    }}
                                                    register={profileInfo}
                                                    error={errors}
                                                    disabled={!isEditable}
                                                    style={disabledStyle}
                                                />
                                            </div>
                                            <div className="profile-input">
                                                <div className="profile-label">
                                                    <label htmlFor="pronouns">Pronouns:</label>
                                                </div>
                                                <Input
                                                    defaultValue={user.pronouns}
                                                    inputType="text"
                                                    inputName="pronouns"
                                                    className="input-field"
                                                    inputId="pronouns"
                                                    validationRules={{
                                                        required: "This field is required",
                                                        maxLength: { value: 10, message: "Pronouns cannot be more" +
                                                                " than 10" +
                                                                " characters"}
                                                    }}
                                                    register={profileInfo}
                                                    error={errors}
                                                    disabled={!isEditable}
                                                    style={disabledStyle}
                                                />
                                            </div>
                                            <div className="profile-input">
                                                <div className="profile-label">
                                                    <label htmlFor="email">Email:</label>
                                                </div>
                                                <Input
                                                    defaultValue={user.email}
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
                                                    register={profileInfo}
                                                    error={errors}
                                                    disabled={!isEditable}
                                                    style={disabledStyle}
                                                />
                                            </div>
                                            <div className="profile-input">
                                                <div className="profile-label">
                                                    <label htmlFor="phoneNumber">Phone:</label>
                                                </div>
                                                <Input
                                                    defaultValue={user.phoneNumber}
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
                                                    register={profileInfo}
                                                    error={errors}
                                                    disabled={!isEditable}
                                                    style={disabledStyle}
                                                />
                                            </div>
                                            <div className="profile-input">
                                                <div className="profile-label">
                                                    <label htmlFor="bio">Bio:</label>
                                                </div>
                                                <textarea
                                                    defaultValue={user.bio}
                                                    id="bio"
                                                    className="full-width-textarea"
                                                    rows="6"
                                                    cols="80"
                                                    {...profileInfo("bio", {
                                                        maxLength: { value: 5000, message: "Bio cannot be more than 5000 characters" }
                                                    })}
                                                    disabled={!isEditable}
                                                    style={disabledStyle}
                                                />
                                            </div>
                                        </div>

                                        <div className="profile-security">
                                            {user.authorities.some(auth => auth.authority === "ROLE_LION") ? (
                                                <>
                                                    <div className="security-header">
                                                        <div className="h3-headers security-h3-authority">
                                                            <h3 onClick={() => setActiveSecurityHeader('Password')}>
                                                                {activeSecurityHeader === 'Password' && '>'} Password
                                                            </h3>
                                                            <h3 onClick={() => {
                                                                setActiveSecurityHeader('Roles')
                                                                setPasswordCardVisibility(false)
                                                            }}>
                                                                {activeSecurityHeader === 'Roles' && '>'} Roles
                                                            </h3>
                                                        </div>
                                                        <hr className="password-line" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="security-header">
                                                        <div className="h3-headers">
                                                            <h3>Password</h3>
                                                        </div>
                                                        <hr />
                                                    </div>

                                                </>
                                            )}
                                            <SecurityCard
                                                passwordCardVisibility={passwordCardVisibility}
                                                setPasswordCardVisibility={setPasswordCardVisibility}
                                                activeSecurityHeader={activeSecurityHeader}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </main>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Profile;