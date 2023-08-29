import React from 'react';
import "./DescriptionCard.css"
// Components
import {editableDescription} from "../../helpers/editableHelper";

export function DescriptionCard(props) {

    return (
        <div className="description-card">
            <div className="description-header">
                <img className="description-icon" alt="" />
                <h3>Description</h3>
            </div>
            <div id="editable-description" className="description-content">
                <h5 onClick={() => {editableDescription()}} id="editable-text-description">Click here to edit the description...</h5>
            </div>
        </div>
    );
}