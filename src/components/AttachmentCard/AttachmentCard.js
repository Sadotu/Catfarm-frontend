import React from 'react';
import "./AttachmentCard.css"
// Helpers
import {iconHelper} from "../../helpers/iconHelper";
// Components
import Button from "../Button/Button";

function AttachmentCard({ attachments, setAttachments, attachmentCardVisible, error, setError }) {

    const addAttachment = (event) => {
        setAttachments([...attachments, ...event.target.files]);
    };

    const deleteAttachment = (index) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
        const newErrors = {...error};
        newErrors.files = "";
        setError(newErrors);
    };

    return (
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
                {error.files && <p className="error">{error.files}</p>}
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
    );
}

export default AttachmentCard;