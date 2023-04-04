export default {
  post: {
    tags: ['User'],
    description: 'Sign up to the system (add a valid user).',
    operationId: 'signup',
    parameters: [],
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'User email.',
                example: 'test@example.com',
              },
              password: {
                type: 'string',
                description:
                  'User password, must have at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
                example: 'Secret5*',
              },
              repeatPassword: {
                type: 'string',
                description:
                  'Password validation. Must be the same as password.',
                example: 'Secret5*',
              },
              name: {
                type: 'string',
                description: 'User name.',
                example: 'Mathias Castelli',
              },
              address: {
                type: 'string',
                description: 'User address.',
                example: 'Mercedes 1080',
              },
              number: {
                type: 'string',
                description: 'User address floor number, optional.',
                example: '1',
              },
              apartment: {
                type: 'string',
                description: 'User address department number, optional.',
                example: '23',
              },
              postalCode: {
                type: 'string',
                description: 'User postal/ZIP code.',
                example: '1234567',
              },
              age: {
                type: 'number',
                description: 'User age.',
                example: '21',
              },
              telephone: {
                type: 'string',
                description: 'User phone number, with international code.',
                example: '+56912345678',
              },
              photo: {
                type: 'string',
                description: 'User profile photo.',
                format: 'binary',
              },
              admin: {
                type: 'string',
                description:
                  'Shows if an user will be added as admin or not. It can be "true" or "false", but only admin users can create another admin user',
                example: 'false',
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Signed-up successfully .',
      },
      400: {
        description: 'One of the fields values did not pass validation.',
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
