export default {
  get: {
    tags: ['Chat'],
    description: "Get a list with user's chat messages.",
    operationId: 'getMessages',
    parameters: [
      {
        name: 'userEmail',
        in: 'path',
        schema: {
          type: 'string',
          example: 'test1@example.com',
        },
        required: true,
        description: 'A registered user email',
      },
    ],
    responses: {
      200: {
        description: 'Messages obtained',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              description: 'Array of chat messages.',
              items: {
                $ref: '#/components/schemas/Message',
              },
            },
          },
        },
      },
      404: {
        description: 'There are no messages',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      401: {
        description:
          "Unauthorized route, make sure you're logged in and you're requesting user's own messages.",
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
