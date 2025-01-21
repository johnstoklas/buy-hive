import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const {user, isAuthenticated} = useAuth0();

    return (
        isAuthenticated && (
            <div className="profile-info">
                {user?.picture && <img src={user.picture} alt={user?.name} className="profile-image"/>}
                <div className="profile-name-info">
                    <h2> {user?.name} </h2>
                    <h4> {user?.email} </h4>
                </div>
                
            </div>
        )
        
    )
}

export default Profile;