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