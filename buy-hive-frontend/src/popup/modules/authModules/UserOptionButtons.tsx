import Button from '@/popup/ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import type { Dispatch, SetStateAction } from 'react';

interface UserOptioButtonsProps {
  setAccountPageVisible: Dispatch<SetStateAction<boolean>>,
}
const UserOptionButtons = ({setAccountPageVisible} : UserOptioButtonsProps) => {
  const { isAuthenticated, logout } = useAuth0();
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  // Logs a user out of their account
  const handleLogout = async() => {
    console.log("logging out the user")
    await chrome.storage.session.clear();
    logout({
      logoutParams: {
        returnTo:  `chrome-extension:${REDIRECT_URI}/popup.html`,
      }
    });

    console.log('auth', isAuthenticated)
  };

  return (
      <div className="flex flex-col gap-2">
        <Button onClick={() => setAccountPageVisible(false)}> 
          View Items 
        </Button>
        <Button onClick={() => window.open('https://buyhive.dev/report', '_blank')}>
          Report an Issue
        </Button>
        <Button onClick={handleLogout}>
          Sign Out
        </Button>     
      </div>
  );
};

export default UserOptionButtons;
