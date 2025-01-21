import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
    logout();
    window.location.replace('chrome-extension://hjghanbkkiojmhokpohlfgchmbjopdoc/popup.html');
    /*
    console.log(true);
    logout({
      logoutParams: {
        returnTo: 'chrome-extension://hjghanbkkiojmhokpohlfgchmbjopdoc/popup.html',
      },
    });
    window.location.replace('chrome-extension://hjghanbkkiojmhokpohlfgchmbjopdoc/popup.html');*/
  };

  return (
    isAuthenticated && (
      <button onClick={handleLogout}>
        Sign Out
      </button>
    )
  );
};

export default LogoutButton;
