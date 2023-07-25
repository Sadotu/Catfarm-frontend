import React from 'react';
import "./Header.css"
import {useNavigate} from "react-router-dom";

// Components
import Button from '../Button/Button';
import Filter from "../Filter/Filter";
import Sort from "../Sort/Sort"


const Header = ({ pageTitle, backButton = false, task = false, search = false, filter = false, handleFilter, sort = false, handleSort, activeUsers }) => {
    const navigate = useNavigate();

    function handleSearch() {
        console.log("Search function")
    }

    return (
        <header>

            {pageTitle && (
                <div className="header-title">
                    <h1>{pageTitle}</h1>
                </div>
            )}

            <div className="button-bar">
                <div className="task-filter-sort">
                    {backButton && (
                        <Button
                            className="back-arrow"
                            clickHandler={() => window.history.back()}
                        />
                    )}

                    {task && (
                        <Button
                            buttonText="New Task"
                            className="general-button"
                            clickHandler={() => {
                                navigate("/new_task")
                            }}
                        ></Button>
                    )}

                    {filter && (
                        <Filter
                            volunteers={activeUsers}
                            handleFilter={handleFilter}
                        ></Filter>
                    )}

                    {sort && (
                        <Sort></Sort>
                    )}
                </div>

                {search && (
                    <div className="search-container">
                        <input
                            className="search-input not-allowed"
                            placeholder="Search"
                        ></input>
                        <Button
                            className="search-button"
                            onClick={handleSearch}>
                        </Button>
                    </div>
                )}

                {/*{dropdown && (*/}
                {/*    <DropdownMenu*/}
                {/*        options={dropdown.options}*/}
                {/*        defaultOption={dropdown.defaultOption}*/}
                {/*    />*/}
                {/*)}*/}

                {/*{calendarPeriod && (*/}
                {/*    <div className="calendar-nav">*/}
                {/*        <Button*/}
                {/*            icon="<"*/}
                {/*            clickHandler={() => /!* Navigate to previous time period *!/}*/}
                {/*        />*/}
                {/*        <span>{calendarPeriod}</span>*/}
                {/*        <Button*/}
                {/*            icon=">"*/}
                {/*            clickHandler={() => /!* Navigate to next time period *!/}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            {/*{profileInfo && (*/}
            {/*    <div className="profile-info">*/}
            {/*        <h2>{profileInfo.name} {profileInfo.isActive ? '(Active)' : '(Inactive)'}</h2>*/}
            {/*        <p className="profile-subtitle">{profileInfo.pronouns} - {profileInfo.role}</p>*/}
            {/*        <p className="profile-subtitle-smaller">Account Created: {profileInfo.created}</p>*/}
            {/*    </div>*/}
            {/*)}*/}
        </header>
    );
};

export default Header;
