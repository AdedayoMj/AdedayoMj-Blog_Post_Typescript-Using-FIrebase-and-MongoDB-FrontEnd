import React, { useContext, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import UserContext from '../context/user';
import firebase from 'firebase';
import IPageProps from '../interfaces/pages';
import { Authenticate, SignInWithSocialMedia as SocialMediaPopup } from '../modules/auth';
import logging from '../config/logging';
import CenterPiece from '../components/centerpiece';
import { Button, Container, FormGroup, Input } from 'reactstrap';
import ErrorText from '../components/error_text';
import LoadingComponent from '../components/loading_components';
import { auth, Providers } from '../config/firebase';
// import Naviagtion from '../components/navigation';

const LoginPage: React.FunctionComponent<IPageProps> = (props) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const userContext = useContext(UserContext);
    const history = useHistory();
    const isLogin = window.location.pathname.includes('login');

    const fire_token = localStorage.getItem('fire_token');

    const signInWithEmailAndPassword = () => {
        if (error !== '') setError('');

        setAuthenticating(true);

        auth.signInWithEmailAndPassword(email, password)
            .then(async (result) => {
                logging.info(result);
                let user = result.user;
                if (user) {
                    let uid = user.uid;
                    let name = user.displayName;
                    let email = user.email;
                    let verify = user.emailVerified;
                    if (verify === true) {
                        if (name) {
                            try {
                                let fire_token = await user.getIdToken();

                                /**if we get a token, auth with the backup */

                                Authenticate(uid, name, email, fire_token, (error, _user) => {
                                    if (error) {
                                        setError(error);
                                        setAuthenticating(false);
                                    } else if (_user) {
                                        userContext.userDispatch({ type: 'login', payload: { user: _user, fire_token } });
                                        history.push('/');
                                    }
                                });
                            } catch (error) {
                                setError('Invalid token.');
                                logging.error(error);
                                setAuthenticating(false);
                            }
                        }
                        setAuthenticating(false);
                    } else {
                        setError('Please verify your email address');
                        setAuthenticating(false);
                    }
                } else {
                    setError('Oops!!! Something went wrong please try again');
                    setAuthenticating(false);
                }
            })
            .catch((error) => {
                logging.error(error);
                setAuthenticating(false);
                setError(error.message);
            });
    };

    const signInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
        if (error !== '') setError('');
        setAuthenticating(true);
        SocialMediaPopup(provider)
            .then(async (result) => {
                logging.info(result);

                let user = result.user;
                if (user) {
                    let uid = user.uid;
                    let name = user.displayName;
                    let email = user.email;

                    if (name) {
                        try {
                            let fire_token = await user.getIdToken();

                            /**if we get a token, auth with the backup */

                            Authenticate(uid, name, email, fire_token, (error, _user) => {
                                if (error) {
                                    setError(error);
                                    setAuthenticating(false);
                                } else if (_user) {
                                    userContext.userDispatch({ type: 'login', payload: { user: _user, fire_token } });
                                    history.push('/');
                                }
                            });
                        } catch (error) {
                            setError('Invalid token.');
                            logging.error(error);
                            setAuthenticating(false);
                        }
                    } else {
                        /**
                         * We can set these manually with a new form
                         * For example, the Twitter provider sometimes
                         * does not provide a username as some users sign
                         * up with a phone number.  Here you could ask
                         * them to provide a name that would be displayed
                         * on this website.
                         * */
                        setError('The identify provider is missing a display name.');
                        setAuthenticating(false);
                    }
                } else {
                    setError('The social media provider does not have enough information. Please try a different provider.');
                    setAuthenticating(false);
                }
            })
            .catch((error) => {
                logging.error(error);
                setAuthenticating(false);
                setError(error.message);
            });
    };

    if (fire_token !== null) return <Redirect to="/" />;
   
    return (
        <Container fluid className="p-0">
            {/* <Naviagtion /> */}
            <CenterPiece header="Login">
                <FormGroup>
                    <Input type="email" name="email" id="email" placeholder="Email Address" onChange={(event) => setEmail(event.target.value)} value={email} />
                </FormGroup>
                <FormGroup>
                    <Input
                        autoComplete="new-password"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter Password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                    />
                </FormGroup>
                <Button disabled={authenticating} color="success" block onClick={() => signInWithEmailAndPassword()}>
                    Login
                </Button>
                <small>
                    <p className="m-1 text-center">
                        Don't have an account? <Link to="/register">Register here.</Link>
                    </p>
                    <p className="m-1 text-center">
                        <Link to="/forget">Forget your password?</Link>
                    </p>
                </small>
                <ErrorText error={error} />
                <hr className="bg-info m-3" />
                <Button block disabled={authenticating} onClick={() => signInWithSocialMedia(Providers.google)} style={{ backgroundColor: '#222454', borderColor: '#222454' }}>
                    <i className="fab fa-google mr-2"></i> Sign {isLogin ? 'in' : 'up'} with Google
                </Button>

                {authenticating && <LoadingComponent card={false} />}
            </CenterPiece>
        </Container>
    );
};

export default LoginPage;
