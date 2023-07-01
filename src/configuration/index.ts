import { ConfigInterface } from './interfaces';

export default (): ConfigInterface => ({
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    accessLifetime: process.env.JWT_ACCESS_LIFETIME || '360s',
    refreshLifetime: process.env.JWT_REFRESH_LIFETIME || '3600s',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
