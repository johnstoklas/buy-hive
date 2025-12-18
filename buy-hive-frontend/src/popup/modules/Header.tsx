const Header = () => {
    return (
        <header className="flex justify-between w-full h-[60px] items-center p-[10px] text-xl fixed top-0 shadow-bottom">
            <h1>🐝BuyHive</h1>
            <button 
                onClick={() => window.close()}
                className='hover:cursor-pointer'
            > &#10005; </button>
        </header>
    );
}

export default Header;
