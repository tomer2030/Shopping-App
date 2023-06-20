import express, { Request, Response, NextFunction } from "express";
import CredentialsModel from "../4-models/credentials-model";
import UserModel from "../4-models/user-model";
import authLogic from "../5-logic/auth-logic";

const router = express.Router();

// login -> POST http://localhost:3001/api/auth/login
router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(request.body);
        const token = await authLogic.login(credentials);
        response.json(token);
    }
    catch (err: any) {
        next(err);
    }
});

// validate register part 1 -> POST http://localhost:3001/api/auth/register/validate
router.post("/auth/register/validate", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const isValid = await authLogic.validateRegisterPart1(user);
        response.json(isValid);
    }
    catch (err: any) {
        next(err);
    }
});

// register -> POST http://localhost:3001/api/auth/register
router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const token = await authLogic.registerPart2(user);
        response.json(token);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;

