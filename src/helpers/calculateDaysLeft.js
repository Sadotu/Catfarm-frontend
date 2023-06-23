export const calculateDaysLeft = (deadline, completed) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline).setHours(0, 0, 0, 0);

    if (completed) {
        return 'Completed';
    } else if (today > deadlineDate) {
        const daysOverdue = Math.ceil((today - deadlineDate) / (1000 * 60 * 60 * 24));
        return `${daysOverdue} days overdue`;
    } else {
        const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        return `${daysRemaining} days left`;
    }
};