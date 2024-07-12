'use client';

import { useModal } from '../../context/useModalHook';

export const ConfirmationModal = () => {
  const { isOpen, message, secondaryMessage, onCancel, onConfirm } = useModal();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="mx-4 flex h-auto w-full max-w-sm flex-col rounded-lg bg-white p-6 shadow-lg sm:mx-auto">
            <p className="mb-4 text-center text-lg font-semibold">{message}</p>
            {secondaryMessage && (
              <p className="mb-4 text-center text-base">{secondaryMessage}</p>
            )}
            <div className="flex w-full justify-evenly">
              <button
                className="mr-2 rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 sm:text-base"
                onClick={onConfirm}
              >
                Confirmar
              </button>
              <button
                className="rounded bg-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-400 sm:text-base"
                onClick={onCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
