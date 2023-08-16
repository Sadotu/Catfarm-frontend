import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './DragAndDrop.css'
import {useEffect, useState} from "react";

function DragAndDrop({ onFileDrop, user, isSaveTriggered  }) {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);

    const maxSize = 5 * 1024 * 1024; // 5 MB

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/jpeg, image/png', // Other image types can be added as needed
        maxFiles: 1,
        maxSize,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 0) return;

            onFileDrop(acceptedFiles[0]); // Notify the parent component about the file drop
            setUploadedFile(acceptedFiles[0]); // Update the state with the file name
            setUploadedFileName(acceptedFiles[0].name);
        }
    });

    const uploadFile = () => {
        if (!uploadedFile) return;

        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('file', uploadedFile);

        axios.post('http://localhost:8080/files/upload', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                console.log(response.data);

                const fileId = response.data[0].id;
                const userEmail = user.email;

                return axios.put(`http://localhost:8080/files/${fileId}/profile_picture/${userEmail}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            })
            .then(response => {
                console.log("Profile picture updated:", response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        if (isSaveTriggered) {
            uploadFile();
        }
    }, [isSaveTriggered]);

    return (
        <div {...getRootProps()} className="profile-picture-drag-and-drop">
            <input {...getInputProps()} />
            { uploadedFileName ?
                <p>{uploadedFileName}</p> :
                <p>Drop your profile picture here or click in <b>this</b> area</p>
            }
        </div>
    );
}

export default DragAndDrop