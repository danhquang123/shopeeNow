import axiosInstance from "../axiosInstance";

export const getUserAddressesApi = async () => {
    const response = await axiosInstance.get('/users/addresses');
    return response.data;
};

export const addAddressApi = async (addressPayload) => {
    const response = await axiosInstance.post('/address', addressPayload);
    return response.data;
};

export const updateAddressApi = async (addressId, addressPayload) => {
    const response = await axiosInstance.put(`/addresses/${addressId}`, addressPayload);
    return response.data;
};

export const deleteAddressApi = async (addressId) => {
    const response = await axiosInstance.delete(`/addresses/${addressId}`);
    return response.data;
};

export const getAllAddressesApi = async () => {
    const response = await axiosInstance.get('/addresses');
    return response.data;
};

export const getAddressById = async (addressId) => {
    const response = await axiosInstance.get(`/addresses/${addressId}`);
    return response.data;
};
