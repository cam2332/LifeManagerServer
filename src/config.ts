export = {
  port: process.env.LIFE_MANAGER_SERVER_PORT || 3000,
  databaseUrl:
    process.env.LIFE_MANAGER_SERVER_MONGODB_URI ||
    'mongodb://localhost:27017/LifeManager',
  JwtSecret: process.env.LIFE_MANAGER_SERVER_JWT_SECRET || 'secret',
};
