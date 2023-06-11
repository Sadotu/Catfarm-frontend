import React from 'react';
import Button from '../Button/Button';
import DropdownMenu from '../DropDown/DropDown';

const Header = ({ pageTitle, backButton, buttons, dropdown, calendarPeriod, profileInfo }) => {
    return (
        <header>
            {backButton && (
                <Button
                    className="back-arrow"
                    clickHandler={() => window.history.back()}
                />
            )}

            <div className="header-title">
                <h1>{pageTitle}</h1>
            </div>

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

            {dropdown && (
                <DropdownMenu
                    options={dropdown.options}
                    defaultOption={dropdown.defaultOption}
                />
            )}

            {calendarPeriod && (
                <div className="calendar-nav">
                    <Button
                        icon="<"
                        clickHandler={() => {/* Navigate to previous time period */}}
                    />
                    <span>{calendarPeriod}</span>
                    <Button
                        icon=">"
                        clickHandler={() => {/* Navigate to next time period */}}
                    />
                </div>
            )}

            {profileInfo && (
                <div className="profile-info">
                    <h2>{profileInfo.name} {profileInfo.isActive ? '(Active)' : '(Inactive)'}</h2>
                    <p className="profile-subtitle">{profileInfo.pronouns} - {profileInfo.role}</p>
                    <p className="profile-subtitle-smaller">Account Created: {profileInfo.created}</p>
                </div>
            )}
        </header>
    );
};

export default Header;
