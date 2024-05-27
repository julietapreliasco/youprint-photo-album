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
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
          <div className=" flex flex-col h-40 justify-around items-center bg-white p-6 rounded-lg shadow-lg">
            <p text-lg mb-4>{message}</p>
            <div className="modal-buttons">
            <button
                className="mr-2 px-4 py-2 bg-yp-blue font-bold text-white rounded hover:bg-yp-secondary-blue"
                onClick={onConfirm}
              >
                Confirmar
              </button>
              <button
                className="px-4 py-2 bg-gray-300 font-bold text-gray-700 rounded hover:bg-gray-400"
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