import axiosInstance from '../api/axiosInstance';

export const getSummary = async () => {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
};