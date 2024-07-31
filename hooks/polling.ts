import { useEffect, useState, useCallback } from 'react';
import { useRequest } from '../context/useRequestHook';
import { PhotoAlbum } from '../types';

const usePolling = (albumId: string) => {
  const [isOptimized, setIsOptimized] = useState<boolean | undefined>(false);
  const [albumData, setAlbumData] = useState<PhotoAlbum | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { setLoading } = useRequest();

  const retryProcessingImages = useCallback(async (albumId: string) => {
    try {
      const response = await fetch('/api/admin/retry-process-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ albumId }),
      });

      if (!response.ok) {
        throw new Error('Error reprocessing images');
      }
    } catch (error) {
      console.error('Error al reprocesar imágenes:', error);
    }
  }, []);

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
          setRetryCount((prev) => prev + 1);
        }

        if (retryCount > 3) {
          await retryProcessingImages(albumId);
          setRetryCount(0);
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
  }, [albumId, retryCount, setLoading, retryProcessingImages]);

  return { isOptimized, albumData };
};

export default usePolling;
