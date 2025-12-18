import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
    const {loginWithPopup, isAuthenticated} = useAuth0();

    return (
        !isAuthenticated && (
            <div id="sign-in-intro-container">
                <h1 style={{fontSize: "20px"}}> Welcome to BuyHive! </h1>
                <p id="sign-in-sub-heading"> The all in one shopping cart. </p>
                <button onClick={() => loginWithPopup()}>
                    Sign Up
                </button>
                <button className="alt-button" onClick={() => loginWithPopup()}>
                    Sign In
                </button>
            </div>
        )
        
    )
}

export default LoginButton;