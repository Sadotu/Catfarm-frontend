// selectionHelper.js

export const manageVolunteers = (selectedVolunteers, unselectedVolunteers, activeUsers, currentUserData, action, volunteer) => {
    let updatedSelectedVolunteers = [...selectedVolunteers];
    let updatedUnselectedVolunteers = [...unselectedVolunteers];

    switch (action) {
        case "VOLUNTEER_HANDLER":
            if (updatedSelectedVolunteers.length === 0 && !unselectedVolunteers.includes(currentUserData)) {
                updatedSelectedVolunteers = [currentUserData];
            }
            break;

        case "SHOW_UNSELECTED":
            activeUsers.forEach(user => {
                if (user.email && selectedVolunteers.length === 0) return;
                const isAlreadySelected = selectedVolunteers.some(selected => selected.email === user.email);
                const isAlreadyUnselected = updatedUnselectedVolunteers.some(unselected => unselected.email === user.email);

                if (!isAlreadySelected && !isAlreadyUnselected) {
                    updatedUnselectedVolunteers.push(user);
                }
            });
            break;

        case "MOVE_TO_SELECTED":
            updatedSelectedVolunteers.push(volunteer);
            updatedUnselectedVolunteers = updatedUnselectedVolunteers.filter(user => user.email !== volunteer.email);
            break;

        case "MOVE_TO_UNSELECTED":
            updatedUnselectedVolunteers.push(volunteer);
            updatedSelectedVolunteers = updatedSelectedVolunteers.filter(user => user.email !== volunteer.email);
            break;

        default:
            break;
    }

    return { updatedSelectedVolunteers, updatedUnselectedVolunteers };
};