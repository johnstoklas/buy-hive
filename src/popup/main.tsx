import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup.tsx';

import { LockedProvider } from './context/LockedContext/LockedProvider.tsx';
import { ItemsProvider } from './context/ItemContext/ItemProvider.tsx';
import { CartsProviderWithItems } from './context/CartContext/CartsProviderWithItems.tsx';
import { AlertProvider } from './context/AlertContext/AlertProvider.tsx';
import { AuthProvider } from './context/AuthContext/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <AuthProvider>
                <LockedProvider>
                    <AlertProvider>
                        <ItemsProvider>
                            <CartsProviderWithItems>
                                <Popup />
                            </CartsProviderWithItems>
                        </ItemsProvider>
                    </AlertProvider>
                </LockedProvider>
            </AuthProvider>
    </React.StrictMode>
)
