import React from 'react';
import LoginButton from './LoginButton.jsx';
import Profile from './Profile.jsx';
import LogoutButton from './LogoutButton.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import { userDataContext } from "../contexts/UserProvider.jsx"

const SignInPage = ({ user, homePage, setIsVisible}) => {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const { userData } = userDataContext(); 

  return (
    <section id="sign-in-page" className={homePage ? "sign-in-page-home" : ""}>
        {error && 
          <LoginButton />
        }
        {!error && isLoading && <div className="spinner-loader"></div> }
        {!error && !isLoading && (
          <>           
            {!isAuthenticated ? 
            (
              <LoginButton />
            ) : (
              <>
                <Profile user={user}/>
                <LogoutButton setIsVisible={setIsVisible}/>
              </>
            )}

            
          </>
        )}
    </section>
  );
};

export default SignInPage;
