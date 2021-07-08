import { instance as axios } from './helpers/axios-base';

const getStravaUserDetails = (params) => axios.get('/auth/strava', { params: { ...params } });

export {
    getStravaUserDetails,
};