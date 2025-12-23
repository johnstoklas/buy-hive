import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup.tsx';
import { Auth0Provider } from '@auth0/auth0-react';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `chrome-extension:${REDIRECT_URI}/popup.html`,
        scope: 'openid profile email offline_access',
      }}
      useRefreshTokens={true}
      cacheLocation='localstorage'
    >
      <Popup />
    </Auth0Provider>
  </React.StrictMode>,
)
