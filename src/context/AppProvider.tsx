import { ReactNode } from 'react';
import { ModalProvider } from './modalContext';
import { RequestProvider } from './requestContext';
import { PhotoProvider } from './photoContext';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RequestProvider>
      <PhotoProvider>
        <ModalProvider>{children}</ModalProvider>
      </PhotoProvider>
    </RequestProvider>
  );
};

export default AppProvider;
