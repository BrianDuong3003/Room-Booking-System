// Import the Prisma client and any other necessary types
// import { prisma } from '../../prisma'; // Adjust the path as needed
import { Prisma, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Define the UserWithoutPassword type explicitly
export type UserWithoutPassword = Omit<Prisma.UserGetPayload<{}>, 'password'>;

// Sanitize function to remove sensitive data
export const sanitizeOutput = (user: any): any => {
  if (!user) return user;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const createUser = async (data: Prisma.UserCreateInput): Promise<UserWithoutPassword> => {
  const user = await prisma.user.create({
    data
  });
  
  return sanitizeOutput(user) as UserWithoutPassword;
};

export const getUserById = async (id: string): Promise<UserWithoutPassword | null> => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  
  return user ? sanitizeOutput(user) as UserWithoutPassword : null;
};

// Get user by email - returns full user object including password for auth
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email }
  });
};

// Get user by email without password - for safe responses to client
export const getUserByEmailSafe = async (email: string): Promise<UserWithoutPassword | null> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  return user ? sanitizeOutput(user) as UserWithoutPassword : null;
};

// Update user password
export const updateUserPassword = async (userId: string, newPassword: string): Promise<UserWithoutPassword> => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword }
  });
  
  return sanitizeOutput(updatedUser) as UserWithoutPassword;
};