import React, { useState } from 'react';
import "./DropDown.css"

function DropdownMenu({ options, defaultOption }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-menu">
            <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption.label}
            </button>
            {isOpen && (
                <ul className="dropdown-options">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className="dropdown-option"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DropdownMenu;
