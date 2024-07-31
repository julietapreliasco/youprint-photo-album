import { useEffect, useRef, useState } from 'react';
import { useRequest } from '../context/useRequestHook';
import { PhotoAlbum } from '../types';

const MAX_ATTEMPTS = 4;

const usePolling = (albumId: string) => {
  const [isOptimized, setIsOptimized] = useState<boolean | undefined>(false);
  const [albumData, setAlbumData] = useState<PhotoAlbum | null>(null);
  const { setLoading } = useRequest();
  const attempts = useRef(0);

  const retryOptimization = async (albumId: string) => {
    try {
      const response = await fetch('/api/admin/retry-optimization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ albumId }),
      });
      if (!response.ok) {
        throw new Error('Error al reintentar la optimización');
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    if (!albumId) return;

    setLoading(true);

    const checkOptimization = async () => {
      try {
        const response = await fetch(`/api/photo-album/${albumId}`);
        const data = await response.json();

        if (data.isOptimized) {
          setIsOptimized(true);
          setAlbumData(data);
          setLoading(false);
          clearInterval(intervalId);
        } else {
          setIsOptimized(false);
          if (attempts.current >= MAX_ATTEMPTS) {
            clearInterval(intervalId);
            const retrySuccessful = await retryOptimization(albumId);
            if (!retrySuccessful) {
              console.error('Reintento de optimización fallido.');
            } else {
              setAlbumData(data);
            }
          } else {
            attempts.current += 1;
          }
        }
      } catch (error) {
        console.error('Error al verificar estado de optimización:');
      }
    };

    const intervalId = setInterval(checkOptimization, 5000);

    checkOptimization();

    return () => {
      clearInterval(intervalId);
      setLoading(false);
    };
  }, [albumId, setLoading]);

  return { isOptimized, albumData };
};

export default usePolling;
