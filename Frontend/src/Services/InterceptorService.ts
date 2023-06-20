import axios from "axios";
import { authStore } from "../Redux/AuthState";

class InterceptorService {
    public createInterceptor(): void {
        axios.interceptors.request.use(request => {

            // if there is a token in global state
            if(authStore.getState().token){
                
                // create JWT header with that token
                request.headers = {
                    authorization: "Bearer " + authStore.getState().token
                }
            }

            return request;
        });
    }
}

const interceptorService = new InterceptorService();

export default interceptorService;