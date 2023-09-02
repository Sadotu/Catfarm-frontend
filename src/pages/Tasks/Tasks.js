import React, {useContext, useEffect, useState} from 'react';
import "./Tasks.css"
import axios from 'axios';
import {AuthContext} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
// Components
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";
import TaskCard from "../../components/TaskCard/TaskCard";
import Button from "../../components/Button/Button";
// Helpers
import {filterData} from "../../helpers/filterDataHelper"
import {fetchEnabledUsers} from "../../helpers/fetchHelper";

function Tasks() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)
    const [filteredTasks, setFilteredTasks] = useState([])
    const [activeUsers, setActiveUsers] = useState([])
    const [visibleTasks, setVisibleTasks] = useState(4); // Initially show 4 tasks

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await fetchEnabledUsers();
                setActiveUsers(users);
            } catch (error) {
                console.log(error)
            }
        };
        fetchData();
    },[]);

    async function handleFilter(newFilters) {
        const result = filterData(activeUsers, newFilters);
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (Array.isArray(result)) {
            try {
                const tasksResponses = await Promise.all(
                    result.map(task =>
                        axios.get(`http://localhost:8080/tasks/${task.id}`, { headers })
                            .then(response => response.data)
                    )
                );
                setFilteredTasks(tasksResponses);
            } catch (error) {
                console.error("An error occurred while fetching tasks:", error);
            }
        } else {
            console.error("filterData did not return an array:", result);
        }
    }

    useEffect(() => {
        handleFilter({ currentUser: user.email, show: 'In Progress', from: 'Your Tasks', volunteersChecked: [] });
    },[activeUsers])

    const handleShowMore = () => {
        setVisibleTasks(visibleTasks + 4); // Show 4 more tasks
    }

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
                                            task={task}
                                            clickHandler={() => {
                                                navigate(`/task/${task.id}`)
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