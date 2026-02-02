import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup.tsx';

import { Auth0Provider } from '@auth0/auth0-react';
import { LockedProvider } from './context/LockedContext/LockedProvider.tsx';
import { ItemsProvider } from './context/ItemContext/ItemProvider.tsx';
import { CartsProviderWithItems } from './context/CartContext/CartsProviderWithItems.tsx';
import { AlertProvider } from './context/AlertContext/AlertProvider.tsx';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Auth0Provider
            domain={AUTH0_DOMAIN}
            clientId={AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: chrome.identity.getRedirectURL(),
                audience: AUTH0_AUDIENCE, 
                scope: 'openid profile email',
            }}
            cacheLocation="memory"
            useRefreshTokens={false}
        >
            <LockedProvider>
                <AlertProvider>
                    <ItemsProvider>
                        <CartsProviderWithItems>
                            <Popup />
                        </CartsProviderWithItems>
                    </ItemsProvider>
                </AlertProvider>
            </LockedProvider>
        </Auth0Provider>
    </React.StrictMode>
)
