import { useRequest } from '../../context/useRequestHook';

export const ErrorMsg = () => {
  const { error } = useRequest();

  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-[#f15156] p-10">
        <span className="font-semibold">Error en el servidor:</span>
        <span className="text-sm">{error}</span>
      </div>
    </div>
  );
};
