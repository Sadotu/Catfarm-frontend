import React, { useEffect, useState} from 'react';
import "./Volunteers.css"
// Components
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import VolunteerCard from "../../components/VolunteerCard/VolunteerCard";
// Helpers
import {fetchEnabledUsers} from "../../helpers/CRUDTaskHelper";


function Volunteers() {
    const [activeUsers, setActiveUsers] = useState([])

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
    }, []);

    return (
        <>
            <div className="outer-container">
                <div className="outer-content-container">
                    <Navigation/>
                    <div className="inner-content-container">
                        <Header
                            pageTitle="Our Volunteers"
                        ></Header>

                        <main className="main-container">
                            <section className="user-card-outer-container">
                                {activeUsers.map((volunteer) =>
                                    <VolunteerCard volunteer={volunteer} />
                                )}
                            </section>
                        </main>
                    </div>
                </div>

            </div>
        </>
);
}

export default Volunteers;