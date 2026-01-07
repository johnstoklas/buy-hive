import { useEffect, useRef, useState } from "react";
import "../styles/main.css"

import { useAuth0 } from '@auth0/auth0-react';
import { useTokenResponder } from "../hooks/tokenResponder";
import useCartActions from "@/hooks/useCartActions";

import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";

import Header from "./modules/Header";
import Footer from "./modules/Footer";

import AddCart from "./modals/AddCartModal";
import AddItemModal from "./modals/AddItemModal";

import Alert from "./ui/alert";

const Popup = () => {
    useTokenResponder();

    const [addItemVisible, setAddItemVisible] = useState(false);
    const [addItemAnimating, setAddItemAnimating] = useState(false);
    
    const [addCartVisible, setAddCartVisible] = useState(false);
    const [addCartAnimating, setAddCartAnimating] = useState(false);

    const [accountPageVisible, setAccountPageVisible] = useState(true);

    const [popupLoading, setPopupLoading] = useState(false);

    const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { getCarts } = useCartActions({setPopupLoading});


    const addItemButtoRef = useRef<HTMLButtonElement>(null);
    const addCartButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const getUser = async() => {
        const { user } = await chrome.storage.session.get("user");
        if (!user) return;

        await getAccessTokenSilently({
            authorizationParams: {
                audience: AUTH0_AUDIENCE,
            }
        });

        setAccountPageVisible(false);
        }

        getUser();
    }, []);
    
    useEffect(() => {  
        getCarts();
    }, [isLoading, isAuthenticated]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <Alert />   
            <main className="relative flex flex-1 overflow-y-auto px-4">

                {!accountPageVisible && <HomePage 
                    popupLoading={popupLoading}
                    setPopupLoading={setPopupLoading}
                />}
                {accountPageVisible && <AccountPage
                    setAccountPageVisible={setAccountPageVisible}
                />}
                
                {(addItemVisible || addItemAnimating) && <AddItemModal
                    addItemVisible={addItemVisible}
                    setAddItemVisible={setAddItemVisible}
                    addItemButtonRef={addItemButtoRef}  
                    setAddItemAnimating={setAddItemAnimating}
                />}
                {(addCartVisible || addCartAnimating) && <AddCart 
                    addCartVisible={addCartVisible}
                    setAddCartVisibile={setAddCartVisible}
                    addCartButtonRef={addCartButtonRef}
                    setAddCartAnimating={setAddCartAnimating}
                />}
            </main>

            <Footer
                addItemVisible={addItemVisible}
                setAddItemVisible={setAddItemVisible}
                addItemButtonRef={addItemButtoRef}
                addCartVisible={addCartVisible}
                setAddCartVisible={setAddCartVisible}
                addCartButtonRef={addCartButtonRef}
                accountPageVisible={accountPageVisible}
                setAccountPageVisible={setAccountPageVisible}
            />
        </div>
    );
};

export default Popup;
