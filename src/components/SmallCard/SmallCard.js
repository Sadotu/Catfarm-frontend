import React, { useState } from 'react';
import './SmallCard.css';

const SmallCard = ({title, options, isVisible}) => {
    const [optionsVisible, setOptionsVisible] = useState(false);

    if (!isVisible) return null;

    return (
        <div className="small-card">
            <h5 onClick={() => setOptionsVisible(!optionsVisible)}>{title}</h5>
            <ul className={`options ${optionsVisible ? 'visible' : ''}`}>
                { options.map((option, index) => (
                    <li key={index}>{option}</li>
                )) }
            </ul>
        </div>
    );
};

export default SmallCard;
