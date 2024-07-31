import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { ExtendedPhoto, PhotoAlbum, PhotoAlbumPhotos } from '../types';
import {
  updatePhotoAlbum,
  getPhotoDimensions,
} from '../services/photoAlbumService';
import { enqueueSnackbar } from 'notistack';
import { useRequest } from './useRequestHook';

interface PhotoContextType {
  photos: ExtendedPhoto[];
  photoAlbums: PhotoAlbum[];
  isLoadingMorePhotos: boolean;
  setLoadingMorePhotos: React.Dispatch<React.SetStateAction<boolean>>;
  setPhotoAlbums: React.Dispatch<React.SetStateAction<PhotoAlbum[]>>;
  setPhotos: React.Dispatch<React.SetStateAction<ExtendedPhoto[]>>;
  handlePhotoAlbum: (
    id: string,
    photoAlbum: PhotoAlbumPhotos[],
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
  const [isLoadingMorePhotos, setLoadingMorePhotos] = useState(false);
  const { setLoading } = useRequest();

  const handlePhotoAlbum = useCallback(
    async (
      id: string,
      photoAlbum: PhotoAlbumPhotos[],
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
            window.location.href = ` https://wa.me/59892892300?text=Listo`;
          }
        }

        if (!isUpdating) setLoading(true);
        const batchPhotosData = await Promise.all(
          photoAlbum.map(async (photo, index) => {
            if (!photo.optimizedURL) {
              console.error(
                `Foto con URL original ${photo.originalURL} no tiene optimizedURL`
              );
              return null;
            }
            try {
              const { width, height } = await getPhotoDimensions(
                photo.optimizedURL
              );
              return {
                src: photo.optimizedURL,
                originalURL: photo.originalURL,
                width,
                height,
                id: photo.optimizedURL,
                isCover: index === photoAlbum.length - 1,
                number: index + 1,
                client: client,
                isVideo: photo.isVideo,
              };
            } catch (error) {
              console.error(
                `Error al obtener dimensiones de la foto ${photo.optimizedURL}:`,
                error
              );
              return {
                src: photo.optimizedURL,
                originalURL: photo.originalURL,
                width: 1,
                height: 1,
                id: photo.optimizedURL,
                isCover: index === photoAlbum.length - 1,
                number: index,
                client: client,
                isVideo: photo.isVideo,
              };
            }
          })
        );

        const validBatchPhotosData = batchPhotosData.filter(
          (photo): photo is ExtendedPhoto => photo !== null
        );

        setPhotos(validBatchPhotosData);
      } catch (error) {
        console.error('Error al actualizar el álbum de fotos:', error);
        isUpdating &&
          enqueueSnackbar(`Error al guardar el orden de las fotos: ${error}`, {
            variant: 'error',
          });
      } finally {
        setLoading(false);
        setLoadingMorePhotos(false);
      }
    },
    []
  );

  const deletePhoto = useCallback((photoId: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.id !== photoId)
    );
  }, []);

  const value = useMemo(
    () => ({
      photos,
      setPhotos,
      handlePhotoAlbum,
      deletePhoto,
      photoAlbums,
      setPhotoAlbums,
      isLoadingMorePhotos,
      setLoadingMorePhotos,
    }),
    [
      photos,
      photoAlbums,
      handlePhotoAlbum,
      deletePhoto,
      isLoadingMorePhotos,
      setLoadingMorePhotos,
    ]
  );

  return (
    <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>
  );
};
