/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { baseApi, PORT } from '../constants/index';

const baseApiAddress = `${baseApi}:${PORT}`;

export const instance = axios.create({
  baseURL: baseApiAddress,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `${getTokenType()} ${getToken()}`,
  },
});