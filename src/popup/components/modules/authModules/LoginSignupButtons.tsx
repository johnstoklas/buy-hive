import Button from '../../ui/button';

const LoginSignupButtons = () => {
    const handleLogin = () => {
        chrome.tabs.create({
            url: `${import.meta.env.VITE_WEBSITE}/login?source=extension`
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