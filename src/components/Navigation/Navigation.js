import React, {useContext} from 'react';
import "./Navigation.css"
import {NavLink} from "react-router-dom";
import Logo from "../../assets/images/cropped-catfarm-150x150.png"
import {AuthContext} from "../../context/AuthContext";

function Navigation( { profileInfo } ) {
    const { logout } = useContext(AuthContext)

    return (
        <div className="navigation">
            <div className="navigation-header">
                <a href="https://catfarm.net/" target="_blank" rel="noopener noreferrer">
                    {profileInfo && profileInfo.profilePicture && profileInfo.profilePicture.docFile ? (
                        <img className="profile-picture" src={`data:image/jpeg;base64,${profileInfo.profilePicture.docFile}`} alt={profileInfo.fullName} />
                    ) : (
                        <img src={Logo}></img>
                    )}
                </a>

                <hr className="separator" />
            </div>
            <ul className="nav-links">
                <li><NavLink to="/profile" className="nav-link">Your Profile</NavLink></li>
                <li><NavLink to="/database" className="nav-link not-allowed" onClick={(e) => e.preventDefault()}>Database</NavLink></li>
                <li><NavLink to="/calendar" className="nav-link not-allowed" onClick={(e) => e.preventDefault()}>Calendar</NavLink></li>
                <li><NavLink to="/tasks" className="nav-link">Tasks</NavLink></li>
                <li><NavLink to="/volunteers" className="nav-link">Volunteers</NavLink></li>
                <li><NavLink to="/logout" className="nav-link" onClick={logout}>Logout</NavLink></li>
            </ul>
        </div>
    );
}

export default Navigation;