export default {
  '/api/info': {
    get: {
      tags: ['Server Info'],
      description: 'Get server configuration info.',
      operationId: 'info',
      parameters: [],
      responses: {
        200: {
          description: 'Server configuration obtained successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Server information',
                properties: {
                  PORT: {
                    type: 'string',
                    description: 'Port in where the server is running',
                    example: 8080,
                  },
                  clusterMode: {
                    type: 'string',
                    description: 'Shows if cluster mode is enabled or not',
                    example: 'false',
                  },
                  os: {
                    type: 'string',
                    description: 'Operative system where the server is running',
                    example: 'linux',
                  },
                  cpus: {
                    type: 'string',
                    description: 'Number of CPUs',
                    example: 8,
                  },
                  nodeVersion: {
                    type: 'string',
                    description: 'Node version in use',
                    example: 'v14.15.4',
                  },
                  memory: {
                    type: 'object',
                    description: 'Memory usage information',
                    properties: {
                      rss: {
                        type: 'number',
                        example: 592367616,
                      },
                      heapTotal: {
                        type: 'number',
                        example: 497045504,
                      },
                      heapUsed: {
                        type: 'number',
                        example: 472067104,
                      },
                      external: {
                        type: 'number',
                        example: 21046288,
                      },
                      arrayBuffers: {
                        type: 'number',
                        example: 18887740,
                      },
                    },
                  },
                  processId: {
                    type: 'number',
                    example: 3520,
                  },
                  path: {
                    type: 'string',
                    description: 'Execution path.',
                    example: '/Users/mac/Desktop/Prog BackEnd | Coderhouse',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
