import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
    const {loginWithPopup, isAuthenticated} = useAuth0();

    return (
        !isAuthenticated && (
            <>
                <h1> Welcome to BuyHive! </h1>
                <button onClick={() => loginWithPopup()}>
                    Sign In/Sign Up
                </button>
            </>
        )
        
    )
}

export default LoginButton;