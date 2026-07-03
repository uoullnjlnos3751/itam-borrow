'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './msal-config';
import { PublicClientApplication } from '@azure/msal-browser';

export function AppMsalProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (msalInstance) {
      msalInstance.initialize()
        .then(() => msalInstance?.handleRedirectPromise())
        .then(() => {
          setIsInitialized(true);
        })
        .catch(e => {
          console.error("MSAL init error:", e);
          setIsInitialized(true); // Still set to true so app can render and show error if needed
        });
    }
  }, []);

  if (!msalInstance || !isInitialized) {
    return <>{children}</>; // Render without provider on server or during init
  }

  return (
    <MsalProvider instance={msalInstance as PublicClientApplication}>
      {children}
    </MsalProvider>
  );
}
