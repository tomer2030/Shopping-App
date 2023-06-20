import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import './index.css';
import reportWebVitals from './reportWebVitals';
import interceptorService from './Services/InterceptorService';

// create all Interceptors once
interceptorService.createInterceptor();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
    );
root.render(
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
);

reportWebVitals();
