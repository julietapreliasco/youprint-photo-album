'use client';
import React from 'react';
import { ReactNode } from 'react';
import { ModalProvider } from './modalContext';
import { RequestProvider } from './requestContext';
import { PhotoProvider } from './photoContext';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './AuthContext';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SnackbarProvider maxSnack={1}>
        <RequestProvider>
          <PhotoProvider>
            <ModalProvider>{children}</ModalProvider>
          </PhotoProvider>
        </RequestProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
};

export default AppProvider;
