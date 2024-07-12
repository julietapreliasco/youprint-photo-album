'use client';

import { useRequest } from '../../context/useRequestHook';

export const ErrorMsg = () => {
  const { error } = useRequest();

  if (!error.error) return null;

  return (
    <div className="z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-[#f15156] p-10 text-center">
        <span className="font-semibold">Error:</span>
        <span className="text-sm">{error.message}</span>
      </div>
    </div>
  );
};
