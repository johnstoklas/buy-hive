import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const {user, isAuthenticated} = useAuth0();

    useEffect(() => {
        if (user) {
            // Send the user data to background.js
            chrome.runtime.sendMessage({ action: "sendUserInfo", data: user }, (response) => {
                // You can handle the response from background.js here if needed
                console.log('Response from background.js:', response);
            });
        }
    }, [user]);

    return (
        isAuthenticated && (
            <div className="profile-info">
                {user?.picture && <img src={user.picture} alt={user?.name} className="profile-image"/>}
                <div className="profile-name-info">
                    <h2> {user?.name} </h2>
                    <h4> {user?.email} </h4>
                </div>
                {JSON.stringify(user)}
                
            </div>
        )
        
    )
}

export default Profile;