import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { ExtendedPhoto, PhotoAlbum } from '../types';
import {
  updatePhotoAlbum,
  getPhotoDimensions,
} from '../services/photoAlbumService';
import { enqueueSnackbar } from 'notistack';
import { useRequest } from './useRequestHook';

interface PhotoContextType {
  photos: ExtendedPhoto[];
  photoAlbums: PhotoAlbum[];
  setPhotoAlbums: React.Dispatch<React.SetStateAction<PhotoAlbum[]>>;
  setPhotos: React.Dispatch<React.SetStateAction<ExtendedPhoto[]>>;
  handlePhotoAlbum: (
    id: string,
    photoAlbum: string[],
    isUpdating: boolean,
    client: {
      name?: string;
      phone: string;
    },
    isAuthenticated?: boolean
  ) => void;
  deletePhoto: (photoId: string) => void;
}

export const PhotoContext = createContext<PhotoContextType | undefined>(
  undefined
);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<ExtendedPhoto[]>([]);
  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([]);
  const { setLoading } = useRequest();
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);

  const handlePhotoAlbum = useCallback(
    async (
      id: string,
      photoAlbum: string[],
      isUpdating: boolean,
      client: { name?: string; phone: string },
      isAuthenticated?: boolean
    ) => {
      try {
        if (isUpdating) {
          await updatePhotoAlbum(id, photoAlbum);
          enqueueSnackbar(
            'El orden de las fotos se ha guardado correctamente',
            { variant: 'success' }
          );
          if (!isAuthenticated) {
            window.location.href = `https://wa.me/59892892300`;
          }
        }

        const photosData: ExtendedPhoto[] = [];
        await Promise.all(
          photoAlbum.map(async (url, index) => {
            try {
              setLoading(true);
              const { width, height } = await getPhotoDimensions(url);
              photosData.push({
                src: url,
                width,
                height,
                id: url,
                isCover: index === 0,
                number: index,
                client: client,
              });
            } catch (error) {
              console.error(
                `Error al obtener dimensiones de la foto ${url}:`,
                error
              );
              photosData.push({
                src: url,
                width: 1,
                height: 1,
                id: url,
                isCover: index === 0,
                number: index,
                client: client,
              });
            }
          })
        );
        const sortedPhotosData = photosData.sort((a, b) => a.number - b.number);
        setPhotos(sortedPhotosData);
      } catch (error) {
        console.error('Error al actualizar el álbum de fotos:', error);
        isUpdating &&
          enqueueSnackbar(`Error al guardar el orden de las fotos: ${error}`, {
            variant: 'error',
          });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updatePhotoNumbers = useCallback(
    (photos: ExtendedPhoto[]): ExtendedPhoto[] => {
      return photos.map((photo, index) => ({
        ...photo,
        isCover: index === 0,
        number: index,
      }));
    },
    []
  );

  const deletePhoto = useCallback(
    (photoId: string) => {
      setPhotos((prevPhotos) => {
        const newPhotos = prevPhotos.filter((photo) => photo.id !== photoId);
        return updatePhotoNumbers(newPhotos);
      });
    },
    [updatePhotoNumbers]
  );

  useEffect(() => {
    if (photos.length > 0 && !isFirstImageLoaded) {
      const img = new Image();
      img.src = photos[0].src;
      img.onload = () => setIsFirstImageLoaded(true);
    }
  }, [photos, isFirstImageLoaded]);

  useEffect(() => {
    if (isFirstImageLoaded) {
      setLoading(false);
    }
  }, [isFirstImageLoaded, setLoading]);

  const value = useMemo(
    () => ({
      photos,
      setPhotos,
      handlePhotoAlbum,
      deletePhoto,
      photoAlbums,
      setPhotoAlbums,
    }),
    [photos, photoAlbums, handlePhotoAlbum, deletePhoto]
  );

  return (
    <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>
  );
};
