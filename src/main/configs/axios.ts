import axios from 'axios';
import Endpoint from './endpoints';

export const drcAxios = axios.create({
  baseURL: Endpoint.DrcApiBaseUrl,
  timeout: 5000,
});
