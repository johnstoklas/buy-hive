const Header = () => {
    return (
        <header className="flex justify-between w-full h-14 items-center px-4 text-xl fixed top-0 shadow-bottom z-50">
            <div className="flex items-center gap-2">
                <div className="w-[30px]">
                    <img className="w-full" src="/images/buyhive_gradient2_13percent.png"></img>
                </div>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">BuyHive</h1>

            </div>
            <button 
                onClick={() => window.close()}
                className='hover:cursor-pointer hover:text-[var(--accent-color)]'
            > &#10005; </button>
        </header>
    );
}

export default Header;
