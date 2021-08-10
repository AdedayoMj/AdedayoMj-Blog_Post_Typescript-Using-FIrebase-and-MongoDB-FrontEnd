import IRoute from '../interfaces/routes';
import ChangePasswordPage from '../pages/change_password';
import EditPage from '../pages/edit';
import ForgotPasswordChange from '../pages/forgot';
import HomePage from '../pages/home';
import LoginPage from '../pages/login';

import BlogPage from '../pages/blog';
import RegisterPage from '../pages/register';
import ResetPasswordPage from '../pages/reset';

const authRoutes: IRoute[] = [
    {
        name: 'Login',
        path: '/login',
        exact: true,
        component: LoginPage,
        auth: false
    },
    {
        name: 'Sign Up',
        path: '/register',
        exact: true,
        component: RegisterPage,
        auth: false
    },
    {
        name: 'Forget Password Page',
        path: '/forget',
        exact: true,
        component: ForgotPasswordChange,
        auth: false
    },
    {
        name: 'Reset Password Page',
        path: '/reset',
        exact: true,
        component: ResetPasswordPage,
        auth: false
    }
];

const blogRoutes: IRoute[] = [
    {
        name: 'Create',
        path: '/edit',
        exact: true,
        component: EditPage,
        auth: true
    },
    {
        name: 'Change Password Page',
        path: '/change',
        exact: true,
        component: ChangePasswordPage,
        auth: true
    },

    {
        name: 'Edit',
        path: '/edit/:blogID',
        exact: true,
        component: EditPage,
        auth: true
    },
    {
        name: 'Blog',
        path: '/blogs/:blogID',
        exact: true,
        component: BlogPage,
        auth: true
    }
];

const mainRoutes: IRoute[] = [
    {
        name: 'Home',
        path: '/',
        exact: true,
        component: HomePage,
        auth: false
    }
];

const routes: IRoute[] = [...authRoutes, ...blogRoutes, ...mainRoutes];

export default routes;