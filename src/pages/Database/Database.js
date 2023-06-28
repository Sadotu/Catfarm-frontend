import React from 'react';
import SmallCard from "../../components/SmallCard/SmallCard";

function Database(props) {
    return (
        <div style={{ padding: '50px' }}>
            <SmallCard
                options={["All Tasks", "Your Tasks", "Volunteers"]}
                subOptions={["Completed", "In Progress", "Overdue"]}
                isVisible={true}

            ></SmallCard>
        </div>
    );
}

export default Database;