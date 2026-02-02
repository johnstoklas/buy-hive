// import React from 'react';
// import Profile from './Profile.jsx';
// import LogoutButton from './LogoutButton.jsx';
import LoginSignupButtons from '../components/modules/authModules/LoginSignupButtons';
import UserOptioButtons from '../components/modules/authModules/UserOptionButtons';
import Profile from '../components/modules/authModules/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

interface AccountPageProps {
    setAccountPageVisible: Dispatch<SetStateAction<boolean>>,
}

const AccountPage = ({setAccountPageVisible} : AccountPageProps) => {
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
                        <div className='flex flex-col gap-4'>
                            <Profile/>
                            <UserOptioButtons 
                                setAccountPageVisible={setAccountPageVisible}
                            />
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default AccountPage;
