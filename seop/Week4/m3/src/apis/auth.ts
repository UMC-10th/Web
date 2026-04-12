import axios from 'axios';

const BASE_URL = 'http://localhost:8000/v1';

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await axios.post(`${BASE_URL}/auth/signup`, data);
  return response.data;
};

export const signin = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${BASE_URL}/auth/signin`, data);
  return response.data;
};