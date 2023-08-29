import React, {useEffect, useState} from 'react';
import './NewTask.css'
// Components
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import EditableDate from "../../components/EditableDate/EditableDate";
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
import { editableTitle, editableDescription } from  "../../helpers/editableHelper";
import { fetchEnabledUsers } from "../../helpers/fetchHelper";
import { manageVolunteers } from "../../helpers/selectionHelper";
import { uploadDateHelper } from "../../helpers/uploadDateHelper"
import { iconHelper } from "../../helpers/iconHelper"

function NewTask() {
    const [activeUsers, setActiveUsers] = useState([]);
    const [showUnselected, setShowUnselected] = useState(false);
    const [unselectedVolunteers, setUnselectedVolunteers] = useState([]);
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [volunteerCardVisible, setVolunteerCardVisible] = useState(false);
    const [attachmentCardVisible, setAttachmentCardVisible] = useState(false);
    const [attachments, setAttachments] = useState([]);

    console.log(attachmentCardVisible);

    const currentUserData = activeUsers.find(user => user.email);

    window.onload = function() {
        editableTitle();
        editableDescription();
    }

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
        } = manageVolunteers(selectedVolunteers, unselectedVolunteers, activeUsers, currentUserData, action, volunteer);
        setSelectedVolunteers(updatedSelectedVolunteers);
        setUnselectedVolunteers(updatedUnselectedVolunteers)

        if (action === 'VOLUNTEER_HANDLER') {
            setVolunteerCardVisible(prevVisibility => !prevVisibility);
        }

        if (action === 'SHOW_UNSELECTED') {
            setShowUnselected(prevShow => !prevShow);
        }
    }

    const handleAttachments = () => {
        setAttachmentCardVisible(prevShow => !prevShow)
    }

    const addAttachment = (event) => {
        const files = Array.from(event.target.files);
        setAttachments([...attachments, ...files]);
    };

    const deleteAttachment = (index) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };

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
                                        <h3 onClick={() => {editableTitle()}} id="editable-text" className="task-title">Click here to edit the task title...</h3>
                                    </div>

                                    <div className="extra-task-options">
                                        <div className={`volunteer-card ${volunteerCardVisible ? '' : 'hidden'}`}>
                                            <h3 className="volunteer-card-header">Volunteers</h3>
                                            <div className="task-profile-flex">
                                                {selectedVolunteers.map((v) => (
                                                    <div key={v.email} onClick={showUnselected ? () => handleVolunteerManagement("MOVE_TO_UNSELECTED", v) : null} className="tooltip">
                                                        {v.profilePicture && v.profilePicture.docFile ? (
                                                            <img className="profile-volunteer" src={`data:image/jpeg;base64,${v.profilePicture.docFile}`} alt={v.fullName} />
                                                        ) : (
                                                            <img src={User} className="profile-volunteer profile-icon" alt={v.fullName}></img>
                                                        )}
                                                        <span className="tooltiptext">{v.fullName}</span>
                                                    </div>
                                                ))}
                                                <Button
                                                    className={`event-task-menu-button-circle ${showUnselected ? 'event-task-menu-button-circle-is-active' : ''}`}
                                                    clickHandler={() => handleVolunteerManagement("SHOW_UNSELECTED")}
                                                ></Button>
                                                {showUnselected && unselectedVolunteers.map((v) => (
                                                    <div key={v.email} onClick={() => handleVolunteerManagement("MOVE_TO_SELECTED", v)} className="tooltip">
                                                        {v.profilePicture && v.profilePicture.docFile ? (
                                                            <img className="profile-volunteer" src={`data:image/jpeg;base64,${v.profilePicture.docFile}`} alt={v.fullName} />
                                                        ) : (
                                                            <img src={User} className="profile-volunteer profile-icon" alt={v.fullName}></img>
                                                        )}
                                                        <span className="tooltiptext">{v.fullName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="notification-card">
                                            <h3 className="volunteer-card-header">Notifications</h3>
                                            <Button
                                                buttonText="Watch"
                                                className="event-task-general-button-icon not-allowed"
                                                icon={Eye}
                                                iconClass="watch-icon"
                                            ></Button>
                                        </div>
                                        <div className="deadline-card">
                                            <h3 className="volunteer-card-header">Due date</h3>
                                            <EditableDate/>
                                        </div>
                                        <div className="completion-card">
                                            <h3 className="volunteer-card-header">Close task</h3>
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
                                            <h5 onClick={() => {editableDescription()}} id="editable-text-description">Double click here to edit the description...</h5>
                                        </div>
                                    </div>

                                    <div className={`attachment-card ${attachmentCardVisible ? '' : 'hidden'}`}>
                                        <div className="attachment-header">
                                            <img className="attachment-icon" alt="" />
                                            <h3>Attachments</h3>
                                        </div>
                                        <div className="attachment-content">
                                            {attachments.map((attachment, index) => (
                                                <div key={index} className="attachment-principal">
                                                    <div className="file-icon">
                                                        {iconHelper(attachment.name)}
                                                    </div>
                                                    <div className="attachment-meta">
                                                        <span>{attachment.name}</span>
                                                        <span>{attachment.size / 1000}KB</span>
                                                    </div>
                                                    <Button
                                                        buttonText="Delete"
                                                        className="filter-sort-button file-delete-button"
                                                        clickHandler={() => deleteAttachment(index)}
                                                    >
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <input
                                            type="file"
                                            multiple
                                            style={{ display: 'none' }}
                                            id="hiddenFileInput"
                                            onChange={addAttachment}
                                        />

                                        <Button
                                            buttonText="Add Attachments"
                                            className="event-task-general-button attachment-button"
                                            clickHandler={() => document.getElementById('hiddenFileInput').click()}
                                        >
                                        </Button>
                                    </div>
                                </div>
                                <div className="task-save-bar">
                                    <hr className="task-save-line" />
                                    <Button
                                        className="event-task-done-button"
                                        buttonText="Save"
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
                                        clickHandler={() => handleAttachments()}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Checklist"
                                        buttonClass="menu-pane-buttons"
                                        icon={Checklist}
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

export default NewTask;