import { NextFunction, Request, Response } from "express";
import authService from "../2-utils/auth-service";
import { UnauthorizedErrorModel } from "../4-models/error-models";

async function verifyLoggedIn(request: Request, response: Response, next: NextFunction) {
    try {
        const isValid = await authService.verifyToken(request);        
        if (!isValid) throw new UnauthorizedErrorModel("Invalid token");
        next();
    } catch (err: any) {
        next(err);
    }
}

export default verifyLoggedIn;