import axios from "axios";
import {formatDateToString} from "./DateHelper";

const headersWithAuth = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export async function manageToDos(task, toDos, token) {
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

    await addNewToDos(task, newToDos, token);
    await deleteToDos(task, todoIdsToDelete, token);
    await updateToDos(task, updatedToDos, token);
}

// POST
export const createTask = async (payload, token) => {
    return await axios.post('http://localhost:8080/tasks/add', payload, {
        headers: headersWithAuth(token)
    });
};

// Assign files to new task
export const uploadFiles = async (files, taskId, token) => {
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

// Assign files to existing task
export async function addFiles(task, files, token) {
    const existingFileNames = new Set(task.files.map(file => file.name));
    const uniqueNewFileNames = files.filter(file => !existingFileNames.has(file.name));

    if (uniqueNewFileNames.length > 0) {
        const formData = new FormData();
        uniqueNewFileNames.forEach((file) => {
            formData.append('file', file);
        });
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
}

// Method to add new ToDos to a new task
export const addTodos = async (toDos, taskId, token) => {
    await axios.post(`http://localhost:8080/task/todos/${taskId}/create`, toDos, {
        headers: headersWithAuth(token)
    });
    console.log(`Todo added to task ${taskId}`);
};

// Method to add new ToDos to an existing task
async function addNewToDos(task, newToDos, token) {
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
}

// GET
export const fetchEnabledUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.get('http://localhost:8080/users/enabled', { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchTask = async (
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
) => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.get(`http://localhost:8080/tasks/${task_id}`, { headers });
        const data = response.data;

        if(data.files.length > 0) { setAttachmentCardVisible(true); }
        if (data.toDos.length > 0) { setChecklistVisibility(true); }

        setNameTask(data.nameTask);
        const formattedDeadline = formatDateToString(data.deadline);
        setDeadline(formattedDeadline);
        setDescription(data.description);
        setCompleted(data.completed);
        const userEmails = new Set(data.assignedTo.map(user => user.email));
        const selected = activeUsers.filter(activeUser => userEmails.has(activeUser.email));
        setAssignedTo(selected);
        setFiles(data.files);
        setToDos(data.toDos);

    } catch (error) {
        console.log("Error fetching task:", error);
    }
};

// PUT
// Assign users to new task
export const assignTaskToUsers = async (users, taskId, token) => {
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

export async function updateTaskData(task_id, payload, token) {
    const response = await axios.put(`http://localhost:8080/tasks/update/${task_id}`, payload, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    console.log("Task updated successfully:", response.data);
    return response.data;
}

// Assign and remove user from existing task
export async function assignAndRemoveUsers(task_id, task, assignedTo, token) {
    const newAssignedEmails = new Set(assignedTo.map(user => user.email));
    const oldAssignedEmails = new Set(task.assignedTo.map(user => user.email));

    // Remove users
    for (const oldEmail of oldAssignedEmails) {
        if (!newAssignedEmails.has(oldEmail)) {
            await removeFromTask(oldEmail, task_id, token);
        }
    }

    // Add users
    for (const user of assignedTo) {
        const isUserAlreadyAssigned = task.assignedTo.some(existingUser => existingUser.email === user.email);
        if (!isUserAlreadyAssigned) {
            await assignToTask(user.email, task.id, token);
        }
    }
}

export async function removeFromTask(email, taskId, token) {
    try {
        await axios.put(`http://localhost:8080/users/${email}/remove/task/${taskId}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log(`Successfully removed user ${email} from task.`);
    } catch (error) {
        console.error(`Error removing user ${email} from task:`, error);
    }
}

export async function assignToTask(email, taskId, token) {
    try {
        const updateUserResponse = await axios.put(`http://localhost:8080/users/${email}/task/${taskId}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log(`Assigned task to user ${email}:`, updateUserResponse.data);
    } catch (error) {
        console.error(`Error assigning task to user ${email}:`, error);
    }
}

// Method to update existing ToDos in a task
async function updateToDos(task, updatedToDos, token) {
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
}

export const completeTask = async (data, setIsCompleted) => {
    const currentDate = new Date();
    const deadlineDate = new Date(currentDate.getTime() + 48 * 60 * 60 * 1000);
    const isoString = deadlineDate.toISOString();
    data.deadline = isoString.replace('Z', '+00:00');
    data.completed = !data.completed;
    setIsCompleted(data.completed);

    const payload = {
        nameTask: data.nameTask,
        deadline: data.deadline,
        description: data.description,
        completed: data.completed
    };

    const token = localStorage.getItem('token')

    try {
        const response = await axios.put(
            `http://localhost:8080/tasks/update/${data.id}`,
            payload,
            {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response && response.data) {
            const task = response.data;
            setIsCompleted(task.completed);
        }

    } catch (error) {
        window.confirm(`Failed to update user:, ${error}`);
    }
}

// DELETE
export async function removeFiles(task, files, token) {
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
}

// Method to delete ToDos from an existing task
async function deleteToDos(task, todoIdsToDelete, token) {
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
}