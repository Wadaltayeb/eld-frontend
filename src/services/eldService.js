import axios from 'axios';

export function createDriver(driverData) {
  return axios.post('http://localhost:8000/api/drivers/create/', driverData);
}