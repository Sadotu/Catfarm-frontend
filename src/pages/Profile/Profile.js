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
    const { register: profileInfo, handleSubmit: submitProfileInfo, formState: { profileErrors }, setValue } = useForm();
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
                                    <div className="form-labels profile-margin-labels-input">
                                        <label htmlFor="fullName">Full Name:</label>
                                        <label htmlFor="age">Age:</label>
                                        <label htmlFor="pronouns">Pronouns:</label>
                                        <label htmlFor="email">Email:</label>
                                        <label htmlFor="phoneNumber">Phone:</label>
                                        <label htmlFor="bio">Bio:</label>
                                    </div>
                                    <div className="form-divider"></div>
                                    <div className="profile-form-wrapper">
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
                                                        <hr />
                                                    </div>
                                                    <SecurityCard
                                                        passwordCardVisibility={passwordCardVisibility}
                                                        setPasswordCardVisibility={setPasswordCardVisibility}
                                                        activeSecurityHeader={activeSecurityHeader}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="security-header">
                                                        <div className="h3-headers">
                                                            <h3>Password</h3>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                    <SecurityCard
                                                        passwordCardVisibility={passwordCardVisibility}
                                                        setPasswordCardVisibility={setPasswordCardVisibility}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        <div className="form-inputs profile-margin-labels-input">
                                            <Input
                                                defaultValue={user.fullName}
                                                inputType="text"
                                                inputName="fullName"
                                                className="input-field"
                                                inputId="fullName"
                                                validationRules={{ required: "This field is required" }}
                                                register={profileInfo}
                                                error={profileErrors}
                                                disabled={!isEditable}
                                                style={disabledStyle}
                                            />
                                            <Input
                                                defaultValue={user.age}
                                                inputType="number"
                                                inputName="age"
                                                className="input-field"
                                                inputId="age"
                                                validationRules={{ required: "This field is required" }}
                                                register={profileInfo}
                                                error={profileErrors}
                                                disabled={!isEditable}
                                                style={disabledStyle}
                                            />
                                            <Input
                                                defaultValue={user.pronouns}
                                                inputType="text"
                                                inputName="pronouns"
                                                className="input-field"
                                                inputId="pronouns"
                                                validationRules={{ required: "This field is required" }}
                                                register={profileInfo}
                                                error={profileErrors}
                                                disabled={!isEditable}
                                                style={disabledStyle}
                                            />
                                            <Input
                                                defaultValue={user.email}
                                                inputType="text"
                                                inputName="email"
                                                className="input-field"
                                                inputId="email"
                                                validationRules={{ required: "This field is required" }}
                                                register={profileInfo}
                                                error={profileErrors}
                                                disabled={!isEditable}
                                                style={disabledStyle}
                                            />
                                            <Input
                                                defaultValue={user.phoneNumber}
                                                inputType="text"
                                                inputName="phoneNumber"
                                                className="input-field"
                                                inputId="phoneNumber"
                                                validationRules={{ required: "This field is required" }}
                                                register={profileInfo}
                                                error={profileErrors}
                                                disabled={!isEditable}
                                                style={disabledStyle}
                                            />
                                            <textarea
                                                defaultValue={user.bio}
                                                id="bio"
                                                className="full-width-textarea"
                                                rows="6"
                                                cols="80"
                                                {...profileInfo("bio")}
                                                disabled={!isEditable}
                                                style={disabledStyle}
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