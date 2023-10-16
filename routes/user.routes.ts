import { Router } from 'express';
import passport from 'passport';
import validate from '../middleware/validate';
import authValidation from '../validations/auth.validation';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), userController.getAllUsers);

router.post('/signup', validate(authValidation.register), userController.signup);
router.post('/login', userController.login);

export default router;
