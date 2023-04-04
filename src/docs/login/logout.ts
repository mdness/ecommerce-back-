export default {
  get: {
    tags: ['Authentication'],
    description: 'Log out of the system.',
    operationId: 'logout',
    parameters: [],
    responses: {
      200: {
        description: 'Successful Logout.',
      },
    },
  },
};
