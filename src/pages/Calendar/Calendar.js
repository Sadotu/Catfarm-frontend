import React from 'react';
import Button from "../../components/Button/Button";
import user from '../../assets/icons/user.png'

function Calendar() {

    function clickHandler() {
        console.log("Dit werkt")
    }

    return (
        <Button
            buttonText="Volunteers"
            className="event-task-menu-button"
            clickHandler={clickHandler}
            icon={<img src={user} alt="Icon" />}
        >
        </Button>


    );
}

export default Calendar;