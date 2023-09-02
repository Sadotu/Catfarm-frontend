import React, {useContext, useEffect, useState} from 'react';
import './Task.css'
import {AuthContext} from "../../context/AuthContext";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
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
import { saveTaskHelper} from "../../helpers/saveTaskHelper";
import {formatDate} from "../../helpers/ISOFormatDate";

function Task() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { task_id } = useParams();
    const [activeUsers, setActiveUsers] = useState([]);
    const currentUserData = user;
    // visibility states
    const [showUnselected, setShowUnselected] = useState(false);
    const [unselectedVolunteers, setUnselectedVolunteers] = useState([]);
    const [attachmentCardVisible, setAttachmentCardVisible] = useState(false);
    const [checklistVisibility, setChecklistVisibility] = useState(false)
    // payload states
    const [nameTask, setNameTask] = useState(null);
    const [deadline, setDeadline] = useState('dd/mm/jj');
    const [description, setDescription] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [assignedTo, setAssignedTo] = useState([]);
    const [files, setFiles] = useState([]);
    const [toDos, setToDos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        handleVolunteerManagement("VOLUNTEER_HANDLER")
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (task_id) {
            axios.get(`http://localhost:8080/tasks/${task_id}`, { headers })
                .then((response) => {
                    const data = response.data;

                    if(data.files.length > 0) { setAttachmentCardVisible(true) }
                    if (data.toDos.length > 0) { setChecklistVisibility(true) }

                    setNameTask(data.nameTask);
                    const formattedDeadline = formatDate(data.deadline);
                    setDeadline(formattedDeadline);
                    setDescription(data.description);
                    setCompleted(data.completed);
                    const unselected = activeUsers.filter(user => !assignedTo.includes(user));
                    setUnselectedVolunteers(unselected);
                    setAssignedTo(data.assignedTo);
                    setFiles(data.files);
                    setToDos(data.toDos);
                })
                .catch((error) => {
                    console.log("Error fetching task:", error);
                });
        }
        else {
            setNameTask(null);
            setDeadline('dd/mm/jj');
            setDescription(null);
            setCompleted(false);
            setAssignedTo([]);
            setFiles([]);
            setToDos([]);
        }
    }, [task_id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await fetchEnabledUsers();
                setActiveUsers(users);
                handleVolunteerManagement("VOLUNTEER_HANDLER")
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

        if (action === 'SHOW_UNSELECTED') {
            setShowUnselected(prevShow => !prevShow);
        }
    }

    async function saveTask() {
        await saveTaskHelper({
            nameTask,
            deadline,
            description,
            completed,
            assignedTo,
            files,
            user,
            task_id
        });

        navigate('/tasks');
        window.location.reload();
    }

    return (
        <>
            <div className="outer-container">
                <div className="outer-content-container">
                    <Navigation/>
                    <div className="inner-content-container">
                        <Header
                            pageTitle={task_id ? `Task: ${task_id}` : "New Task"}
                            backButton={true}
                        ></Header>

                        <main className="main-container-task">
                            <div className="task-content">
                                <div id="editable">
                                    <div id="task-header">
                                        <img className="icon"  alt=""/>
                                        <h3 onClick={() => {editableTitle(setNameTask)}} id="editable-text" className="task-title">{nameTask ? nameTask : "Click here to edit the task title..."}</h3>
                                    </div>

                                    <div className="extra-task-options">
                                        <VolunteerOption
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
                                            <h5 onClick={() => {editableDescription(setDescription)}} id="editable-text-description">{description ? description : "Click here to edit the description..."}</h5>
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
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Volunteers"
                                        buttonClass="menu-pane-buttons"
                                        icon={User}
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