import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
    const {loginWithPopup, isAuthenticated} = useAuth0();

    const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;

    const handleLogin = () => {
        loginWithPopup({
            authorizationParams: {
                audience: AUTH0_AUDIENCE,
                scope: "openid profile email"
            }
        })
    }

    return (
        !isAuthenticated && (
            <div id="sign-in-intro-container">
                <h1 style={{fontSize: "20px"}}> Welcome to BuyHive! </h1>
                <p id="sign-in-sub-heading"> The all in one shopping cart. </p>
                <button onClick={handleLogin}>
                    Sign Up
                </button>
                <button className="alt-button" onClick={handleLogin}>
                    Sign In
                </button>
            </div>
        )
        
    )
}

export default LoginButton;