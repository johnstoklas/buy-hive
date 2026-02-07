import { useEffect, useRef, useState } from "react";
import "../styles/main.css"

import useCartActions from "@/hooks/useCartActions";

import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";

import Header from "./components/modules/Header";
import Footer from "./components/modules/Footer";

import AddCart from "./components/modals/AddCartModal";
import AddItemModal from "./components/modals/AddItemModal";

import Alert from "./components/ui/alert";
import { useAuth } from "./context/AuthContext/useAuth";

const Popup = () => {
    const [addItemVisible, setAddItemVisible] = useState(false);
    const [addItemAnimating, setAddItemAnimating] = useState(false);
    
    const [addCartVisible, setAddCartVisible] = useState(false);
    const [addCartAnimating, setAddCartAnimating] = useState(false);

    const [accountPageVisible, setAccountPageVisible] = useState(true);

    const [popupLoading, setPopupLoading] = useState(false);

    const { getCarts } = useCartActions({setPopupLoading});
    const { isAuthenticated } = useAuth();

    const addItemButtoRef = useRef<HTMLButtonElement>(null);
    const addCartButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        setAccountPageVisible(false);
        getCarts();
    }, [isAuthenticated]);

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
