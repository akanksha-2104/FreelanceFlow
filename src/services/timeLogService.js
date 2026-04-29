import axiosInstance from "../api/axiosInstance";

export const getByProject = async (projectId) => {
    const response = await axiosInstance.get(`/time-logs/project/${projectId}`);
    return response.data;
};

export const getTotalHours = async (projectId) => {
    const response = await axiosInstance.get(
        `/time-logs/project/${projectId}/total`
    );
    return response.data;
};

export const create = async (data) => {
    const response = await axiosInstance.post('/time-logs', data);
    return response.data;
};

export const remove = async (logId) => {
    await axiosInstance.delete(`/time-logs/${logId}`);
};