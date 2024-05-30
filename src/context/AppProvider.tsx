import { ReactNode } from 'react';
import { ModalProvider } from './modalContext';
import { RequestProvider } from './requestContext';
import { PhotoProvider } from './photoContext';
import { SnackbarProvider } from 'notistack';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SnackbarProvider maxSnack={1}>
      <RequestProvider>
        <PhotoProvider>
          <ModalProvider>{children}</ModalProvider>
        </PhotoProvider>
      </RequestProvider>
    </SnackbarProvider>
  );
};

export default AppProvider;
