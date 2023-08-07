import React, {useEffect, useState} from 'react';
import "./Volunteers.css"
// Components
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import axios from "axios";
import VolunteerCard from "../../components/VolunteerCard/VolunteerCard";

function Volunteers() {
    const [activeUsers, setActiveUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlckB1c2VyLmNvbSIsImlhdCI6MTY5MTE3MTcxNiwiZXhwIjoxNjkyMDM1NzE2fQ.dGiyjnFcrykuZ1t34Jx_n-zWx25z366juNzg09Qxixg';
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