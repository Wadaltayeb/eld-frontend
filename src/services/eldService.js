import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: false, 
});

export function createDriver(driverData) {
  return api.post('/api/drivers/create/', driverData);
}