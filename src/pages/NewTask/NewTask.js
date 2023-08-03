import React, {useEffect, useState} from 'react';
import './NewTask.css'
// Components
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
// Icons
import User from "../../assets/icons/user.svg"
import Label from "../../assets/icons/tag-simple.svg"
import Checklist from "../../assets/icons/check-square.svg"
import Attachment from "../../assets/icons/paperclip.svg"
import Comment from "../../assets/icons/chat-centered-text.svg"
import Bookmark from "../../assets/icons/bookmark.svg"
import Duplicate from "../../assets/icons/copy.svg"
import Share from "../../assets/icons/share-network.svg"
import Delete from "../../assets/icons/file-x.svg"
import Check from "../../assets/icons/check-fat.svg"
import Archive from "../../assets/icons/archive-box.svg"
import Eye from "../../assets/icons/eye.svg"
// Helpers
import "../../helpers/editableHelper"
// Libraries
import axios from "axios";

function NewTask() {
    const currentUser = 'emily.davis@example.com';
    const [showUnselected, setShowUnselected] = useState(false);
    const [unselectedVolunteers, setUnselectedVolunteers] = useState([]);
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [volunteerCardVisible, setVolunteerCardVisible] = useState(false);
    const [activeUsers, setActiveUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbWlseS5kYXZpc0BleGFtcGxlLmNvbSIsImlhdCI6MTY5MDMwMTgwMiwiZXhwIjoxNjkxMTY1ODAyfQ.tN7_JDE14DY2rQ5IQlMXo2drBEVji6ydQnXaTxHOxqY';
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get('http://localhost:8080/users/enabled', { headers });
                const users = response.data;
                setActiveUsers(users);

            } catch (error) {
                console.log('Error retrieving task data:', error);
            }
        };
        fetchData();
    }, []);

    const currentUserData = activeUsers.find(user => user.email === currentUser);

    function volunteerHandler() {
        // If selectedVolunteers is empty, add currentUserData
        setSelectedVolunteers(prevSelected => {
            if (prevSelected.length === 0 && !unselectedVolunteers.includes(currentUserData)) {
                return [currentUserData];
            }
            return prevSelected;
        });

        setVolunteerCardVisible(prevVisibility => !prevVisibility);
    }


    function showUnselectedVolunteers() {
        setUnselectedVolunteers(prevUnselected => {
            let newUnselected = [...prevUnselected];

            activeUsers.forEach(user => {
                // If the user is the currentUser and selectedVolunteers is empty, do not add them to unselected
                if (user.email === currentUser && selectedVolunteers.length === 0) {
                    return;
                }

                const isAlreadySelected = selectedVolunteers.some(selected => selected.email === user.email);
                const isAlreadyUnselected = newUnselected.some(unselected => unselected.email === user.email);

                if (!isAlreadySelected && !isAlreadyUnselected) {
                    newUnselected.push(user);
                }
            });

            return newUnselected;
        });

        setShowUnselected(prevShow => !prevShow);
    }

    function moveToSelected(v) {
        return () => {
            setSelectedVolunteers(prevSelected => [...prevSelected, v]);
            setUnselectedVolunteers(prevUnselected => prevUnselected.filter(user => user.email !== v.email));
        };
    }

    function moveToUnselected(v) {
        return () => {
            setUnselectedVolunteers(prevUnselected => [...prevUnselected, v]);
            setSelectedVolunteers(prevSelected => prevSelected.filter(user => user.email !== v.email));
        };
    }

    return (
        <>
            <div className="outer-container">
                <div className="outer-content-container">
                    <Navigation/>
                    <div className="inner-content-container">
                        <Header
                            pageTitle="New Task"
                            backButton={true}
                        ></Header>

                        <main className="main-container-task">
                            <div className="task-content">
                                    <div id="editable">
                                        <h3 id="editable-text" className="icon">Task title</h3>

                                        <div className="extra-task-options">
                                            <div className={`volunteer-card ${volunteerCardVisible ? '' : 'hidden'}`}>
                                                <h3 className="volunteer-card-header">Volunteers</h3>
                                                <div className="task-profile-flex">
                                                    {selectedVolunteers.map((v) => (
                                                        <div key={v.email} onClick={showUnselected ? moveToUnselected(v) : null}>
                                                            {v.profilePicture && v.profilePicture.docFile ? (
                                                                <img className="profile-volunteer" src={`data:image/jpeg;base64,${v.profilePicture.docFile}`} alt={v.name} />
                                                            ) : (
                                                                <img src={User}></img>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <Button
                                                        className={`event-task-menu-button-circle ${showUnselected ? 'event-task-menu-button-circle-is-active' : ''}`}
                                                        clickHandler={showUnselectedVolunteers}
                                                    ></Button>
                                                    {showUnselected && unselectedVolunteers.map((v) => (
                                                        <div key={v.email} onClick={moveToSelected(v)}>
                                                            {v.profilePicture && v.profilePicture.docFile ? (
                                                                <img className="profile-volunteer" src={`data:image/jpeg;base64,${v.profilePicture.docFile}`} alt={v.name} />
                                                            ) : (
                                                                <img src={User}></img>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={`${volunteerCardVisible ? 'notification-card' : ''}`}>
                                                <h3 className="volunteer-card-header">Notifications</h3>
                                                <Button
                                                    buttonText="Watch"
                                                    className="event-task-general-button-icon not-allowed"
                                                    icon={Eye}
                                                    iconClass="watch-icon"
                                                ></Button>
                                            </div>
                                            <div className="deadline-card">

                                            </div>
                                        </div>
                                    </div>
                            </div>

                            <div className="task-menu">
                                <div className="top-task-menu">
                                    <p className="task-menu-header">Add to task</p>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Volunteers"
                                        buttonClass="menu-pane-buttons"
                                        icon={User}
                                        clickHandler={volunteerHandler}

                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Labels"
                                        buttonClass="menu-pane-buttons"
                                        icon={Label}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Checklist"
                                        buttonClass="menu-pane-buttons"
                                        icon={Checklist}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Attachments"
                                        buttonClass="menu-pane-buttons"
                                        icon={Attachment}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Comments"
                                        buttonClass="menu-pane-buttons"
                                        icon={Comment}
                                        iconClass="icon-space"
                                    ></Button>
                                </div>
                                <div className="bottom-task-menu">
                                    <p className="task-menu-header">Actions</p>
                                    <Button
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Bookmark"
                                        buttonClass="menu-pane-buttons"
                                        icon={Bookmark}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Duplicate"
                                        buttonClass="menu-pane-buttons"
                                        icon={Duplicate}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Share"
                                        buttonClass="menu-pane-buttons"
                                        icon={Share}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Delete"
                                        buttonClass="menu-pane-buttons"
                                        icon={Delete}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Mark As Done"
                                        buttonClass="menu-pane-buttons"
                                        icon={Check}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Archive"
                                        buttonClass="menu-pane-buttons"
                                        icon={Archive}
                                        iconClass="icon-space"
                                    ></Button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default NewTask;