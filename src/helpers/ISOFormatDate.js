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