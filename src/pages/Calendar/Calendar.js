import React from 'react';
import DropDown from "../../components/DropDown/DropDown";

function Calendar() {
    const options = [
        { label: 'Decade', value: 'decade' },
        { label: 'Year', value: 'year' },
        { label: 'Month', value: 'month' },
        { label: 'Week', value: 'week' },
        { label: 'Day', value: 'day' }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <DropDown options={options} defaultOption={options.find(option => option.label === 'Month')} />
        </div>
    );
}

export default Calendar;