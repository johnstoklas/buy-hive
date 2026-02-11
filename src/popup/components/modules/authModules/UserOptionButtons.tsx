import Button from '@/popup/components/ui/button';
import { useAuth } from '@/popup/context/AuthContext/useAuth';
import type { Dispatch, SetStateAction } from 'react';

interface UserOptioButtonsProps {
    setAccountPageVisible: Dispatch<SetStateAction<boolean>>,
}

const UserOptionButtons = ({setAccountPageVisible} : UserOptioButtonsProps) => {
    const { logout } = useAuth();

    // Logs a user out of their account
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex flex-col gap-2">
            <Button onClick={() => setAccountPageVisible(false)}> 
                View Items 
            </Button>
            <Button onClick={() => window.open(`${import.meta.env.VITE_WEBSITE}/support`, '_blank')}>
                Report an Issue
            </Button>
            <Button onClick={handleLogout}>
                Sign Out
            </Button>     
        </div>
    );
};

export default UserOptionButtons;
