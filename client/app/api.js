import axios from 'utils/axios-base';

const getAllChallenges = () => axios.get('/challenges');

export {
  getAllChallenges,
};
