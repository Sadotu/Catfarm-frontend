export function formatDateToString(isoString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date(isoString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${months[monthIndex]} ${year}`;
}

export function formatToISO(dateString) {
    // Parse the input date string into its components
    const [day, month, year] = dateString.split(' ');

    // Create a mapping of month names to month numbers
    const monthMap = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12'
    };

    // Format the day to always have two digits
    const formattedDay = day.length === 1 ? '0' + day : day;

    // Fetch the month number from the month map
    const monthNumber = monthMap[month];

    // Concatenate the components into an ISO 8601 date string
    return `${year}-${monthNumber}-${formattedDay}T00:00:00.000Z`;
}

export const uploadDateHelper = (uploadTimestamp) => {
    const currentTime = new Date().getTime();
    const diffInSeconds = Math.floor((currentTime - uploadTimestamp) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 48) {
        return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    }

    const uploadDate = new Date(uploadTimestamp);
    return uploadDate.toLocaleDateString();
};

export const calculateDaysLeftHelper = (deadline, completed) => {
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