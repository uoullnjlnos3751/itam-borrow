'use client';

import React, { ReactNode } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './msal-config';

export function AppMsalProvider({ children }: { children: ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}
