import { useEffect, useState } from 'react';
import { useRequest } from '../context/useRequestHook';
import { PhotoAlbum } from '../types';

const usePolling = (albumId: string) => {
  const [isOptimized, setIsOptimized] = useState<boolean | undefined>(false);
  const [albumData, setAlbumData] = useState<PhotoAlbum | null>(null);
  const { setLoading } = useRequest();

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
