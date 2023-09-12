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
import {validateTaskForm} from "../../helpers/validationHelper";

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
        if (!activeUsers || activeUsers.length === 0) {
            return;
        }
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
                activeUsers
            )
        }
    }, [task_id, activeUsers]);

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
                activeUsers,
                assignedTo
            )
        }
    }, [task_id]);

    useEffect(() => {
        setTask({
            id: task_id,
            nameTask,
            deadline,
            description,
            completed
        });
    }, [nameTask])

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

    // async function saveTask() {
    //     const errors = validateTaskForm({
    //         assignedTo,
    //         deadline,
    //         description,
    //         files,
    //     });
    //
    //     if (Object.keys(errors).length > 0) {
    //         setFormErrors(errors);
    //         return;
    //     }
    //
    //     const token = localStorage.getItem('token');
    //
    //     const payload = {
    //         nameTask,
    //         deadline: formatToISO(deadline),
    //         description,
    //         completed
    //     };
    //
    //     try {
    //         const response = await axios.post('http://localhost:8080/tasks/add', payload, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //
    //         console.log("Task saved successfully:", response.data);
    //         const taskId = response.data.id;
    //
    //         await axios.put(`http://localhost:8080/users/${user.email}/usercreatestask/${taskId}`, null, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             }})
    //
    //         for (const user of assignedTo) {
    //             try {
    //                 const updateUserResponse = await axios.put(`http://localhost:8080/users/${user.email}/task/${taskId}`, null, {
    //                     headers: {
    //                         'Authorization': `Bearer ${token}`,
    //                         'Content-Type': 'application/json',
    //                     }
    //                 });
    //
    //                 console.log(`Assigned task to user ${user.email}:`, updateUserResponse.data);
    //
    //             } catch (error) {
    //                 console.error(`Error assigning task to user ${user.email}:`, error);
    //             }
    //         }
    //
    //         if (files.length > 0) {
    //             const formData = new FormData();
    //             files.forEach((file) => {
    //                 formData.append('file', file);
    //             });
    //
    //             const fileResponse = await axios.post('http://localhost:8080/files/upload', formData, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'multipart/form-data',
    //                 }
    //             });
    //
    //             const fileIds = fileResponse.data.map(file => file.id);
    //
    //             await axios.put(`http://localhost:8080/tasks/assignfiles/${taskId}`, { file_ids: fileIds }, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 }
    //             });
    //         }
    //         try {
    //             const todoResponse = await axios.post(`http://localhost:8080/task/todos/${taskId}/create`, toDos, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 }
    //             });
    //             console.log(`Todo added to task ${taskId}:`, todoResponse.data);
    //         } catch (error) {
    //             console.error(`Error adding todo to task ${taskId}:`, error);
    //         }
    //     } catch (error) {
    //         console.error("Error saving task:", error);
    //     } finally {
    //         navigate("/tasks")
    //     }
    // }

    const headersWithAuth = (token) => ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    });

    const createTask = async (payload, token) => {
        return await axios.post('http://localhost:8080/tasks/add', payload, {
            headers: headersWithAuth(token)
        });
    };

    const assignTaskToUsers = async (users, taskId, token) => {
        for (const user of users) {
            try {
                await axios.put(`http://localhost:8080/users/${user.email}/task/${taskId}`, null, {
                    headers: headersWithAuth(token)
                });
                console.log(`Assigned task to user ${user.email}`);
            } catch (error) {
                console.error(`Error assigning task to user ${user.email}:`, error);
            }
        }
    };

    const uploadFiles = async (files, taskId, token) => {
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
            headers: headersWithAuth(token)
        });
    };

    const addTodos = async (toDos, taskId, token) => {
        await axios.post(`http://localhost:8080/task/todos/${taskId}/create`, toDos, {
            headers: headersWithAuth(token)
        });
        console.log(`Todo added to task ${taskId}`);
    };

