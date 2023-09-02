import React from 'react';
import User from "../../assets/icons/user.svg";
import "./VolunteerOption.css"
import Button from "../Button/Button";

function VolunteerOption( {selectedVolunteers, showUnselected, unselectedVolunteers, handleVolunteerManagement} ) {

    return (
        <div className="volunteer-option">
            <h3 className="volunteer-option-header">Volunteers</h3>
            <div className="volunteer-option-content">
                {selectedVolunteers.map((v) => (
                    <div key={v.email} onClick={showUnselected ? () => handleVolunteerManagement("MOVE_TO_UNSELECTED", v) : null} className="tooltip">
                        {v.profilePicture && v.profilePicture.docFile ? (
                            <img className="profile-volunteer" src={`data:image/jpeg;base64,${v.profilePicture.docFile}`} alt={v.fullName} />
                        ) : (
                            <img src={User} className="profile-volunteer profile-icon" alt={v.fullName}></img>
                        )}
                        <span className="tooltiptext">{v.fullName}</span>
                    </div>
                ))}
                <Button
                    className={`event-task-menu-button-circle ${showUnselected ? 'event-task-menu-button-circle-is-active' : ''}`}
                    clickHandler={() => handleVolunteerManagement("SHOW_UNSELECTED")}
                ></Button>
                {showUnselected && unselectedVolunteers.map((v) => (
                    <div key={v.email} onClick={() => handleVolunteerManagement("MOVE_TO_SELECTED", v)} className="tooltip">
                        {v.profilePicture && v.profilePicture.docFile ? (
                            <img className="profile-volunteer" src={`data:image/jpeg;base64,${v.profilePicture.docFile}`} alt={v.fullName} />
                        ) : (
                            <img src={User} className="profile-volunteer profile-icon" alt={v.fullName}></img>
                        )}
                        <span className="tooltiptext">{v.fullName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VolunteerOption;