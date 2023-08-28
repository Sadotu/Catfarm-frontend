import axios from 'axios';

export const fetchEnabledUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios.get('http://localhost:8080/users/enabled', { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
};