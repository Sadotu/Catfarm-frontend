import React from 'react';
import "./Tasks.css"
import {useNavigate} from "react-router-dom";
// Components
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import TaskCard from "../../components/TaskCard/TaskCard";

function Tasks() {
    const navigate = useNavigate();

    return (
        <>
            <div className="outer-contain-forrealzies">
                <div className="outer-content-container">
                    <Navigation/>

                    <div className="inner-content-container">
                        <Header
                            pageTitle="Tasks"
                            buttons={[
                                {
                                    text: "Create Task",
                                    className: "general-button",
                                    clickHandler: () => {
                                        navigate("/new_task")
                                    }
                                },
                                {
                                    text: "Filter",
                                    className: "filter-sort-button",
                                    clickHandler: () => {
                                        console.log("Implement the FILTER FUNCTION!")
                                    }
                                },
                                {
                                    text: "Sort",
                                    className: "filter-sort-button",
                                    clickHandler: () => {
                                        console.log("Implement the SORT FUNCTION!")
                                    }
                                }
                            ]}
                            search={true}
                        ></Header>
                        <main className="main-container banaan">
                            <TaskCard></TaskCard>
                        </main>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default Tasks;