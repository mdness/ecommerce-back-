export default {
  get: {
    tags: ['Products'],
    description: 'Get a list of all products.',
    operationId: 'getProducts',
    parameters: [
      {
        name: 'name',
        in: 'query',
        schema: {
          type: 'string',
        },
        description: 'A product name.',
        example: 'Shiratamako - Rice Flour',
      },
      {
        name: 'code',
        in: 'query',
        schema: {
          type: 'string',
        },
        description: 'A product code.',
        example: 'PFCH-2856-2940',
      },
      {
        name: 'minPrice',
        in: 'query',
        schema: {
          type: 'number',
        },
        description: 'Minimum, product price to look for.',
        example: '100',
      },
      {
        name: 'maxPrice',
        in: 'query',
        schema: {
          type: 'number',
        },
        description: 'Maximum, product price to look for.',
        example: '200',
      },
      {
        name: 'minStock',
        in: 'query',
        schema: {
          type: 'number',
        },
        description: 'Minimum, product stock to look for.',
        example: '20',
      },
      {
        name: 'maxStock',
        in: 'query',
        schema: {
          type: 'number',
        },
        description: 'Maximum, product stock to look for.',
        example: '30',
      },
    ],
    responses: {
      200: {
        description: 'Products were obtained',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              description: 'Array of products.',
              items: {
                $ref: '#/components/schemas/Product',
              },
            },
          },
        },
      },
      401: {
        description: 'Unauthorized route, login first and try again',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      404: {
        description: 'There are no products',
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
