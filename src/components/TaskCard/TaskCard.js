import React, {useEffect, useState} from 'react';
import "./TaskCard.css"
// Components
import Button from "../Button/Button";
// Helpers
import { calculateDaysLeftHelper } from "../../helpers/calculateDaysLeftHelper";

function TaskCard( { cardTitle, deadline, tasks, completed = false, clickHandler } ) {
    const tasksCompleted = tasks ? tasks.filter(task => task.completed).length : 0;
    const totalTasks = tasks ? tasks.length : 0;
    const completedPercentage = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

    const [daysLeft, setDaysLeft] = useState(null);

    useEffect(() => {
        setDaysLeft(calculateDaysLeftHelper(deadline, completed));
    }, [deadline, completed]);

    return (
        <div className={completed ? "task-card-container-completed" : "task-card-container"}>
            <div className="card-top">
                <div className="task-card-header">
                    <h3 className="task-card-title">{cardTitle}</h3>
                </div>
                <h6 className={`${daysLeft && daysLeft.includes("overdue") ? "task-card-deadline-red" : "task-card-deadline"}`}>{daysLeft}</h6>
            </div>

            <div className="card-bottom">
                <div className="sub-tasks-container">
                    <span
                        className="sub-tasks-completed-bar"
                        style={{ width: `${completedPercentage}%` }}
                    >
                    </span>
                    <span className="sub-tasks-text">{`${tasksCompleted}/${totalTasks} tasks completed`}</span>
                </div>
                <div className="card-buttons">
                    <Button
                        buttonText="DEL"
                        className="filter-sort-button"
                        clickHandler={clickHandler}
                    />
                    <Button
                        buttonText={completed ? "Completed" : "Done"}
                        className={completed ? "event-task-completion-button" : "event-task-done-button"}
                        clickHandler={clickHandler}
                    />
                </div>
            </div>
        </div>
    );
}

export default TaskCard;