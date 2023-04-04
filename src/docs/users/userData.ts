export default {
  get: {
    tags: ['User'],
    description: "Logged-in user's data.",
    operationId: 'userData',
    parameters: [],
    responses: {
      200: {
        description: 'Logged-in user data successfully obtained.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserData',
            },
          },
        },
      },
      404: {
        description: "There's no user logged in.",
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};
