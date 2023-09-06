import axios from 'axios';
import {formatDateToString} from "./ISOFormatDate";

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
    setTask,
    activeUsers,
    assignedTo
) => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    console.log("Volgorde: fetchHelper")

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
        setAssignedTo(data.assignedTo);
        const unselected = activeUsers.filter(user => !data.assignedTo.includes(user));
        setUnselectedVolunteers(unselected);
        setFiles(data.files);
        setToDos(data.toDos);

        setTask({
            nameTask: data.nameTask,
            deadline: data.deadline,
            description: data.description,
            completed: data.completed
        });
    } catch (error) {
        console.log("Error fetching task:", error);
    }
};