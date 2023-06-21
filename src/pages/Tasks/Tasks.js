import React from 'react';
import "./Tasks.css"
import Header from "../../components/Header/Header";
import {useNavigate} from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";

function Tasks() {
    const navigate = useNavigate();

    return (
        <div className="header-main">
            <Navigation></Navigation>
            <div className="header-container">
                <Header
                    pageTitle="Tasks"
                    buttons={[
                        {
                            text: "Create Task",
                            className: "general-button",
                            clickHandler: () => {navigate("/new_task")}
                        },
                        {
                            text: "Filter",
                            className: "filter-sort-button",
                            clickHandler: () => {
                                console.log("Implement the FILTER FUNCTION!")}
                        },
                        {
                            text: "Sort",
                            className: "filter-sort-button",
                            clickHandler: () => {
                                console.log("Implement the SORT FUNCTION!")}
                        }
                    ]}
                    search={true}
                ></Header>
            </div>
        </div>
    );
}

export default Tasks;