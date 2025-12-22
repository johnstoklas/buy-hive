import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = ({ setIsVisible }) => {
  const { logout, isAuthenticated } = useAuth0();
  
  const viewItems = () => {
    setIsVisible(false);
  }

  // Logs a user out of their account
  const handleLogout = async() => {
    await chrome.storage.session.clear();
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
      <>
        <button onClick={viewItems}> 
          View Items 
        </button>
        <button className="alt-button" onClick={() => window.open('https://buyhive.dev/report', '_blank')}>
          Report an Issue
        </button>
        <button className="alt-button" onClick={handleLogout}>
          Sign Out
        </button>     
      </>
  );
};

export default LogoutButton;
