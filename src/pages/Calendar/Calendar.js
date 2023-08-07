import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';

const CalendarPage = () => {
    const navigate = useNavigate();
    const [calendarPeriod, setCalendarPeriod] = useState('');

    const handleDropdownChange = useCallback((selectedOption) => {
        const now = new Date();
        switch (selectedOption.value) {
            case 'decade':
                setCalendarPeriod(`${now.getFullYear() - (now.getFullYear() % 10)}-${now.getFullYear() - (now.getFullYear() % 10) + 9}`);
                break;
            case 'year':
                setCalendarPeriod(`${now.getFullYear()}`);
                break;
            case 'month':
                setCalendarPeriod(now.toLocaleString('default', { month: 'long' }) + " " + now.getFullYear());
                break;
            case 'week':
                setCalendarPeriod(`Week ${getWeekNumber(now)} of ${now.getFullYear()}`);
                break;
            case 'day':
                setCalendarPeriod(now.toLocaleDateString());
                break;
            default:
                setCalendarPeriod('');
        }
    }, []);

    // Function to calculate week number
    const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) + firstDayOfYear.getTimezoneOffset() * 60 * 1000;
        return Math.ceil((pastDaysOfYear / 86400000 + firstDayOfYear.getDay() + 1) / 7);
    };

    // Set default calendarPeriod on component mount
    useEffect(() => {
        handleDropdownChange({ value: 'month' });
    }, [handleDropdownChange]);

    return (
        <div>
            <Header
                backButton={false}
                buttons={[
                    {
                        text: 'Create Event',
                        className: 'general-button',
                        clickHandler: () => navigate('/new_event')
                    },
                    {
                        text: 'Create Task',
                        className: 'general-button',
                        clickHandler: () => navigate('/new_task')
                    }
                ]}
                dropdown={{
                    options: [
                        { label: 'Decade', value: 'decade' },
                        { label: 'Year', value: 'year' },
                        { label: 'Month', value: 'month' },
                        { label: 'Week', value: 'week' },
                        { label: 'Day', value: 'day' }
                    ],
                    defaultOption: { label: 'Month', value: 'month' },
                    handleOptionClick: handleDropdownChange
                }}
                calendarPeriod={calendarPeriod}
            />
            {/* Rest of the calendar page content */}
        </div>
    );
};

export default CalendarPage;
