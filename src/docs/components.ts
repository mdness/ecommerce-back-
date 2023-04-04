export default {
  components: {
    schemas: {
      ProductId: {
        type: 'string',
        description: 'An id of a product',
        example: 'fae019a0-a19c-4dc6-a0f3-056a14acf9c5',
      },
      UserId: {
        type: 'string',
        description: 'An id of an user.',
        example: '6185584bc0d33bdb01a32966',
      },
      OrderId: {
        type: 'string',
        description: 'An id of an order.',
        example: '61a6bba3f5c7da3594512795',
      },
      User: {
        type: 'object',
        description: 'User data.',
        properties: {
          id: {
            type: 'string',
            description: 'User id.',
            example: '61855811efae7a5e849ebb9c',
          },
          email: {
            type: 'string',
            description: 'User email.',
            example: 'test@example.com',
          },
          name: {
            type: 'string',
            description: 'User name.',
            example: 'Maite Cianni',
          },
          address: {
            type: 'string',
            description: 'User address.',
            example: 'Bartolome Mitre 1644',
          },
          number: {
            type: 'string',
            description: 'User address floor number, optional.',
            example: '1',
          },
          apartment: {
            type: 'string',
            description: 'User department number, optional.',
            example: '23',
          },
          postalCode: {
            type: 'string',
            description: 'User postal/ZIP code.',
            example: '12345',
          },
          age: {
            type: 'number',
            description: 'User age.',
            example: '21',
          },
          telephone: {
            type: 'string',
            description: 'User phone number, with international code.',
            example: '+5490116872412',
          },
          photo: {
            type: 'string',
            description: 'Path to where the user picture is stored.',
            example: 'https://picsum.photos/300?random=3',
          },
          admin: {
            type: 'boolean',
            description: 'Shows if an user is admin or not.',
            example: false,
          },
        },
      },
      UserData: {
        type: 'object',
        description: 'Logged-in user data.',
        properties: {
          email: {
            type: 'string',
            description: 'User email.',
            example: 'test1@example.com',
          },
          name: {
            type: 'string',
            description: 'User name.',
            example: 'Juan Acosta',
          },
          address: {
            type: 'string',
            description: 'User address.',
            example: 'Salta 1840',
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
            example: '30',
          },
          telephone: {
            type: 'string',
            description: 'User phone number, with international code.',
            example: '+542477606954',
          },
          photo: {
            type: 'string',
            description: 'Path to where the user picture is stored.',
            example: 'https://picsum.photos/300?random=3',
          },
          admin: {
            type: 'boolean',
            description: 'Shows if an user is admin or not.',
            example: false,
          },
        },
      },
      Product: {
        type: 'object',
        description: 'A product',
        properties: {
          id: {
            type: 'string',
            description: 'Product identification id',
            example: 'fae019a0-a19c-4dc6-a0f3-056a14acf9c5',
          },
          name: {
            type: 'string',
            description: 'Product name',
            example: 'PFCH-2856-2940',
          },
          description: {
            type: 'string',
            description: 'Product description',
            example:
              'Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare. Ius everti consectetuer et, meis mutat.',
          },
          code: {
            type: 'string',
            description: 'Product code',
            example: 'PFCH-2856-2940',
          },
          price: {
            type: 'number',
            description: 'Product price',
            example: '120.68',
          },
          category: {
            type: 'string',
            description: 'Product category',
            example: 'Home',
          },
          photo: {
            type: 'string',
            description: 'Product image url',
            example: 'https://picsum.photos/300?random=3',
          },
          timestamp: {
            type: 'string',
            description: 'Product time and date of creation',
            example: '21/10/2021 11:54:40',
          },
          stock: {
            type: 'number',
            description: 'Product stock',
            example: '21',
          },
        },
      },
      ProductInput: {
        type: 'object',
        description:
          'Product data when saving a new product or editing an existing one.',
        properties: {
          name: {
            type: 'string',
            description: 'Product name',
            example: 'Test Product',
          },
          description: {
            type: 'string',
            description: 'Product description',
            example:
              'Lorem ipsum dolor sit amet, nam fierent perfecto ea, pro in albucius oportere accommodare. Ius everti consectetuer et, meis mutat.',
          },
          code: {
            type: 'string',
            description: 'Product code',
            example: 'PFCH-2856-2940',
          },
          price: {
            type: 'number',
            description: 'Product price',
            example: '120.68',
          },
          photo: {
            type: 'string',
            description: 'Product image.',
            format: 'binary',
          },
          stock: {
            type: 'number',
            description: 'Product stock',
            example: '21',
          },
          category: {
            type: 'string',
            description: "Product's category",
            example: 'Games',
          },
        },
      },
      ProductCart: {
        type: 'object',
        description: 'A product in cart.',
        properties: {
          product: {
            $ref: '#/components/schemas/Product',
          },
          quantity: {
            type: 'number',
            description: 'Amount of this product in the cart.',
            example: '1',
          },
        },
      },
      ProductOrder: {
        type: 'object',
        description: 'A product in an order.',
        properties: {
          product: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Product name',
                example: 'Test Product',
              },
              description: {
                type: 'string',
                description: 'Product description',
                example:
                  'Ac nulla fringilla, suscipit justo in, facilisis velit. Vivamus ac tempus ligula. Donec facilisis augue quis felis vestibulum, vitae semper est egestas.',
              },
              price: {
                type: 'number',
                description: 'Product price',
                example: '123.4',
              },
              id: {
                $ref: '#/components/schemas/ProductId',
              },
            },
          },
          quantity: {
            type: 'number',
            description: 'Amount of this product in the order.',
            example: '1',
          },
        },
      },
      Order: {
        type: 'object',
        description: 'An Order.',
        properties: {
          user: {
            $ref: '#/components/schemas/UserId',
          },
          products: {
            $ref: '#/components/schemas/ProductOrder',
          },
          total: {
            type: 'number',
            description: 'Total price of the order.',
            example: '1500',
          },
          status: {
            type: 'string',
            description:
              'Order status, can be "placed" for generated but not completed orders, or "completed" for completed orders.',
            example: 'completed',
          },
          shippingAddress: {
            type: 'string',
            description: 'Delivery Address.',
            example: 'Test Address 1234, 1st floor, 121',
          },
          postalCode: {
            type: 'string',
            description: 'Postal/ZIP code.',
            example: '12345678',
          },
          timestamp: {
            type: 'string',
            description: 'Date and time when the order was created.',
            example: '2021-12-01T00:02:43.013Z',
          },
          updatedAt: {
            type: 'string',
            description: 'Date and time when the order was last updated.',
            example: '2021-12-01T00:02:43.013Z',
          },
          id: {
            $ref: '#/components/schemas/OrderId',
          },
        },
      },
      Message: {
        type: 'object',
        description: 'A chat message.',
        properties: {
          user: {
            $ref: '#/components/schemas/User',
          },
          text: {
            type: 'string',
            description: 'Text in the message.',
            example: 'Hi!',
          },
          type: {
            type: 'string',
            description:
              'Indicates if message was sent by the user ("user") or by the system ("system").',
            example: 'system',
          },
          date: {
            type: 'string',
            description: 'Creation date of the message.',
            example: '2021-11-29T18:44:55.533Z',
          },
          id: {
            type: 'string',
            description: 'Message id.',
            example: '61a51fa72e460752431763bd',
          },
        },
      },
      Error: {
        type: 'object',
        description: 'Error structure.',
        properties: {
          error: {
            type: 'string',
            description: 'Error internal code.',
            example: '-4',
          },
          name: {
            type: 'string',
            description: 'Name of the error class.',
            example: 'NotFound',
          },
          message: {
            type: 'string',
            description: 'Error message.',
            example: 'Product not found',
          },
          stack: {
            type: 'string',
            description: 'Error stack trace',
            example:
              'Error: -4, Message: Product does not exist on cart., Stack: NotFound: Product does not exist on cart.     at new BaseError (/Users/mac/Desktop/Prog BackEnd | Coderhouse/Proyecto Final/src/errors/index.ts:13:11)     at new NotFound (/Users/mac/Desktop/Prog BackEnd | Coderhouse/Proyecto Final/src/errors/index.ts:36:5)    at CartModelMongoDB.<anonymous> (/Users/mac/Desktop/Prog BackEnd | Coderhouse/Proyecto Final/src/models/mongodb/cart.ts:72:20)    at Generator.next (<anonymous>)    at fulfilled (/Users/mac/Desktop/Prog BackEnd | Coderhouse/Proyecto Final/src/models/mongodb/cart.ts:5:58)    at runMicrotasks (<anonymous>)    at processTicksAndRejections (internal/process/task_queues.js:93:5)',
          },
          description: {
            type: 'string',
            description: 'Error description, it can exist or not.',
            example: 'The following fields are missing: name.',
          },
        },
      },
    },
  },
};
