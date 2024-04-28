import swaggerJSDoc from 'swagger-jsdoc'
import env from 'dotenv'

env.config()

const swaggerServer = process.env.SWAGGER_SERVER

const options = {
  definition: {
    openapi: '3.0.2',
    info: {
      title: 'Event Management API',
      version: '1.0.0',
      description: 'This is the backend API for Event Management Platform'
    },
    servers: [{ url: swaggerServer }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/docs/*.js', './src/docs/*.yml']
}

const swagger = swaggerJSDoc(options)

export default swagger
