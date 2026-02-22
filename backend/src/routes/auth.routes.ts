import express, { Request, Response, NextFunction } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { registerValidation, loginValidation, changePasswordValidation } from '../utils/validation';

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidation), (req: Request, res: Response, next: NextFunction) => {
  authController.register(req, res);
});

router.post('/login', validate(loginValidation), (req: Request, res: Response, next: NextFunction) => {
  authController.login(req, res);
});

// Protected routes
router.post('/logout', protect, (req: Request, res: Response, next: NextFunction) => {
  authController.logout(req, res);
});

router.post('/changepass', protect, validate(changePasswordValidation), (req: Request, res: Response, next: NextFunction) => {
  authController.changePassword(req, res);
});

router.get('/me', protect, (req: Request, res: Response, next: NextFunction) => {
  authController.getCurrentUser(req, res);
});

export default router;