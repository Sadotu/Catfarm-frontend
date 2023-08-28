import React, { useState } from 'react';
import Button from '../Button/Button';
import moment from 'moment';

function EditableDate() {
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState('dd/mm/jj');
    const [borderColor, setBorderColor] = useState('black');

    const formatDate = (inputDate) => {
        const [day, month, year] = inputDate.split('/');
        const dateObj = moment(`${day}-${month}-${year}`, "DD-MM-YY");
        return dateObj.format("DD MMM YYYY");
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setDate(e.target.value);
    };

    const handleBlur = (e) => {
        const pattern = /^\d{2}\/\d{2}\/\d{2}$/;
        if (pattern.test(e.target.value)) {
            const formattedDate = formatDate(e.target.value);
            setDate(formattedDate);
            setBorderColor('black');
            setIsEditing(false);
        } else {
            setDate(e.target.value);
            setBorderColor('red');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur(e);
        }
    };

    return (
        <div className="deadline-content">
            {isEditing ? (
                <input
                    type="text"
                    value={date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{ borderColor: borderColor }}
                />
            ) : (
                <Button
                    buttonText={date}
                    className="event-task-general-button"
                    id="editable-date"
                ></Button>
            )}
            <Button
                buttonText={isEditing ? "Save" : "Edit"}
                className="filter-sort-button edit-margin-left"
                clickHandler={handleEditClick}
            ></Button>
        </div>
    );
}

export default EditableDate;