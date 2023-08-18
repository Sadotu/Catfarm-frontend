import React, {useContext, useEffect, useState} from 'react';
import "./Tasks.css"
import axios from 'axios';
import {AuthContext} from "../../context/AuthContext";
// Components
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import TaskCard from "../../components/TaskCard/TaskCard";
import Button from "../../components/Button/Button";
// Helpers
import {filterData} from "../../helpers/filterDataHelper"

function Tasks() {
    const { user } = useContext(AuthContext)
    const [filteredTasks, setFilteredTasks] = useState([])
    const [activeUsers, setActiveUsers] = useState([])
    const [visibleTasks, setVisibleTasks] = useState(4); // Initially show 4 tasks

    console.log(user)

    function handleFilter(newFilters) {
        const result = filterData(activeUsers, newFilters);
        if (Array.isArray(result)) {
            setFilteredTasks(result);
        } else {
            console.error("filterData did not return an array:", result);
        }
    }

    const handleShowMore = () => {
        setVisibleTasks(visibleTasks + 4); // Show 4 more tasks
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token')

            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get('http://localhost:8080/users/enabled', { headers });
                const users = response.data;
                setActiveUsers(users);

            } catch (error) {
                console.log('Error retrieving task data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        handleFilter({ currentUser: user.email, show: 'In Progress', from: 'Your Tasks', volunteersChecked: [] });
    },[activeUsers])

    return (
        <>
            <div className="outer-container">
                <div className="outer-content-container">
                    <Navigation/>

                    <div className="inner-content-container">
                        <Header
                            pageTitle="Tasks"
                            task={true}
                            filter={true}
                            handleFilter={handleFilter}
                            sort={true}
                            activeUsers={activeUsers}
                            search={true}
                        ></Header>

                        <main className="main-container">
                            {filteredTasks.length > 0 ? (
                                <div className="main-container-tasks">
                                    {filteredTasks.slice(0, visibleTasks).map(task => (
                                        <TaskCard
                                            key={task.id}
                                            cardTitle={task.nameTask}
                                            deadline={task.deadline}
                                            tasks={filteredTasks}
                                            completed={task.completed}
                                            clickHandler={() => {
                                                // Handle click event
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <h3>No tasks to show</h3>
                            )}
                            <div className="show-more-container">
                                {visibleTasks < filteredTasks.length && (
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