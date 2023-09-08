import React, { useEffect, useState} from 'react';
import "./TaskCard.css"
import axios from "axios";
// Components
import Button from "../Button/Button";
// Helpers
import { calculateDaysLeftHelper } from "../../helpers/calculateDaysLeftHelper";
import { completeTask } from "../../helpers/postHelper";

function TaskCard( { task, clickHandler } ) {
    const [daysLeft, setDaysLeft] = useState(null);
    const [isCompleted, setIsCompleted] = useState(null);

    const toDosCompleted = task.toDos ? task.toDos.filter(toDo => toDo.completed).length : 0;
    const totalToDos = task.toDos ? task.toDos.length : 0;
    const completedPercentage = totalToDos > 0 ? (toDosCompleted / totalToDos) * 100 : 0;

    useEffect(() => {
        setDaysLeft(calculateDaysLeftHelper(task.deadline, task.completed));
    }, [task.deadline, task.completed]);

    useEffect(() => {
        setIsCompleted(task.completed)
    }, [task])

    const deleteTask = async (data) => {
        const task_id = data.id;
        const token = localStorage.getItem('token');

        const isConfirmed = window.confirm('Are you sure you want to delete this task?');

        if (isConfirmed) {
            try {
                const response = await axios.delete(
                    `http://localhost:8080/tasks/delete/${task_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                window.confirm('Task deleted successfully');
                window.location.reload();
            } catch (error) {
                window.confirm(`An error occurred while deleting the task, please try again: ${error}`);
            }
        } else {
            window.confirm('Task deletion was canceled, please contact you system administrator');
        }
    }

    const completeTaskHandler = () => {
        completeTask(task, setIsCompleted);
    };

    return (
        <div className={isCompleted ? "task-card-container-completed" : "task-card-container"}>
            <div className="card-top">
                <div className="task-card-header">
                    <h3 className="task-card-title" onClick={clickHandler}>{task.nameTask}</h3>
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
                        clickHandler={() => {deleteTask(task)}}
                    />
                    <Button
                        buttonText={isCompleted ? "Completed" : "Done"}
                        className={isCompleted ? "event-task-completion-button" : "event-task-done-button"}
                        clickHandler={() => {completeTaskHandler(task, setIsCompleted)}}
                    />
                </div>
            </div>
        </div>
    );
}

export default TaskCard;