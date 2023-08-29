import React from 'react';
import "./ChecklistCard.css"
// Components
import Button from "../Button/Button";
import {editableToDoTitle} from "../../helpers/editableHelper";

function ChecklistCard({ toDos, setToDos, checklistVisibility }) {

    const addToDo = () => {
        const newToDo = "Replace with your to do by clicking here";
        setToDos([...toDos, newToDo]);
    };

    const removeToDo = (index) => {
        setToDos(toDos.filter((_, i) => i !== index));
    };

    return (
        <div className={`checklist-card ${checklistVisibility ? '' : 'hidden'}`}>
            <div className="checklist-header" id="checklist-header">
                <img className="checklist-icon" alt="" />
                <div className="checklist-title-and-delete-button" id="checklist-title-and-delete-button">
                    <h3 className="task-title">Checklist</h3>
                    <Button
                        buttonText="Delete"
                        className="event-task-general-button checklist-delete-button"
                        clickHandler={() => setToDos([])}
                    ></Button>
                </div>
            </div>
            <div className="checklist-content">
                <div className="checklist-progress-bar">
                    <h3>0%</h3>
                    <div className="progress-bar"></div>
                </div>
                {toDos.map((toDo, index) => (
                    <div className="to-do-principal" key={index}>
                        <input type="checkbox" className="checkbox" />
                        <div className="title-and-cross" id="title-and-cross">
                            <h3 id="todo" onClick={() => {editableToDoTitle(index)}}>{toDo}</h3>
                            <div className="x-delete" onClick={() => removeToDo(index)}></div>
                        </div>
                    </div>
                ))}
                <Button
                    buttonText="Add to do..."
                    className="filter-sort-button"
                    clickHandler={() => addToDo()}
                ></Button>
            </div>
        </div>
    );
}

export default ChecklistCard;