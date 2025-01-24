import React from 'react';
import LoginButton from './LoginButton.jsx';
import Profile from './Profile.jsx';
import LogoutButton from './LogoutButton.jsx';
import { useAuth0 } from '@auth0/auth0-react';

const SignInPage = ({ setUserName }) => {
  const { isLoading, error } = useAuth0();
  return (
  <>
    <section id="sign-in-page">
        {error && 
          <LoginButton />
        }
        {!error && isLoading && <p> Loading... </p>}
        {!error && !isLoading && (
          <>
            <LoginButton />
            
            <Profile 
              setUserName={setUserName}
              isLoading={isLoading}
            />
            <LogoutButton />
          </>
        )}
          {/*
        <input placeholder="Username" id="username"></input>
        <input type="password" placeholder="Password" id="password"></input>
        <button id="submit-sign-in"> Sign In </button>
        <div>
            <p class="sign-up-question"> Don't have an account? </p>
            <p id="sign-up-button"> Sign Up </p>
        </div>
            */}
    </section>

  </>
  );
};

export default SignInPage;
