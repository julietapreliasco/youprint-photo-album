'use client';

import { useRequest } from '../../context/useRequestHook';
import { usePathname } from 'next/navigation';
import { ProgressLoader } from './ProgressLoader';
import { BeatLoader } from 'react-spinners';

export const Loader = () => {
  const { loading } = useRequest();
  const pathname = usePathname();
  const isGallery = pathname.startsWith('/gallery/');

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {isGallery ? <ProgressLoader /> : <BeatLoader color="#10abbb" />}
    </div>
  );
};
