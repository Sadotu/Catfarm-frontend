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
import SmallCard from "../../components/SmallCard/SmallCard";
import {filterOptions as filterOptionConstants} from "../../helpers/dropdownOptionsHelper";

// Helpers

function Tasks() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [visibleTasks, setVisibleTasks] = useState(4); // Initially show 4 tasks
    const [isFilterCardVisible, setIsFilterCardVisible] = useState(false);
    const [filterOptions, setFilterOptions] = useState([]);

    const areMoreTasks = visibleTasks < tasks.length;

    const handleShowMore = () => {
        setVisibleTasks(visibleTasks + 4); // Show 4 more tasks
    };


    // { activeUsers.map((volunteer)=>(
    //     <span key={ volunteer.email }>{ volunteer.fullName}</span>
    // ))}
    const handleSubOptions = (subOption) => {
        console.log('Je selecteerde', subOption)
    }

    useEffect(() => {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiZXBwaWVAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODc2ODY3NTIsImV4cCI6MTY4ODU1MDc1Mn0.AH8lOn3525mJ4BBBRWqMThRhQsJqAk7TYQVSd0N6yS0'; // Replace with your actual JWT token
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const fetchData = async (url) => {
            try {
                const response = await axios.get(url, {headers});
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.log('Error retrieving data:', error);
            }
        };

        const fetchTasks = async () => {
            const tasks = await fetchData('http://localhost:8080/tasks/user_tasks/beppie@example.com');
            setTasks(tasks);
        };

        const fetchEnabledUsers = async () => {
            const enabledUsers = await fetchData('http://localhost:8080/users/enabled');
            setActiveUsers(enabledUsers);
            // we maken een referentieloze kopie van jouw constante
            const totalFilterOptions = [...filterOptionConstants];

            console.log(totalFilterOptions);

            // we bewerken de constante door gegevens uit de backend toe te voegen
            totalFilterOptions[2].subOptions = enabledUsers.map((user) => ({ label: user.fullName }));
            setFilterOptions(totalFilterOptions);
        }
        fetchTasks();
        fetchEnabledUsers();

    }, []);


    return (
        <>
            <div className="outer-container">
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
                                        setIsFilterCardVisible(!isFilterCardVisible)
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

                        <SmallCard
                            options={filterOptions}
                            isVisible={isFilterCardVisible}
                            onSelect={handleSubOptions}
                        ></SmallCard>

                        <p>hallo</p>

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