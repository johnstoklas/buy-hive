import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './components/Popup.jsx';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
          redirect_uri: `chrome-extension:${redirectUri}/popup.html`,
          scope: 'openid profile email offline_access',
        }}
        useRefreshTokens={true}
        cacheLocation='localstorage'
    >
      <Popup />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root') // Ensure this matches your 'popup.html'
);