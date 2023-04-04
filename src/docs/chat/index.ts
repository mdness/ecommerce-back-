import getMessages from './getMessages';

export default {
  '/api/chat/{userEmail}': {
    ...getMessages,
  },
};
