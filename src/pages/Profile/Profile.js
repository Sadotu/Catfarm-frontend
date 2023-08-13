import React, {useEffect, useState} from 'react';
import "./Profile.css"
import axios from "axios";
import { useForm } from 'react-hook-form';
// Components
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import Input from "../../components/Input/Input";
import Footer from "../../components/Footer/Footer";

function Profile() {
    const currentUser = "emily.davis@example.com"
    const { register, formState: { errors } } = useForm();
    const [activeUsers, setActiveUsers] = useState([])
    const [profileInfo, setProfileInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlckB1c2VyLmNvbSIsImlhdCI6MTY5MTU3ODQxMywiZXhwIjoxNjkyNDQyNDEzfQ.LibrEeHM6aq5dYkrzhleRxUo_xN8SgVkHLrmWKPUHdA';
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get('http://localhost:8080/users/enabled', { headers });
                const users = response.data;
                setActiveUsers(users);

                // Find the currentUser in users
                const foundUser = users.find(user => user.email === currentUser);
                if (foundUser) {
                    setProfileInfo(foundUser);
                }

            } catch (error) {
                console.log('Error retrieving task data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="outer-container">
                <div className="outer-content-container">
                    <Navigation
                        profileInfo={profileInfo}
                    ></Navigation>
                    <div className="inner-content-container profile-page">
                        <Header
                            profileInfo={profileInfo}
                        ></Header>

                        <main>
                            <form className="form-outer-container">
                                <div className="form-top-options">
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
                                    <div className="profile-picture-drag-and-drop">
                                        <p>Drop your profile picture here or click in <b>this</b> area</p>
                                    </div>
                                </div>
                                <div className="form-inner-container">
                                    <div className="form-labels">
                                        <label htmlFor="fullName">Full Name:</label>
                                        <label htmlFor="dob">Date of Birth:</label>
                                        <label htmlFor="pronouns">Pronouns:</label>
                                        <label htmlFor="email">Email:</label>
                                        <label htmlFor="phone">Phone:</label>
                                        <label htmlFor="bio">Bio:</label>
                                    </div>
                                    <div className="form-divider"></div>
                                    <div className="form-inputs">
                                        <Input
                                            inputType="text"
                                            inputName="fullName"
                                            className="input-field"
                                            inputId="fullName"
                                            validationRules={{ required: "This field is required" }}
                                            register={register}
                                            error={errors}
                                        />
                                        <Input
                                            inputType="text"
                                            inputName="dob"
                                            className="input-field"
                                            inputId="dob"
                                            validationRules={{ required: "This field is required" }}
                                            register={register}
                                            error={errors}
                                        />
                                        <Input
                                            inputType="text"
                                            inputName="pronouns"
                                            className="input-field"
                                            inputId="pronouns"
                                            validationRules={{ required: "This field is required" }}
                                            register={register}
                                            error={errors}
                                        />
                                        <Input
                                            inputType="text"
                                            inputName="email"
                                            className="input-field"
                                            inputId="email"
                                            validationRules={{ required: "This field is required" }}
                                            register={register}
                                            error={errors}
                                        />
                                        <Input
                                            inputType="text"
                                            inputName="phone"
                                            className="input-field"
                                            inputId="phone"
                                            validationRules={{ required: "This field is required" }}
                                            register={register}
                                            error={errors}
                                        />
                                        <textarea id="bio" className="full-width-textarea" rows="6" cols="80" {...register("bio")} />
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