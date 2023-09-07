import React, {useContext, useEffect, useState} from 'react';
import './Task.css'
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {useNavigate, useParams} from "react-router-dom";
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
import {fetchTask, fetchEnabledUsers} from "../../helpers/fetchHelper";
import { manageVolunteers } from "../../helpers/selectionHelper";
import { completeTask } from "../../helpers/postHelper";
import {formatToISO} from "../../helpers/ISOFormatDate";
import {validateForm} from "../../helpers/validateForm";

function Task() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { task_id } = useParams();
    const [activeUsers, setActiveUsers] = useState([]);
    const [task, setTask] = useState(null);
    const currentUserData = user;
    const [formErrors, setFormErrors] = useState({});
    // visibility states
    const [showUnselected, setShowUnselected] = useState(false);
    const [unselectedVolunteers, setUnselectedVolunteers] = useState([]);
    const [attachmentCardVisible, setAttachmentCardVisible] = useState(false);
    const [checklistVisibility, setChecklistVisibility] = useState(false)
    // payload states
    const [nameTask, setNameTask] = useState(null);
    const [deadline, setDeadline] = useState('dd/mm/yy');
    const [description, setDescription] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [assignedTo, setAssignedTo] = useState([]);
    const [files, setFiles] = useState([]);
    const [toDos, setToDos] = useState([]);

    useEffect(() => {
        if (task_id === undefined) {
            handleVolunteerManagement("VOLUNTEER_HANDLER")
        } else {
            fetchTask(
                task_id,
                setAttachmentCardVisible,
                setChecklistVisibility,
                setNameTask,
                setDeadline,
                setDescription,
                setCompleted,
                setUnselectedVolunteers,
                setAssignedTo,
                setFiles,
                setToDos,
                setTask,
                activeUsers,
                assignedTo
            )
        }
    }, [task_id]);

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

        if (action === 'SHOW_UNSELECTED') {
            setShowUnselected(prevShow => !prevShow);
        }
    }

    async function saveTask() {
        const errors = validateForm({
            assignedTo,
            deadline,
            description,
            files,
            toDos
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const token = localStorage.getItem('token');

        const payload = {
            nameTask,
            deadline: formatToISO(deadline),
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
            files.forEach((file) => {
                formData.append('file', file);
            });

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
            console.log(toDos)
            for (const todo of toDos) {
                try {
                    const todoResponse = await axios.post(`http://localhost:8080/task/todos/${taskId}/create`, todo, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    console.log(`Todo added to task ${taskId}:`, todoResponse.data);
                } catch (error) {
                    console.error(`Error adding todo to task ${taskId}:`, error);
                }
            }
        } catch (error) {
            console.error("Error saving task:", error);
        } finally {
            navigate("/tasks")
        }
    }

    // async function updateTask() {
    //     const token = localStorage.getItem('token');
    //
    //     const payload = {
    //         nameTask,
    //         deadline: formatToISO(deadline),
    //         description,
    //         completed
    //     };
    //
    //     console.log(payload)
    //
    //     try {
    //         const response = await axios.put(`http://localhost:8080/tasks/update/${task_id}`, payload, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //
    //         console.log("Task updated successfully:", response.data);
    //         const task = response.data
    //
    //         for (const user of assignedTo) {
    //             const isUserAlreadyAssigned = task.assignedTo.some(existingUser => existingUser.email === user.email);
    //
    //             if (!isUserAlreadyAssigned) {
    //                 try {
    //                     const updateUserResponse = await axios.put(`http://localhost:8080/users/${user.email}/task/${task_id}`, null, {
    //                         headers: {
    //                             'Authorization': `Bearer ${token}`,
    //                             'Content-Type': 'application/json',
    //                         }
    //                     });
    //
    //                     console.log(`Assigned task to user ${user.email}:`, updateUserResponse.data);
    //
    //                 } catch (error) {
    //                     console.error(`Error assigning task to user ${user.email}:`, error);
    //                 }
    //             } else {
    //                 console.log(`User ${user.email} is already assigned to the task.`);
    //             }
    //         }
    //
    //         const formData = new FormData();
    //         files.forEach((file) => {
    //             formData.append('file', file);
    //         });
    //
    //         console.log(files)
    //         console.log(formData)
    //
    //         const fileResponse = await axios.post('http://localhost:8080/files/upload', formData, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data',
    //             }
    //         });
    //
    //         const fileIds = fileResponse.data.map(file => file.id);
    //
    //         await axios.put(`http://localhost:8080/tasks/assignfiles/${task_id}`, { file_ids: fileIds }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error saving task:", error);
    //     } finally {
    //         navigate("/tasks")
    //     }
    // }

    const completeTaskHandler = () => {
        completeTask(task, setCompleted);
    };

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
                                        <div className="volunteer-option-card">
                                            <VolunteerOption
                                                selectedVolunteers={assignedTo}
                                                showUnselected={showUnselected}
                                                unselectedVolunteers={unselectedVolunteers}
                                                handleVolunteerManagement={handleVolunteerManagement}
                                            ></VolunteerOption>
                                            {formErrors.assignedTo && <p className="error">{formErrors.assignedTo}</p>}
                                        </div>

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
                                            {formErrors.deadline && <p className="error">{formErrors.deadline}</p>}
                                        </div>
                                        <div className={task_id ? "completion-card" : "hidden"}>
                                            <h3 className="volunteer-option-header">Close task</h3>
                                            <Button
                                                buttonText="Done"
                                                className="event-task-done-button"
                                                clickHandler={() => {completeTaskHandler(task, setCompleted)}}
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
                                            {formErrors.description && <p className="error">{formErrors.description}</p>}
                                        </div>
                                    </div>

                                    <AttachmentCard
                                        attachments={files}
                                        setAttachments={setFiles}
                                        attachmentCardVisible={attachmentCardVisible}
                                        error={formErrors ? formErrors : ""}
                                        setError={setFormErrors}
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
                                        buttonText={task_id ? "Update" : "Save"}
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