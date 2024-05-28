import { ReactNode, createContext, useState } from "react";

interface ModalContextProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  openModal: (message: string, onConfirm: () => void) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);


export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [onCancel, setOnCancel] = useState<() => void>(() => {});

  const openModal = (message: string, onConfirmFunction: () => void) => {
    setMessage(message);
    setOnConfirm(() => () => {
      onConfirmFunction();
      closeModal();
    });
    setOnCancel(() => closeModal);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isOpen, message, onConfirm, onCancel, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};