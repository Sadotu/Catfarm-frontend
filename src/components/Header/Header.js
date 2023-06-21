import React from 'react';
import "./Header.css"
// Components
import Button from '../Button/Button';
import DropdownMenu from '../DropDown/DropDown';

const Header = ({ pageTitle, backButton = false, buttons, search = false, dropdown, calendarPeriod, profileInfo }) => {

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
                {backButton && (
                    <Button
                        className="back-arrow"
                        clickHandler={() => window.history.back()}
                    />
                )}

                {buttons && (
                    <div className="header-buttons">
                        {buttons.map((button, index) => (
                            <Button
                                key={index}
                                buttonText={button.text}
                                className={button.className}
                                clickHandler={button.clickHandler}
                                disabled={button.disabled}
                                icon={button.icon}
                            />
                        ))}
                    </div>
                )}

                {search && (
                    <div className="search-container">
                        <input
                            className="search-input"
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
