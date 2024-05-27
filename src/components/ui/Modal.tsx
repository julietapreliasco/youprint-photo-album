interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col h-auto max-w-sm w-full mx-4 sm:mx-auto bg-white p-6 rounded-lg shadow-lg">
            <p className="text-sm sm:text-base mb-4 text-center">{message}</p>
            <div className="flex justify-evenly w-full">
              <button
                className="mr-2 px-4 py-2 bg-blue-500 text-sm sm:text-base font-bold text-white rounded hover:bg-blue-600"
                onClick={onConfirm}
              >
                Confirmar
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-sm sm:text-base font-bold text-gray-700 rounded hover:bg-gray-400"
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
}
