import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, FormGroup, Input } from 'reactstrap';
import CenterPiece from '../components/centerpiece';
import ErrorText from '../components/error_text';
import { auth } from '../config/firebase';
import logging from '../config/logging';

import IPageProps from '../interfaces/pages';

const ForgotPasswordChange: React.FunctionComponent<IPageProps> = props => {
    const [sending, setSending] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const fire_token = localStorage.getItem('fire_token');

    const resetPasswordRequest = () => {
        if (error !== '') setError('');

        setSending(true);

        auth.sendPasswordResetEmail(email)
        .then(() => {
            logging.info('Email sent.');
            setSent(true);
            setSending(false);
        })
        .catch(error => {
            logging.error(error);
            setError(error.message);
            setSending(false);
        });
    }

    if (fire_token !== null) return <Redirect to="/" />;
    
    return (
        <CenterPiece header="Change Password">
        {sent ?
                <p>A link has been sent to your email with instructions.</p>
            :
                <>
                    <p>Please enter your email.</p>
                    <FormGroup>
                        <Input 
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email Address"
                            onChange={event => setEmail(event.target.value)}
                            value={email}
                        />
                    </FormGroup>
                    <Button
                        disabled={sending}
                        color="success"
                        block
                        onClick={() => resetPasswordRequest()}
                    >
                        Send Reset Link
                    </Button>
                    <ErrorText error={error} />
                </>
            }
    </CenterPiece>
    );
}

export default ForgotPasswordChange;