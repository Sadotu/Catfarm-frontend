import axios from 'axios';

export async function saveTaskHelper({
                                         nameTask,
                                         deadline,
                                         description,
                                         completed,
                                         assignedTo,
                                         files,
                                         user,
                                         taskId
                                     }) {
    const token = localStorage.getItem('token');
    const headersConfig = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const date = new Date(Date.parse(deadline));
    date.setHours(16);
    date.setMinutes(0);
    date.setSeconds(0);
    const isoString = date.toISOString();
    deadline = isoString.slice(0, 19);

    const payload = {
        nameTask,
        deadline,
        description,
        completed
    };

    if (taskId === null) {
        // Create a new task
        try {
            const response = await axios.post('http://localhost:8080/tasks/add', payload, {
                headers: headersConfig
            });

            taskId = response.data.id;

        } catch (error) {
            console.error("Task creation error:", error);
            return;
        }

        // Link the user to the newly created task
        try {
            await axios.put(`http://localhost:8080/users/${user.email}/usercreatestask/${taskId}`, null, {
                headers: headersConfig
            });
        } catch (error) {
            console.error("User task creation error:", error);
            return;
        }
    } else {
        // Update the existing task
        try {
            await axios.put(`http://localhost:8080/tasks/update/${taskId}`, payload, {
                headers: headersConfig
            });
        } catch (error) {
            console.error("Task update error:", error);
            return;
        }
    }


    try {
        for (const user of assignedTo) {
            const updateUserResponse = await axios.put(`http://localhost:8080/users/${user.email}/task/${taskId}`, null, {
                headers: headersConfig
            });
        }
    } catch (error) {
        console.error("User task assignment error:", error);
        return;
    }

    try {
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
            headers: headersConfig
        });
    } catch (error) {
        console.error("File upload error:", error);
    }
}
