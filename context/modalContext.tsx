'use client';
import { ReactNode, createContext, useState } from 'react';

interface ModalContextProps {
  isOpen: boolean;
  message: string;
  secondaryMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
  openModal: (
    message: string,
    onConfirm: () => void,
    secondaryMessage?: string
  ) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [secondaryMessage, setSecondaryMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [onCancel, setOnCancel] = useState<() => void>(() => {});

  const openModal = (
    message: string,
    onConfirmFunction: () => void,
    secondaryMessage: string | undefined
  ) => {
    setMessage(message);
    if (secondaryMessage) {
      setSecondaryMessage(secondaryMessage);
    }
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
    <ModalContext.Provider
      value={{
        isOpen,
        message,
        secondaryMessage,
        onConfirm,
        onCancel,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
