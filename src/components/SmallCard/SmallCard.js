import React from 'react';
import './SmallCard.css';

const SmallCard = ({ options, isVisible, onSelect }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="small-card">
            <ul>
                {options.map((option, mainIndex) => (
                    <li key={mainIndex}>
                        <input type="radio" name="accordion" id={`accordion-${mainIndex}`} />
                        <label htmlFor={`accordion-${mainIndex}`} onClick={() => onSelect(option)}>
                            {option.label}
                        </label>
                        <div>
                            <ul>
                                {option.subOptions && option.subOptions.map((subOption, subIndex) => (
                                    <li key={subIndex} onClick={() => onSelect(subOption)}>
                                        {subOption.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default SmallCard;