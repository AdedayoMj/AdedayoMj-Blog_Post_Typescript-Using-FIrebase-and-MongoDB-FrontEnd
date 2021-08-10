import React, { useEffect, useReducer, useState } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import AuthRoute from './components/authroute';
import LoadingComponent from './components/loading_components';
import Naviagtion from './components/navigation';
import logging from './config/logging';
import routes from './config/routes';
import { initialUserState, UserContextProvider, userReducer } from './context/user';
import { Validate } from './modules/auth';


export interface IApplicationProps{}

const Application: React.FunctionComponent<IApplicationProps> = props => {
    const [userState, userDispatch] = useReducer(userReducer, initialUserState);
    /**Used for debugging */
    const [authStage, setAuthStage] = useState<string>('Checking localstorage ...');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            CheckLocalStorageForCredentials();
        }, 1000);

        // eslint-disable-next-line
    }, []);

    /**
     * check to use if we have a token
     * if we do, verify it with the backend
     * if not, we are logged out initially
     */

    const CheckLocalStorageForCredentials = () => {
        setAuthStage('Checking credentials ...');

        const fire_token = localStorage.getItem('fire_token');

        if (fire_token === null)
        {
            userDispatch({ type: 'logout', payload: initialUserState });
            setAuthStage('No credentials found');
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
        else
        {
          
            return Validate(fire_token, (error, user) => {
                if (error)
                {
                    logging.error(error);
                    setAuthStage('No credentials found');
                    userDispatch({ type: 'logout', payload: initialUserState });
                   setTimeout(() => {
                    setLoading(false);
                   }, 1000);
                    
                }
                else if (user)
                {
                    setAuthStage('User Authenticated');
                    userDispatch({ type: 'login', payload: { user, fire_token } });
                    setTimeout(() => {
                        setLoading(false);
                       },  1000);
                }
            })
        }
    }

    const userContextValues = {
        userState,
        userDispatch
    };

    if (loading)
    {
        return <LoadingComponent>{authStage}</LoadingComponent>;
    }


    return(
        <UserContextProvider value={userContextValues}>
            <Naviagtion/>
        <Switch>

            {routes.map((route, index) => {
                 if (route.auth)
                 {
                     return (
                         <Route
                             path={route.path}
                             exact={route.exact}
                             key={index}
                             render={(routeProps: RouteComponentProps) => <AuthRoute><route.component {...routeProps} /></AuthRoute> }
                         />
                     );
                 }
                    return(
                        <Route
                        key={index}
                        exact={route.exact}
                        path={route.path}
                        render={(routeProps: RouteComponentProps) => <route.component {...routeProps} />}
                        />
                    )
                })
            }
        </Switch>
        </UserContextProvider>
    )
}

export default Application;
