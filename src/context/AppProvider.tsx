import { ReactNode } from 'react';
import { ModalProvider } from './modalContext';
import { RequestProvider } from './requestContext';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RequestProvider>
      <ModalProvider>{children}</ModalProvider>
    </RequestProvider>
  );
};

export default AppProvider;