// Main function
    async function saveTask() {
        const errors = validateTaskForm({ assignedTo, deadline, description, files });
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
            const response = await createTask(payload, token);
            const taskId = response.data.id;

            await assignTaskToUsers(assignedTo, taskId, token);

            if (files.length > 0) {
                await uploadFiles(files, taskId, token);
            }

            try {
                await addTodos(toDos, taskId, token);
            } catch (error) {
                console.error(`Error adding todo to task ${taskId}:`, error);
            }
        } catch (error) {
            console.error("Error saving task:", error);
        } finally {
            navigate("/tasks");
        }
    }

    async function updateTask() {
        const formErrors = validateTaskForm({
            assignedTo,
            deadline,
            description,
            files
        });

        if (Object.keys(formErrors).length > 0) {
            console.error("Form has errors:", formErrors);
            setFormErrors(formErrors);
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
            const response = await axios.put(`http://localhost:8080/tasks/update/${task_id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log("Task updated successfully:", response.data);
            const task = response.data

            const newAssignedEmails = new Set(assignedTo.map(user => user.email));
            const oldAssignedEmails = new Set(task.assignedTo.map(user => user.email));

            for (const oldEmail of oldAssignedEmails) {
                if (!newAssignedEmails.has(oldEmail)) {
                    try {
                        await axios.put(`http://localhost:8080/users/${oldEmail}/remove/task/${task_id}`, null, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        });
                        console.log(`Successfully removed user ${oldEmail} from task.`);
                    } catch (error) {
                        console.error(`Error removing user ${oldEmail} from task:`, error);
                    }
                }
            }

            for (const user of assignedTo) {
                const isUserAlreadyAssigned = task.assignedTo.some(existingUser => existingUser.email === user.email);

                if (!isUserAlreadyAssigned) {
                    try {
                        const updateUserResponse = await axios.put(`http://localhost:8080/users/${user.email}/task/${task.id}`, null, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        });

                        console.log(`Assigned task to user ${user.email}:`, updateUserResponse.data);

                    } catch (error) {
                        console.error(`Error assigning task to user ${user.email}:`, error);
                    }
                } else {
                    console.log(`User ${user.email} is already assigned to the task.`);
                }
            }

            const newFileIds = new Set(files.map(file => file.id));
            const oldFileIds = new Set(task.files.map(file => file.id));

            for (const oldFileId of oldFileIds) {
                if (!newFileIds.has(oldFileId)) {
                    try {
                        await axios.delete(`http://localhost:8080/files/delete/${oldFileId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        });
                        console.log(`File with ID ${oldFileId} deleted successfully.`);
                    } catch (error) {
                        console.error(`Error deleting file with ID ${oldFileId}:`, error);
                    }
                }
            }

            const existingFileNames = new Set(task.files.map(file => file.name));
            const uniqueNewFileNames = files.filter(file => !existingFileNames.has(file.name));

            const formData = new FormData();
            uniqueNewFileNames.forEach((file) => {
                formData.append('file', file);
            });

            if (uniqueNewFileNames.length > 0) {

                const fileResponse = await axios.post('http://localhost:8080/files/upload', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
                const fileIds = fileResponse.data.map(file => file.id);

                await axios.put(`http://localhost:8080/tasks/assignfiles/${task.id}`, {file_ids: fileIds}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }

            const existingToDoMap = new Map(task.toDos.map(todo => [todo.id, todo]));
            const newToDos = [], updatedToDos = [], todoIdsToDelete = [];

            toDos.forEach(todo => {
                if (existingToDoMap.has(todo.id)) {
                    updatedToDos.push(todo);
                    existingToDoMap.delete(todo.id);
                } else {
                    newToDos.push(todo);
                }
            });

            todoIdsToDelete.push(...existingToDoMap.keys());

            if (newToDos.length > 0) {
                try {
                    const todoResponse = await axios.post(`http://localhost:8080/task/todos/${task.id}/create`, newToDos, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    console.log(`ToDos added to task ${task.id}:`, todoResponse.data);
                } catch (error) {
                    console.error(`Error adding ToDos to task ${task.id}:`, error);
                }
            }

            if (todoIdsToDelete.length > 0) {
                try {
                    await axios.delete(`http://localhost:8080/task/todos/${task.id}/delete`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        data: todoIdsToDelete
                    });
                    console.log(`ToDos deleted from task ${task.id}.`);
                } catch (error) {
                    console.error(`Error deleting ToDo from task ${task.id}:`, error);
                }
            }

            if (updatedToDos.length > 0) {
                try {
                    await axios.put(`http://localhost:8080/task/todos/${task.id}/update`, updatedToDos, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
                    console.log(`ToDos updated in task ${task.id}.`);
                } catch (error) {
                    console.error(`Error updating ToDos in task ${task.id}:`, error);
                }
            }

        } catch (error) {
        console.error("Error saving task:", error);
    } finally {
            navigate("/tasks")
        }
    }

    const completeTaskHandler = () => {
        console.log(task)
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
                                                setFormErrors={setFormErrors}
                                            ></EditableDate>
                                            {formErrors.deadline && <p className="error">{formErrors.deadline}</p>}
                                        </div>
                                        <div className={task_id ? "completion-card" : "hidden"}>
                                            <h3 className="volunteer-option-header">{completed ? "Open task" : "Close task"}</h3>
                                            <Button
                                                buttonText={completed ? "Completed" : "Done"}
                                                className={completed ? "event-task-completion-button" : "event-task-done-button"}
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
                                        clickHandler={task_id ? updateTask : saveTask}
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
                                        className="event-task-menu-button not-allowed"
                                        buttonText="Delete"
                                        buttonClass="menu-pane-buttons"
                                        icon={Delete}
                                        iconClass="icon-space"
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText={completed ? "Mark Undone" : "Mark As Done"}
                                        buttonClass="menu-pane-buttons"
                                        icon={Check}
                                        iconClass="icon-space"
                                        clickHandler={() => {completeTaskHandler(task, setCompleted)}}
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