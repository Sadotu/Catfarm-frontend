import React from 'react';
import "./AttachmentCard.css"
import {DownloadSimple} from "@phosphor-icons/react";
// Helpers
import {iconHelper} from "../../helpers/iconHelper";
// Components
import Button from "../Button/Button";
import {uploadDateHelper} from "../../helpers/uploadDateHelper";


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

    function downloadFile(attachment) {
        const base64String = attachment.docFile.split(',')[1] || attachment.docFile;
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = attachment.name;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    return (
        <div className={`attachment-card ${attachmentCardVisible ? '' : 'hidden'}`}>
            <div className="attachment-header">
                <img className="attachment-icon" alt="" />
                <h3>Attachments</h3>
            </div>
            <div className="attachment-content">
                {attachments.map((attachment, index) => {
                    const attachmentUploadDate = attachment.uploadDate
                        ? uploadDateHelper(attachment.uploadDate)
                        : uploadDateHelper(new Date().toISOString());
                    return (
                        <div key={index} className="attachment-principal">
                            <div className="file-icon">
                                {iconHelper(attachment.name)}
                            </div>
                            <div className="attachment-meta">
                                <span>{attachment.name}</span>
                                <div className="attachment-sub-meta">
                                    <span>{attachmentUploadDate}</span>
                                    <span>·</span>
                                    <span>{attachment.size / 1000}KB</span>
                                    <span>·</span>
                                    <Button
                                        buttonText="Delete"
                                        className="filter-sort-button file-delete-button"
                                        clickHandler={() => deleteAttachment(index)}
                                    ></Button>
                                </div>
                            </div>
                            <div className="download-icon-container">
                                <DownloadSimple size={32}  className="download-icon" onClick={() => downloadFile(attachment)} />
                            </div>
                        </div>
                    );
                })}
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