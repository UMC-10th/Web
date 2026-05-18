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