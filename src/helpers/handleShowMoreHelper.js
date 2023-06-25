export const handleShowMoreHelper = (tasks, displayedTasks, setDisplayedTasks, setShowMore) => {
    const remainingTasks = tasks.slice(displayedTasks.length);
    const additionalTasks = remainingTasks.slice(0, 6);
    const updatedTasks = [...displayedTasks, ...additionalTasks];

    if (updatedTasks.length === tasks.length) {
        setShowMore(false);
    }

    setDisplayedTasks(updatedTasks);
};