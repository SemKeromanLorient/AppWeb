import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig';
//import 'bootstrap/dist/css/bootstrap.css';

import 'bootstrap/dist/css/bootstrap-grid.css';

const msalInstance = new PublicClientApplication(msalConfig);

const root = createRoot(document.getElementById('root'));

root.render(
    <MsalProvider instance={msalInstance}>
        <App />
    </MsalProvider>
);
