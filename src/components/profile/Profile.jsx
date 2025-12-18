import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { userDataContext } from '../contexts/UserProvider.jsx';

const Profile = ({ user }) => {

    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { setUserData } = userDataContext();

    const apiUrl = process.env.REACT_APP_AUDIENCE_API;

    useEffect(() => {
        const syncUser = async() => {
            console.log("user: ", user);
            if (!isLoading && isAuthenticated && user) {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: apiUrl
                    }
                });
                setUserData(accessToken)
            }
        }

        syncUser();
        
      }, [isLoading, isAuthenticated, user]);

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