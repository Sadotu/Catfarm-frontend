import axios from 'axios';

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