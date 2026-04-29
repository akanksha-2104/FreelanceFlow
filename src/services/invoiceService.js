import axiosInstance from '../api/axiosInstance';

export const getAll = async () => {
    const response = await axiosInstance.get('/invoices');
    return response.data;
};

export const getById = async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}`);
    return response.data;
};

export const create = async (data) => {
    const response = await axiosInstance.post('/invoices', data);
    return response.data;
};

export const updateStatus = async (id, status) => {
    const response = await axiosInstance.patch(
        `/invoices/${id}/invoiceStatus`,
        null,
        { params: { invoiceStatus: status } }
    );
    return response.data;
};

export const downloadPDF = async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export const sendEmail = async (id) => {
    const response = await axiosInstance.post(`/invoices/${id}/send`);
    return response.data;
};

export const remove = async (id) => {
    await axiosInstance.delete(`/invoices/${id}`);
};