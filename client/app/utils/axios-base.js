import axios from 'axios';

function getToken() {
  const token = localStorage.getItem('session_token');
  return token;
}

const baseURL = 'http://localhost:4400/api';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'session-token': getToken(),
  },
});

instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (config.baseURL === baseURL && !config.headers.session_token) {
      const ses_token = getToken();

      if (ses_token) {
        // eslint-disable-next-line no-param-reassign
        config.headers['session-token'] = ses_token;
      }
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

export default instance;
