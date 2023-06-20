import { ValidationErrorModel } from "../4-models/error-models";
import authService from "../2-utils/auth-service"
import CredentialsModel from "../4-models/credentials-model";
import UserModel from "../4-models/user-model";
import dal from "../2-utils/dal";
import authSqlQuery from "../2-utils/auth-sql-query";
import RoleModel from "../4-models/role-model";
import { OkPacket } from "mysql";

async function validateRegisterPart1(user: UserModel):Promise<boolean> {

    // check if username already exist
    const userExist = await dal.execute(authSqlQuery.findIfUserExist, [user.userId , user.email]);

    // return true if not exist and save the data in DB, return false if exist
    if (userExist.length === 0) {

        // define the user role as customer
        user.roleId = RoleModel.user;
        
        // hash the password
        user.password = authService.hash(user.password);

        // validation
        const errors = user.validate1();
        if(errors) throw new ValidationErrorModel(errors)

        // save the user in DB
        const values = [
            user.userId,
            user.email,
            user.password,
            user.roleId
        ]

        await dal.execute(authSqlQuery.registerPart1, values);
    }

    return userExist.length === 0;
    
}

async function registerPart2(user: UserModel):Promise<string> {

    // validation
    const errors = user.validate2();
    if(errors) throw new ValidationErrorModel(errors)

    // save the new user in DB
    const values = [
        user.firstName,
        user.lastName,
        user.city,
        user.street,
        user.userId
    ]

    await dal.execute(authSqlQuery.registerPart2, values);
    
    // get the new user
    const newUser = await dal.execute(authSqlQuery.findIfUserExist, [user.userId, null]);

    // generate new token
    const token = authService.getNewToken(newUser[0]);
    return token;
}

async function login(credentials: CredentialsModel) {

    // validation
    const errors = credentials.validate();
    if(errors) throw new ValidationErrorModel(errors);

    // hash
    credentials.password = authService.hash(credentials.password);

    // check if user & password exist
    const values = [credentials.email, credentials.password]
    const users = await dal.execute(authSqlQuery.login, values);
    const user: UserModel = users[0];
    
    // if user not exist
    if(!user) throw new ValidationErrorModel("Incorrect username or password");

    // generate token
    const token = authService.getNewToken(user);
    return token;
}

export default {
    validateRegisterPart1, registerPart2, login
};