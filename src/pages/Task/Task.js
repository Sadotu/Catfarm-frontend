import React, {useContext, useEffect, useState} from 'react';
import './Task.css'
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
// Components
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import EditableDate from "../../components/EditableDate/EditableDate";
import ChecklistCard from "../../components/ChecklistCard/ChecklistCard";
import AttachmentCard from "../../components/AttachmentCard/AttachmentCard";
import VolunteerOption from "../../components/VolunteerOption/VolunteerOption";
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
import {editableDescription, editableTitle} from "../../helpers/editableHelper";
import { fetchEnabledUsers } from "../../helpers/fetchHelper";
import { manageVolunteers } from "../../helpers/selectionHelper";

function Task() {
    const { user } = useContext(AuthContext)
    const [activeUsers, setActiveUsers] = useState([]);
    const [showUnselected, setShowUnselected] = useState(false);
    const [unselectedVolunteers, setUnselectedVolunteers] = useState([]);
    const [volunteerCardVisible, setVolunteerCardVisible] = useState(false);
    const [attachmentCardVisible, setAttachmentCardVisible] = useState(false);
    const [checklistVisibility, setChecklistVisibility] = useState(false)
    // payload states
    const [nameTask, setNameTask] = useState(null);
    const [deadline, setDeadline] = useState('dd/mm/jj');
    const [description, setDescription] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [assignedTo, setAssignedTo] = useState([]);
    const [files, setFiles] = useState([]);
    const [toDos, setToDos] = useState([])

    const currentUserData = user;

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

    function handleVolunteerManagement(action, volunteer = null) {
        const {
            updatedSelectedVolunteers,
            updatedUnselectedVolunteers
        } = manageVolunteers(assignedTo, unselectedVolunteers, activeUsers, currentUserData, action, volunteer);
        setAssignedTo(updatedSelectedVolunteers);
        setUnselectedVolunteers(updatedUnselectedVolunteers)

        if (action === 'VOLUNTEER_HANDLER') {
            setVolunteerCardVisible(prevVisibility => !prevVisibility);
        }

        if (action === 'SHOW_UNSELECTED') {
            setShowUnselected(prevShow => !prevShow);
        }
    }

    async function saveTask() {
        const token = localStorage.getItem('token');

        const date = new Date(Date.parse(deadline));

        date.setHours(16);
        date.setMinutes(0);
        date.setSeconds(0);

        const isoString = date.toISOString();
        const requiredFormatDeadline = isoString.slice(0, 19);

        const payload = {
            nameTask,
            requiredFormatDeadline,
            description,
            completed
        };

        try {
            const response = await axios.post('http://localhost:8080/tasks/add', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log("Task saved successfully:", response.data);
            const taskId = response.data.id;

            await axios.put(`http://localhost:8080/users/${user.email}/usercreatestask/${taskId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }})

            for (const user of assignedTo) {
                try {
                    const updateUserResponse = await axios.put(`http://localhost:8080/users/${user.email}/task/${taskId}`, null, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    console.log(`Assigned task to user ${user.email}:`, updateUserResponse.data);

                } catch (error) {
                    console.error(`Error assigning task to user ${user.email}:`, error);
                }
            }

            const formData = new FormData();
            // const file = files[0]
            // console.log(file)
            // formData.append('file', file);
            files.forEach((file) => {
                // console.log(file)
                formData.append('file', file);
            });

            // console.log(formData)

            const fileResponse = await axios.post('http://localhost:8080/files/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            const fileIds = fileResponse.data.map(file => file.id);

            await axios.put(`http://localhost:8080/tasks/assignfiles/${taskId}`, { file_ids: fileIds }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error("Error saving task:", error);
        }
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
                                    <div id="task-header">
                                        <img className="icon"  alt=""/>
                                        <h3 onClick={() => {editableTitle(setNameTask)}} id="editable-text" className="task-title">Click here to edit the task title...</h3>
                                    </div>

                                    <div className="extra-task-options">
                                        <VolunteerOption
                                            volunteerCardVisible={volunteerCardVisible}
                                            selectedVolunteers={assignedTo}
                                            showUnselected={showUnselected}
                                            unselectedVolunteers={unselectedVolunteers}
                                            handleVolunteerManagement={handleVolunteerManagement}
                                        ></VolunteerOption>

                                        <div className="notification-card">
                                            <h3 className="volunteer-option-header">Notifications</h3>
                                            <Button
                                                buttonText="Watch"
                                                className="event-task-general-button-icon not-allowed"
                                                icon={Eye}
                                                iconClass="watch-icon"
                                            ></Button>
                                        </div>
                                        <div className="deadline-card">
                                            <h3 className="volunteer-option-header">Due date</h3>
                                            <EditableDate
                                                deadline={deadline}
                                                setDeadline={setDeadline}
                                            ></EditableDate>
                                        </div>
                                        <div className="completion-card">
                                            <h3 className="volunteer-option-header">Close task</h3>
                                            <Button
                                                buttonText="Done"
                                                className="event-task-done-button"
                                            ></Button>
                                        </div>
                                    </div>

                                    <div className="description-card">
                                        <div className="description-header">
                                            <img className="description-icon" alt="" />
                                            <h3>Description</h3>
                                        </div>
                                        <div id="editable-description" className="description-content">
                                            <h5 onClick={() => {editableDescription(setDescription)}} id="editable-text-description">Click here to edit the description...</h5>
                                        </div>
                                    </div>

                                    <AttachmentCard
                                        attachments={files}
                                        setAttachments={setFiles}
                                        attachmentCardVisible={attachmentCardVisible}
                                    ></AttachmentCard>

                                    <ChecklistCard
                                        toDos={toDos}
                                        setToDos={setToDos}
                                        checklistVisibility={checklistVisibility}
                                    ></ChecklistCard>

                                </div>
                                <div className="task-save-bar">
                                    <hr className="task-save-line" />
                                    <Button
                                        className="event-task-done-button"
                                        buttonText="Save"
                                        clickHandler={saveTask}
                                    ></Button>
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
                                        clickHandler={() => handleVolunteerManagement("VOLUNTEER_HANDLER")}
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
                                        className="event-task-menu-button"
                                        buttonText="Attachments"
                                        buttonClass="menu-pane-buttons"
                                        icon={Attachment}
                                        iconClass="icon-space"
                                        clickHandler={() => setAttachmentCardVisible(prevShow => !prevShow)}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Checklist"
                                        buttonClass="menu-pane-buttons"
                                        icon={Checklist}
                                        iconClass="icon-space"
                                        clickHandler={() => setChecklistVisibility(prevShow => !prevShow)}
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
                                        className="event-task-menu-button not-allowed"
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

export default Task;