'use client';
import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
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
  isLoadingMorePhotos: boolean;
  setLoadingMorePhotos: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isLoadingMorePhotos, setLoadingMorePhotos] = useState(false);
  const { setLoading } = useRequest();

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
        const coverUrl = photoAlbum[0];
        setLoading(true);
        try {
          const { width, height } = await getPhotoDimensions(coverUrl);
          const coverPhoto: ExtendedPhoto = {
            src: coverUrl,
            width,
            height,
            id: coverUrl,
            isCover: true,
            number: 0,
            client: client,
          };
          setPhotos([coverPhoto]);
        } catch (error) {
          console.error(
            `Error al obtener dimensiones de la foto de portada ${coverUrl}:`,
            error
          );
          const defaultCoverPhoto: ExtendedPhoto = {
            src: coverUrl,
            width: 1,
            height: 1,
            id: coverUrl,
            isCover: true,
            number: 0,
            client: client,
          };
          setPhotos([defaultCoverPhoto]);
        } finally {
          setLoading(false);
        }

        const batchSize = 10;
        const remainingPhotos = photoAlbum.slice(1);
        let loadedPhotosCount = 0;
        setLoadingMorePhotos(true);

        while (loadedPhotosCount < remainingPhotos.length) {
          const batch = remainingPhotos.slice(
            loadedPhotosCount,
            loadedPhotosCount + batchSize
          );

          const batchPhotosData = await Promise.all(
            batch.map(async (url, index) => {
              try {
                const { width, height } = await getPhotoDimensions(url);
                return {
                  src: url,
                  width,
                  height,
                  id: url,
                  isCover: false,
                  number: loadedPhotosCount + index + 1,
                  client: client,
                };
              } catch (error) {
                console.error(
                  `Error al obtener dimensiones de la foto ${url}:`,
                  error
                );
                return {
                  src: url,
                  width: 1,
                  height: 1,
                  id: url,
                  isCover: false,
                  number: loadedPhotosCount + index + 1,
                  client: client,
                };
              }
            })
          );

          setPhotos((prevPhotos) => [...prevPhotos, ...batchPhotosData]);
          loadedPhotosCount += batchSize;
        }
      } catch (error) {
        console.error('Error al actualizar el álbum de fotos:', error);
        isUpdating &&
          enqueueSnackbar(`Error al guardar el orden de las fotos: ${error}`, {
            variant: 'error',
          });
      } finally {
        setLoadingMorePhotos(false);
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
