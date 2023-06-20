import jwt from "jsonwebtoken"
import { Request } from "express";
import { UnauthorizedErrorModel } from "../4-models/error-models";
import crypto from "crypto";
import UserModel from "../4-models/user-model";
import RoleModel from "../4-models/role-model";


// create a secret key
const secretKey = "TomerVinerShoppingApp";

function getNewToken(user: UserModel): string {

    // delete the password before create the token
    delete user.password;

    const container = { user };

    // expiration time
    const options = { expiresIn: "10h" };

    // make the token
    const token = jwt.sign(container, secretKey, options);

    return token;
}

function verifyToken(request: Request):Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            
            // get the token
            const header = request.header("authorization"); 
            
            if(!header){
                resolve(false);
                return;
            }

            const token = header.substring(7);

            // if there no token
            if(!token){
                resolve(false);
                return;
            }

            // verify the token
            jwt.verify(token, secretKey, err => {
                if(err){
                    resolve(false);
                    return;
                }
                resolve(true);
            });

        } catch (err: any) {
            reject(err);            
        }
    });
}

async function rescueUserFromToken(request: Request) {
        // verify the token
        const isValid = await verifyToken(request);
        if(!isValid) throw new UnauthorizedErrorModel("invalid token");
    
        // get the token
        const token = request.header("authorization").substring(7);
    
        // Extract container from token:
        const container: any = jwt.decode(token);
            
        // Extract user: 
        const user: UserModel = container.user;
        
        return user;
    
}

async function verifyAdmin(request: Request) {

    // check if logged in
    const isLoggedIn = await verifyToken(request);
    if(!isLoggedIn) return false;

    // get user
    const user: UserModel = await rescueUserFromToken(request);

    // return true if user is admin and false if user is customer
    return user.roleId === RoleModel.admin;
}

// function for hashing and salt
function hash(plainText: string): string {
    
    // the salt
    const salt = "theBestWebsiteEver";

    // hash with the salt
    const hashedText = crypto.createHmac("sha512", salt).update(plainText).digest("hex");
    return hashedText
}

export default {
    getNewToken, verifyToken, rescueUserFromToken, verifyAdmin, hash
}