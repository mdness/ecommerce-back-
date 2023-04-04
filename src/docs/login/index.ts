import login from './login';
import logout from './logout';

export default {
  '/api/auth/login': {
    ...login,
  },
  // '/auth/signup': {
  //   ...signup,
  // },
  '/api/auth/logout': {
    ...logout,
  },
  // '/auth/userdata': {
  //   ...userData,
  // },
};
