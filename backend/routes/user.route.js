import express from "express";
import { regiserUser, loginUser, logout, getUserProfile } from "../controllers/user.controller.js";
import { body } from "express-validator";
import auth from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/register", regiserUser);
userRouter.post("/login", loginUser);
userRouter.get('/logout', auth, logout)
userRouter.get('/profile', auth, getUserProfile)



// userRouter.post("/register", [
//     body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
//     body('fullName.lastName').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
//     body('email').isEmail().withMessage('Email must be a valid email address'),

//     body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//     // body('role').isIn(['admin', 'user']).withMessage('Role must be either admin or user')
// ], regiserUser);


export default userRouter;