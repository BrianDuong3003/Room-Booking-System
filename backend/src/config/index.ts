import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Environment variables with default values
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  version: process.env.npm_package_version || '1.0.0',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  databaseUrl: process.env.DATABASE_URL || 'mysql://root:admin@localhost:3306/roms_db',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  // System settings for SCAMS
  campus: {
    openingTime: '05:00', // Campus opens at 5 AM
    closingTime: '23:00', // Campus closes at 11 PM
    roomPreparationMinutes: 15, // Rooms prepared 15 minutes before scheduled use
  },
  // Email settings
  email: {
    domain: process.env.EMAIL_DOMAIN || 'hcmut.edu.vn',
  }
};