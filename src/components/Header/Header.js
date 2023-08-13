import React from 'react';
import "./Header.css"
import {useNavigate} from "react-router-dom";

// Components
import Button from '../Button/Button';
import Filter from "../Filter/Filter";
import Sort from "../Sort/Sort"


const Header = ({ pageTitle, backButton = false, task = false, search = false, filter = false, handleFilter, sort = false, handleSort, activeUsers, profileInfo }) => {
    const navigate = useNavigate();

    function handleSearch() {
        console.log("Search function")
    }

    console.log(profileInfo)

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

            {profileInfo && (
                <div className="profile-info">
                    <div className="profile-head">
                        <h2 className="profile-fullname">{profileInfo.fullName}</h2>
                        <h2 className="profile-active">{profileInfo.enabled ? '(active)' : '(Inactive)'}</h2>
                    </div>
                    <div className="profile-extra">
                        <p className="profile-subtitle">Pronouns: {profileInfo.pronouns} - Role: {profileInfo.authorities.length > 0 ? profileInfo.authorities[0].authority.split('_')[1] : 'N/A'}</p>
                        <p className="profile-subtitle-smaller">Account Created: {new Date(profileInfo.creationDate).toLocaleDateString('en-GB')}</p>

                    </div>
                    <hr className="hr-profile" />
                </div>
            )}
        </header>
    );
};

export default Header;
