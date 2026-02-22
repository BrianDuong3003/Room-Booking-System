import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { createUser, getUserById, getUserByEmail, updateUserPassword } from '../models/user.model';
import { Prisma, UserRole } from '@prisma/client';
import { config } from '../config';
import { logger } from '../utils/logger';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role = UserRole.USER } = req.body;

    // Validate email domain
    const domain = email.split('@')[1];
    if (domain !== config.email.domain) {
      return res.status(400).json({
        status: 'error',
        message: `Email must end with @${config.email.domain}`
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email is already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret as Secret,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation (P2002)
      if (error.code === 'P2002') {
        return res.status(409).json({
          status: 'error',
          message: 'Email already in use'
        });
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to register user'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret as Secret,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to login'
    });
  }
};

// Log out user
export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (userId) {
      logger.info(`User logged out: ${req.user?.email}`);
    }
    
    // Since JWT tokens are stateless, we can't invalidate them on the server side
    // The client should remove the token from its storage
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to logout'
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }
    
    // Get user with password
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }
    
    const user = await getUserByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Verify old password
    const isPasswordValid = await bcrypt.compare(old_password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    
    // Update password
    await updateUserPassword(userId, hashedPassword);
    
    logger.info(`Password changed for user: ${req.user.email}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password'
    });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // User ID should be available from auth middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user information'
    });
  }
};