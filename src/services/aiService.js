import axiosInstance from '../api/axiosInstance';

export const generateDescription = async (projectName) => {
    const response = await axiosInstance.post(
        '/ai/generate-description',
        { projectName }
    );
    return response.data.description;
};


export const sendChatMessage = async (message, conversationHistory) => {
    const response = await axiosInstance.post('/ai/chat', {
        message,
        conversationHistory,
    });
    return response.data;
};