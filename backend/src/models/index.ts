// import prisma from '../../prisma';

// export { default as prisma } from '../../prisma';

import { PrismaClient, Booking} from '@prisma/client';
const prisma = new PrismaClient();
export default prisma
// export * from '@prisma/client';
import { Prisma} from '@prisma/client';

// Export model-specific functions
export * from './user.model';
export * from './booking.model';
export * from './room.model';
export * from './schedule.model';

// Export interfaces and helper functions

// Define PaginationOptions interface
export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }