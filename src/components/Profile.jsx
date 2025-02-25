import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = ({ user, setUserName }) => {

    const { isLoading, isAuthenticated} = useAuth0();

    useEffect(() => {
        console.log("user: ", user);
        if (!isLoading && isAuthenticated && user) {
          setUserName(user);
        }
      }, [isLoading, isAuthenticated, user]);

    return (
        isAuthenticated && (
            <div className="profile-info">
                {user?.picture && <img src={user.picture} alt={user?.name} className="profile-image"/>}
                <div className="profile-name-info">
                    <h2> {user?.name} </h2>
                    <h4> {user?.email} </h4>
                </div>
                {/*{JSON.stringify(user)}*/}
                
            </div>
        )
        
    )
}

export default Profile;