import React, {useEffect, useState} from 'react';
import "./Tasks.css"
import axios from 'axios';
import {useNavigate} from "react-router-dom";
// Components
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import TaskCard from "../../components/TaskCard/TaskCard";
import Button from "../../components/Button/Button";
// Helpers

function Tasks() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [visibleTasks, setVisibleTasks] = useState(4); // Initially show 4 tasks

    const handleShowMore = () => {
        setVisibleTasks(visibleTasks + 4); // Show 4 more tasks
    };

    const areMoreTasks = visibleTasks < tasks.length;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiZXBwaWVAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODc2ODY3NTIsImV4cCI6MTY4ODU1MDc1Mn0.AH8lOn3525mJ4BBBRWqMThRhQsJqAk7TYQVSd0N6yS0'; // Replace with your actual JWT token
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get(
                    'http://localhost:8080/tasks/user_tasks/beppie@example.com',
                    { headers }
                );
                console.log(response.data)
                setTasks(response.data);
            } catch (error) {
                console.log('Error retrieving task data:', error);
            }
        };

        fetchData();
    }, []);

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
                        <main className="main-container">
                            <div className="main-container-tasks">
                                {tasks.slice(0, visibleTasks).map(task => (
                                    <TaskCard
                                        key={task.id}
                                        cardTitle={task.nameTask}
                                        deadline={task.deadline}
                                        tasks={tasks}
                                        completed={task.completed}
                                        clickHandler={() => {
                                            // Handle click event
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="show-more-container">
                                {areMoreTasks && (
                                    <Button
                                        className="event-task-done-button"
                                        buttonText="Show More"
                                        clickHandler={handleShowMore}
                                    />
                                )}
                            </div>
                        </main>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default Tasks;