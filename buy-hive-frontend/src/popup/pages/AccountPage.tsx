// import React from 'react';
// import Profile from './Profile.jsx';
// import LogoutButton from './LogoutButton.jsx';
import LoginSignupButtons from '../modules/authModules/LoginSignupButtons';
import UserOptioButtons from '../modules/authModules/UserOptionButtons';
import Profile from '../modules/authModules/Profile';
import { useAuth0 } from '@auth0/auth0-react';

const AccountPage = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  return (
    <section id="sign-in-page" className="flex flex-1 justify-center items-center pt-14 pb-14">
        {isLoading ? (
          <div className="spinner-loader"></div>
          ) : (
            <>           
              {!isAuthenticated ? (
                  <LoginSignupButtons />
                  ) : (
                  <div className='flex flex-col'>
                      <Profile/>
                      <UserOptioButtons />
                  </div>
              )}
            </>
          )}
    </section>
  );
};

export default AccountPage;
