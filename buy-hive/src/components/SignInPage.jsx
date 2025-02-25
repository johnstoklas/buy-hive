import React from 'react';
import LoginButton from './LoginButton.jsx';
import Profile from './Profile.jsx';
import LogoutButton from './LogoutButton.jsx';
import { useAuth0 } from '@auth0/auth0-react';

const SignInPage = ({ user, setUserName, homePage}) => {
  const { isLoading, error } = useAuth0();
  return (
    <section id="sign-in-page" className={homePage ? "sign-in-page-home" : ""}>
        {error && 
          <LoginButton />
        }
        {!error && isLoading && <div className="spinner-loader"></div> }
        {!error && !isLoading && (
          <>
            <LoginButton />
            
            <Profile 
              user={user}
              setUserName={setUserName}
            />
            <LogoutButton />
          </>
        )}
    </section>
  );
};

export default SignInPage;
