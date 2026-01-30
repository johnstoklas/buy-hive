import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {

    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

    useEffect(() => {
        const syncUser = async() => {
            if (isLoading || !isAuthenticated || !user) return;

            await getAccessTokenSilently({
                authorizationParams: {
                    audience: AUTH0_AUDIENCE,
                }
            });

            chrome.storage.session.set({
                user: {
                    sub: user.sub,
                    email: user.email,
                    name: user.name,
                    picture: user.picture
                }
            });
        }

        syncUser();
        
    }, [isLoading, isAuthenticated, user]);

    return (
        <div className="flex flex-row gap-2">
            {user?.picture && <img src={user.picture} alt="" className="rounded-full w-16 h-16"/>}
            <div className="flex flex-col">
                <h2 className='font-bold'> {user?.name} </h2>
                <h4> {user?.email} </h4>
            </div>                
        </div>
    )
}

export default Profile;