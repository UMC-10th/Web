import { axiosInstance } from './axios';

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await axiosInstance.post('/auth/signup', data);
  return response.data;
};

export const signin = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post('/auth/signin', data);
  return response.data;
};

export const signout = async () => {
  const response = await axiosInstance.post('/auth/signout');
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data.data;
};

export const updateMe = async (formData: FormData) => {
  const response = await axiosInstance.patch('/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteMe = async () => {
  const response = await axiosInstance.delete('/users');
  return response.data;
};