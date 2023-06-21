import React from 'react';
import "./Navigation.css"
import {NavLink} from "react-router-dom";
import logo from "../../assets/images/cropped-catfarm-150x150.png"

function Navigation( { activeLink } ) {
    return (
        <div className="navigation">
            <div className="navigation-header">
                <a href="https://catfarm.net/" target="_blank" rel="noopener noreferrer">
                    <img src={logo} alt="Logo" className="logo" />
                </a>

                <hr className="separator" />
            </div>
            <ul className="nav-links">
                <li><NavLink to="/profile" activeClassName="active" className="nav-link">Your Profile</NavLink></li>
                <li><NavLink to="/database" activeClassName="active" className="nav-link" disabled>Database</NavLink></li>
                <li><NavLink to="/calendar" activeClassName="active" className="nav-link" disabled>Calendar</NavLink></li>
                <li><NavLink to="/tasks" activeClassName="active" className="nav-link">Tasks</NavLink></li>
                <li><NavLink to="/volunteers" activeClassName="active" className="nav-link">Volunteers</NavLink></li>
                <li><NavLink to="/logout" activeClassName="active" className="nav-link">Logout</NavLink></li>
            </ul>
        </div>
    );
}

export default Navigation;