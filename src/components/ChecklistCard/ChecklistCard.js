import React from 'react';
import "./ChecklistCard.css"
// Components
import Button from "../Button/Button";
// Helpers
import {editableToDoTitle} from "../../helpers/editableHelper"

function ChecklistCard({ toDos, setToDos, checklistVisibility }) {

    const addToDo = () => {
        const newToDo = { description: "Replace with your to do by clicking here", completed: false };
        setToDos([...toDos, newToDo]);
    };

    function updateToDo(index, newText) {
        const updatedToDos = [...toDos];
        updatedToDos[index].description = newText;
        setToDos(updatedToDos);
    }

    const removeToDo = (index) => {
        const updatedToDos = [...toDos];
        updatedToDos.splice(index, 1);
        setToDos(updatedToDos);
    };

    const toggleToDo = (index) => {
        const updatedToDos = [...toDos];
        updatedToDos[index].completed = !updatedToDos[index].completed;
        setToDos(updatedToDos);
    };

    const calculateProgress = () => {
        if (toDos.length === 0) return 0;
        const completedCount = toDos.filter(toDo => toDo.completed).length;
        return ((completedCount / toDos.length) * 100).toFixed(2);
    };

    const progress = calculateProgress();

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
                    <h3>{toDos.length > 0 ? `${calculateProgress()}%` : "0.00%"}</h3>
                    <div className="progress-bar">
                        <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="outer-principal">
                    {toDos.map((toDo, index) => (
                        <div className="to-do-principal" key={index}>
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={toDo.completed}
                                onChange={() => toggleToDo(index)}
                            />
                            <div className="title-and-cross" id="title-and-cross">
                                <h3 id="todo" onClick={() => { editableToDoTitle(index, updateToDo) }}>{toDo.description}</h3>
                                <div className="x-delete" onClick={() => removeToDo(index)} ></div>
                            </div>
                        </div>
                    ))}
                </div>
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