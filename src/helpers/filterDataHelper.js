const FILTERS = Object.freeze({
    FROM: {
        ALL_TASKS: 'All Tasks',
        YOUR_TASKS: 'Your Tasks'
    },
    SHOW: {
        ALL: 'All',
        IN_PROGRESS: 'In Progress',
        OVERDUE: 'Overdue',
        COMPLETED: 'Completed'
    }
});

export const filterData = (data, filters) => {
    if (!isValidInput(data, filters)) {
        return [];
    }

    const filteredFromData = [
        ...getFilteredFromData(data, filters),
        ...getVolunteersCheckedTasks(data, filters.volunteersChecked)
    ];

    const uniqueTasks = filteredFromData.filter((task, index, self) =>
        index === self.findIndex((t) => t.id === task.id)
    );

    return filterBasedOnShow(uniqueTasks, filters.show);
};

const isValidInput = (data, filters) => {
    return Array.isArray(data) && typeof filters === 'object';
};

const getFilteredFromData = (data, filters) => {
    switch (filters.from) {
        case FILTERS.FROM.ALL_TASKS:
            return getAllTasks(data);
        case FILTERS.FROM.YOUR_TASKS:
            return getCurrentUserTasks(data, filters.currentUser);
        default:
            return [];
    }
};

const getAllTasks = (data) => {
    return data.flatMap(user => Array.isArray(user.tasks) ? user.tasks : []);
};

const getCurrentUserTasks = (data, currentUser) => {
    const user = data.find(user => user.email === currentUser);
    return user && Array.isArray(user.tasks) ? user.tasks : [];
};

const getVolunteersCheckedTasks = (data, volunteersChecked) => {
    const tasks = [];

    if (Array.isArray(volunteersChecked) && volunteersChecked.length === 0) {
        return tasks;
    }

    if (Array.isArray(volunteersChecked)) {
        data.forEach(user => {
            if (volunteersChecked.includes(user.email) && Array.isArray(user.tasks)) {
                tasks.push(...user.tasks);
            }
        });
    }

    return tasks;
};

const filterBasedOnShow = (tasks, showFilter) => {
    switch (showFilter) {
        case FILTERS.SHOW.ALL:
            return tasks;
        case FILTERS.SHOW.IN_PROGRESS:
            return filterInProgress(tasks);
        case FILTERS.SHOW.OVERDUE:
            return filterOverdue(tasks);
        case FILTERS.SHOW.COMPLETED:
            return filterCompleted(tasks);
        default:
            return [];
    }
};

const filterInProgress = (tasks) => {
    return tasks.filter(task => !task.completed);
};

const filterOverdue = (tasks) => {
    const currentDate = new Date();

    return tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate < currentDate && !task.completed;
    });
};

const filterCompleted = (tasks) => {
    return tasks.filter(task => task.completed === true);
};