import React from 'react';
import Button from "../../components/Button/Button";
import user from '../../assets/icons/user.png'

function Calendar() {

    function clickHandler() {
        console.log("Dit werkt")
    }

    return (
        <Button
            className="back-arrow"
            clickHandler={clickHandler}
        >
        </Button>


    );
}

export default Calendar;