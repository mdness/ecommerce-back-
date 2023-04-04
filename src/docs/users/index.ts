import getUser from './getUser';
import getUsers from './getUsers';
import signup from './signup';
import userData from './userData';

export default {
  '/api/users': {
    ...getUsers,
  },
  '/api/users/loggedUser/data': {
    ...userData,
  },
  '/api/users/signup': {
    ...signup,
  },
  '/api/users/{id}': {
    ...getUser,
  },
};
