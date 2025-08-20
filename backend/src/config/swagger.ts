import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookmarks API',
      version: '1.0.0',
      description: 'API de gestion de bookmarks avec authentification JWT',
      contact: {
        name: 'Charlot DEDJINOU',
        email: 'dedjinoucharlotjoel@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: process.env.APP_PRODUCTION_URI,
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Bookmark: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            category: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['unread', 'read', 'reading'] 
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Stats: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            read: { type: 'number' },
            reading: { type: 'number' },
            unread: { type: 'number' },
            byCategory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  count: { type: 'number' }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' },
            statusCode: { type: 'number' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);