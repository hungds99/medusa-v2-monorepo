const { loadEnv, defineConfig } = require('@medusajs/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:8000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:7001',
      authCors: process.env.AUTH_CORS || 'http://localhost:7001',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: {
    disable: true,
  },
  plugins: [
    {
      resolve: 'medusa-payment-stripe',
      options: {
        api_key: process.env.STRIPE_API_KEY,
      },
    },
  ],
});
