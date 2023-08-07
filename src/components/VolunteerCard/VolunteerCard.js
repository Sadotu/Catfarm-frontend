import React from 'react';
import "./VolunteerCard.css"
import User from "../../assets/icons/user.svg";

function VolunteerCard( {volunteer} ) {
    return (
        <div className="user-card-inner-container">
            {volunteer.profilePicture && volunteer.profilePicture.docFile ? (
                <img className="volunteer-picture" src={`data:image/jpeg;base64,${volunteer.profilePicture.docFile}`} alt={volunteer.name} />
            ) : (
                <img src={User}></img>
            )}
            <div className="volunteer-name">
                <h4>{volunteer.fullName}</h4>
                <h4>{volunteer.pronouns}</h4>
            </div>
            <div className="volunteer-info">
                <h5>{volunteer.email}</h5>
                <h5>{volunteer.phoneNumber}</h5>
            </div>
        </div>
    );
}

export default VolunteerCard;