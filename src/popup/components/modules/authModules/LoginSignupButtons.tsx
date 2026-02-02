import { useAuth0 } from '@auth0/auth0-react';
import Button from '../../ui/button';

const LoginSignupButtons = () => {
    const { loginWithRedirect } = useAuth0();

    const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
    const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

    // function buildAuth0AuthorizeUrl() {
    //     const params = new URLSearchParams({
    //         client_id: AUTH0_CLIENT_ID,
    //         response_type: "token id_token",
    //         redirect_uri: chrome.identity.getRedirectURL(),
    //         scope: "openid profile email",
    //         audience: AUTH0_AUDIENCE,
    //         nonce: crypto.randomUUID(),
    //         prompt: "login",
    //     });

    //     return `https://${AUTH0_DOMAIN}/authorize?${params.toString()}`;
    // }


    // const handleLogin = () => {
    //     const authUrl = buildAuth0AuthorizeUrl();
    //     console.log(buildAuth0AuthorizeUrl());


    //     chrome.identity.launchWebAuthFlow(
    //         {
    //             url: authUrl,
    //             interactive: true,
    //         },
    //             (redirectUrl) => {
    //             if (chrome.runtime.lastError) {
    //                 console.error(chrome.runtime.lastError);
    //                 return;
    //         }
    //         console.log("Auth completed:", redirectUrl);
    //         }
    //     );
    // };

    const handleLogin = () => {
        chrome.tabs.create({
            url: "http://localhost:5173/login?source=extension"
        });
    };

    return (
        <div className="text-center flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground"> Welcome to BuyHive! </h1>
                <p className="text-md font-semibold leading-relaxed text-muted-foreground"> The all in one shopping cart. </p>
            </div>
            <div className="flex flex-col gap-2">
                <Button
                    onClick={handleLogin}
                    className="font-semibold"
                > Sign Up </Button>
                <Button
                    className='font-semibold'
                    onClick={handleLogin}
                > Sign In </Button>
            </div>
        </div>        
    )
}

export default LoginSignupButtons;