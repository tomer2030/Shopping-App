import axios from "axios";
import jwtDecode from "jwt-decode";
import CredentialsModel from "../Models/CredentialsModel";
import UserModel from "../Models/UserModel";
import { AuthActionType, authStore } from "../Redux/AuthState";
import appConfig from "../Utils/Config";
import { ProductsActionType, productsStore } from "../Redux/ProductsState";

class AuthService {

    // validate the first part of register
    public async registerPart1(user: UserModel): Promise<boolean> {

        // send to backend the user and received back true if the user not exist or false if exist
        const response = await axios.post<boolean>(appConfig.registerPart1Url, user);

        // return true or false (true === valid user, false === not valid user) based on the response from backend
        return response.data;
    }

    // register
    public async registerPart2(user: UserModel): Promise<void> {

        // send to backend the user
        const response = await axios.post<string>(appConfig.registerPart2Url, user);

        // get the token
        const token = response.data;

        // make an object for put the values of user in the global state
        const valueForRedux = {user: authService.rescueUserFromToken(token), token: token}

        // save the token and the user in global state
        authStore.dispatch({type: AuthActionType.Register, payload: valueForRedux});
    }
    
    // login
    public async login(credentials: CredentialsModel): Promise<void> {

        // send to backend the credentials
        const response = await axios.post<string>(appConfig.loginUrl, credentials);

        // get the token
        const token = response.data;
        
        // get the user
        const user = authService.rescueUserFromToken(token);

        // put the data in object for send to global state
        const data = {user: user, token: token}

        // save the token in global state
        authStore.dispatch({type: AuthActionType.Login, payload: data});
        
    }
    
    // logout
    public logout(): void {

        // delete the token from global state
        authStore.dispatch({type: AuthActionType.Logout});


        // empty the cart details from global state
        productsStore.dispatch({type: ProductsActionType.removeCart});

        // delete the token from local storage
        localStorage.removeItem("token");
    }

    // function for rescue the user from token
    public rescueUserFromToken(token: string): UserModel {
        const container: {user: UserModel} = jwtDecode(token);
        const user = container.user;
        return user;
    }

    // get user
    public getUser(): UserModel {

        // get the user from global state if exist
        let user = authStore.getState().user;

        // if not exist
        if(!user){

            // get the token
            const token = this.getToken();

            // if there isn't token, return null
            if(!token) return null;

            // if there is token, rescue the user from the token and save the user in global state
            user = this.rescueUserFromToken(token);
        }

        return user;
    }

    // function for get the token (from local storage or redux)
    public getToken(): string {

        // get the token from global state
        let token = authStore.getState().token;

        // if not exist, get the token from session storage
        if(!token){
            token = localStorage.getItem("token");
        }
        
        return token;
    }

}

const authService = new AuthService();

export default authService;