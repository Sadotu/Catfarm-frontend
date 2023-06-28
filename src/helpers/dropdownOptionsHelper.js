// export const banaan = {
//     statuses: ['All', 'Completed', 'In Progress', 'Overdue' ],
//     volunteers: [],
// }
//
// export const statusTypes = ['All', 'Completed', 'In Progress', 'Overdue' ];



export const filterOptions = [
    {
        label: 'All Tasks',
        // subOptions: ['All', 'Completed', 'In Progress', 'Overdue'],
        subOptions: [
            { label : 'All' },
            { label: 'Completed' },
            { label: 'In Progress' },
            { label: 'Overdue' },
        ],
    },
    {
        label: 'Your Tasks',
        subOptions: [
            { label : 'All' },
            { label: 'Completed' },
            { label: 'In Progress' },
            { label: 'Overdue' },
        ],
    },
    {
        label: 'Volunteers',
        subOptions: [
            { label: 'Volunteer 1' },
            { label: 'Volunteer 2' },
            // ... list of active volunteers
        ],
    },
];

export const sortOptions = [
    {
        label: 'Sort by Date',
        subOptions: [
            { label: 'Ascending' },
            { label: 'Descending' },
        ],
    },
    {
        label: 'Sort Alphabetically',
        subOptions: [
            { label: 'Ascending' },
            { label: 'Descending' },
        ],
    },
];
