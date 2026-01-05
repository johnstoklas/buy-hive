import { useAuth0 } from '@auth0/auth0-react';
import Button from '../../ui/button';

const LoginSignupButtons = ({}) => {
    const { loginWithPopup } = useAuth0();

    const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

    const handleLogin = () => {
        console.log(AUTH0_AUDIENCE)
        loginWithPopup({
            authorizationParams: {
                audience: AUTH0_AUDIENCE,
                scope: "openid profile email offline_access",
                redirect_uri: `chrome-extension:${REDIRECT_URI}/popup.html`
            }
        })
    }

    return (
        <div className="text-center flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground"> Welcome to BuyHive! </h1>
                <p className="text-md font-semibold leading-relaxed text-muted-foreground"> The all in one shopping cart. </p>
            </div>

            {/* <button>
                Sign Up
            </button> */}

            {/* <button className="alt-button">
                Sign In
            </button> */}
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