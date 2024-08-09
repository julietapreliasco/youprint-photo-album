import { useEffect, useState } from 'react';
import { useRequest } from '../context/useRequestHook';
import { PhotoAlbum } from '../types';

const useFetchWithOptimizationCheck = (albumId: string) => {
  const [isOptimized, setIsOptimized] = useState<boolean | undefined>(false);
  const [albumData, setAlbumData] = useState<PhotoAlbum | null>(null);
  const { setLoading } = useRequest();

  const retryOptimization = async (albumId: string) => {
    try {
      const response = await fetch('/api/admin/retry-optimization', {
        method: 'PUT',
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

  const fetchAlbumData = async () => {
    try {
      const response = await fetch(`/api/photo-album/${albumId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del álbum');
      }
      const data = await response.json();
      setAlbumData(data);
      return data;
    } catch (error) {
      console.error('Error al obtener los datos del álbum:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!albumId) return;

    setLoading(true);

    const checkOptimization = async () => {
      try {
        const response = await fetch(`/api/photo-album/${albumId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del álbum');
        }
        const data = await response.json();

        if (data && data.isOptimized) {
          setIsOptimized(true);
          setLoading(false);
          setAlbumData(data);
        } else {
          setIsOptimized(false);
          const retrySuccessful = await retryOptimization(albumId);
          if (!retrySuccessful) {
            console.error('Reintento de optimización fallido.');
          } else {
            fetchAlbumData();
          }
        }
      } catch (error) {
        console.error('Error al verificar estado de optimización:', error);
      }
    };

    checkOptimization();

    return () => {
      setLoading(false);
    };
  }, [albumId, setLoading]);

  return { isOptimized, albumData };
};

export default useFetchWithOptimizationCheck;
