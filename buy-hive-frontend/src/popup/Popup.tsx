import Header from "./modules/Header";
import Footer from "./modules/Footer";
import "../styles/main.css"
import AccountPage from "./pages/AccountPage";
import { useEffect, useRef, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import HomePage from "./pages/HomePage";
import AddCart from "./modals/AddCartModal";
import { useTokenResponder } from "../hooks/tokenResponder";
import { useCarts } from "./context/CartsProvider";
import AddItemModal from "./modals/AddItemModal";
import useCartActions from "@/hooks/useCartActions";

const Popup = () => {
  useTokenResponder();

  const [addItemVisible, setAddItemVisible] = useState(false);
  const [addItemAnimating, setAddItemAnimating] = useState(false);
  
  const [addCartVisible, setAddCartVisible] = useState(false);
  const [addCartAnimating, setAddCartAnimating] = useState(false);

  const [accountPageVisible, setAccountPageVisible] = useState(true);

  const [popupLoading, setPopupLoading] = useState(false);

  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

  const addItemButtoRef = useRef(null);
  const addCartButtonRef = useRef(null);

  useEffect(() => {
    const getUser = async() => {
      const { user } = await chrome.storage.session.get("user");
      if (!user) return;

      await getAccessTokenSilently({
          authorizationParams: {
              audience: AUTH0_AUDIENCE,
          }
      });

      console.log("user", user);
      setAccountPageVisible(false);
    }

    getUser();
  }, []);

  const { getCarts } = useCartActions({setPopupLoading});
  
  useEffect(() => {  
    getCarts();
  }, [isLoading, isAuthenticated]);

  return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex flex-1 justify-center py-14 px-4">
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
        </div>

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
