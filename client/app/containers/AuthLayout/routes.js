import LoginPage from 'containers/LoginPage/loadable';
import RegisterPage from 'containers/RegisterPage';

export default [
  {
    path: '/login',
    key: 'login',
    component: LoginPage,
    exact: false,
  },
  {
    path: '/register',
    key: 'register',
    component: RegisterPage,
    exact: true,
  },
  // {
  //   path: '/change_password',
  //   key: 'change_password',
  //   component: ChangePassword,
  //   exact: false,
  // },
];
