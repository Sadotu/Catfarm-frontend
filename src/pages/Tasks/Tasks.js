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

    // Tijdelijk
    const tasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
        { id: 3, title: 'Task 3', completed: false },
    ];

    return (
        <>
            <div className="outer-container-forrealzies">
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
                        <main className="main-container-tasks">
                            <TaskCard
                                cardTitle="Project Deadline"
                                deadline="2023-06-20"
                                tasks={tasks}
                                completed={false}
                                clickHandler={() => {
                                    // Handle click event
                                }}
                            />

                            <TaskCard
                                cardTitle="Completed Project"
                                deadline="2023-06-15"
                                tasks={tasks}
                                completed={true}
                                clickHandler={() => {
                                    // Handle click event
                                }}
                            />
                        </main>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default Tasks;