import React, { useContext, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Button, FormGroup, Input } from 'reactstrap';
import CenterPiece from '../components/centerpiece';
import ErrorText from '../components/error_text';
import LoadingComponent from '../components/loading_components';
import { auth } from '../config/firebase';
import logging from '../config/logging';
import UserContext from '../context/user';
import IPageProps from '../interfaces/pages';
import { CreateAccount } from '../modules/auth';

const RegisterPage: React.FunctionComponent<IPageProps> = (props) => {
    const [registering, setRegistering] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useHistory();
    const userContext = useContext(UserContext);

    const fire_token = localStorage.getItem('fire_token');

    const signUpWithEmailAndPassword = () => {
        if (error !== '') setError('');
        setRegistering(true);
        if(password===confirm){
        auth.createUserWithEmailAndPassword(email, password)
            .then(async (result) => {
                logging.info(result);
                auth.currentUser?.sendEmailVerification();
                let user = result.user;
                let displayUsername = name;
                if (user) {
                    user.updateProfile({
                        displayName: displayUsername
                    });
                    let uid = user.uid;
                    let name = displayUsername;
                    let email = user.email;
                    if (name) {
                        try {
                            let fire_token = await user.getIdToken();

                            /**if we get a token, auth with the backup */

                            CreateAccount(uid, name, email, fire_token, (error, _user) => {
                                if (error) {
                                    setError(error);
                                    setRegistering(false);
                                } else if (_user) {
                                    userContext.userDispatch({ type: 'login', payload: { user: _user, fire_token } });
                                    history.push('/login');
                                }
                            });
                        } catch (error) {
                            setError('Invalid token.');
                            logging.error(error);
                            setRegistering(false);
                        }
                    } else {
                        setError('Something went wrong, try again later');
                        setRegistering(false);
                    }
                } else {
                    setError('Oops!!! Something went wrong please try again');
                    setRegistering(false);
                }
                auth.signOut();
            })
            .catch((error) => {
                logging.error(error);

                if (error.code.includes('auth/weak-password')) {
                    setError('Please enter a stronger password.');
                } else if (error.code.includes('auth/email-already-in-use')) {
                    setError('Email already in use.');
                } else {
                    setError('Unable to register.  Please try again later.');
                }

                setRegistering(false);
            });
        }else{
            setError('Password does not match')
        }
    };
    if (fire_token !== null) return <Redirect to="/" />;

    return (
        <CenterPiece header="Reset Password">
            <FormGroup>
                <Input type="text" name="name" id="name" placeholder="Full Name" onChange={(event) => setName(event.target.value)} value={name} />
            </FormGroup>
            <FormGroup>
                <Input type="email" name="email" id="email" placeholder="Email Address" onChange={(event) => setEmail(event.target.value)} value={email} />
            </FormGroup>
            <FormGroup>
                <Input autoComplete="new-password" type="password" name="password" id="password" placeholder="Enter Password" onChange={(event) => setPassword(event.target.value)} value={password} />
            </FormGroup>
            <FormGroup>
                <Input autoComplete="new-password" type="password" name="confirm" id="confirm" placeholder="Confirm Password" onChange={(event) => setConfirm(event.target.value)} value={confirm} />
            </FormGroup>
            <Button disabled={registering} color="success" block onClick={() => signUpWithEmailAndPassword()}>
                Sign Up
            </Button>
            <small>
                <p className="m-1 text-center">
                    Already have an account? <Link to="/login">Login.</Link>
                </p>
            </small>
            <ErrorText error={error} />
            {registering && <LoadingComponent card={false} />}
        </CenterPiece>
    );
};

export default RegisterPage;
