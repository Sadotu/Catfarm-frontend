import React, { useEffect, useState} from 'react';
import "./TaskCard.css"
import axios from "axios";
// Components
import Button from "../Button/Button";
// Helpers
import { calculateDaysLeftHelper } from "../../helpers/calculateDaysLeftHelper";

function TaskCard( { task, clickHandler } ) {
    const [daysLeft, setDaysLeft] = useState(null);
    const [isCompleted, setIsCompleted] = useState(null);

    const toDosCompleted = task.toDos ? task.toDos.filter(toDo => toDo.completed).length : 0;
    console.log(task.toDos)
    const totalToDos = task.toDos ? task.toDos.length : 0;
    const completedPercentage = totalToDos > 0 ? (toDosCompleted / totalToDos) * 100 : 0;

    useEffect(() => {
        setDaysLeft(calculateDaysLeftHelper(task.deadline, task.completed));
    }, [task.deadline, task.completed]);

    useEffect(() => {
        setIsCompleted(task.completed)
    }, [task])

    const completeTask = async (data) => {
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

        console.log(payload)

        const token = localStorage.getItem('token')

        try {
            const response = await axios.put(
                `http://localhost:8080/tasks/update/${task.id}`,
                payload,
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response && response.data) {
                task = response.data;
                setIsCompleted(task.completed);
            }

        } catch (error) {
            console.error("Failed to update user:", error);
        }
    }

    return (
        <div className={isCompleted ? "task-card-container-completed" : "task-card-container"}>
            <div className="card-top">
                <div className="task-card-header">
                    <h3 className="task-card-title">{task.nameTask}</h3>
                </div>
                {isCompleted
                    ? <h6 className="task-card-deadline">Completed</h6>
                    : <h6 className={`${daysLeft && daysLeft.includes("overdue") ? "task-card-deadline-red" : "task-card-deadline"}`}>{daysLeft}</h6>
                }
            </div>

            <div className="card-bottom">
                <div className="sub-tasks-container">
                    <div
                        className="sub-tasks-completed-bar"
                        style={{ width: `${completedPercentage}%` }}
                    >
                    </div>
                    <span className="sub-tasks-text">{`${toDosCompleted}/${totalToDos} tasks completed`}</span>
                </div>
                <div className="card-buttons">
                    <Button
                        buttonText="DEL"
                        className="filter-sort-button"
                        clickHandler={clickHandler}
                    />
                    <Button
                        buttonText={isCompleted ? "Completed" : "Done"}
                        className={isCompleted ? "event-task-completion-button" : "event-task-done-button"}
                        clickHandler={() => {completeTask(task)}}
                    />
                </div>
            </div>
        </div>
    );
}

export default TaskCard;