

import axiosInstance from '../api/axiosInstance';

export const getByProject = async (projectId) => {
    const response = await axiosInstance.get(`/tasks/project/${projectId}`);
    return response.data;
};

export const create = async (data) => {
    const response = await axiosInstance.post('/tasks', data);
    return response.data;
};

export const updateStatus = async (taskId, status) => {
    const response = await axiosInstance.patch(
        `/tasks/${taskId}/status`,
        {},
        { params: { status } }
    );
    return response.data;
};

export const update = async (taskId, data) => {
    const response = await axiosInstance.put(`/tasks/${taskId}`, data);
    return response.data;
};

export const remove = async (taskId) => {
    await axiosInstance.delete(`/tasks/${taskId}`);
};