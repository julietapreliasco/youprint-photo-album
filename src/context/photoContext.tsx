import React, { createContext, useState, ReactNode } from 'react';
import { ExtendedPhoto } from '../types';
import {
  updatePhotoAlbum,
  getPhotoDimensions,
} from '../services/photoAlbumService';
import { enqueueSnackbar } from 'notistack';

interface PhotoContextType {
  photos: ExtendedPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<ExtendedPhoto[]>>;
  handlePhotoAlbum: (
    id: string,
    photoAlbum: string[],
    isUpdating: boolean,
    client: {
      name?: string;
      phone: string;
    }
  ) => Promise<void>;
  deletePhoto: (photoId: string) => void;
}

export const PhotoContext = createContext<PhotoContextType | undefined>(
  undefined
);

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<ExtendedPhoto[]>([]);

  const handlePhotoAlbum = async (
    id: string,
    photoAlbum: string[],
    isUpdating: boolean,
    client: {
      name?: string;
      phone: string;
    }
  ) => {
    try {
      if (isUpdating) {
        await updatePhotoAlbum(id, photoAlbum);
        enqueueSnackbar('El orden de las fotos se ha guardado correctamente', {
          variant: 'success',
        });
      }
      const photosData: ExtendedPhoto[] = await Promise.all(
        photoAlbum.map(async (url: string, index: number) => {
          const { width, height } = await getPhotoDimensions(url);
          return {
            src: url,
            width,
            height,
            srcSet: breakpoints.map((breakpoint) => {
              const newHeight = Math.round((height / width) * breakpoint);
              return {
                src: `${url}?w=${breakpoint}&h=${newHeight}`,
                width: breakpoint,
                height: newHeight,
              };
            }),
            id: url,
            isCover: index === 0,
            number: index,
            client: client,
          };
        })
      );
      setPhotos(photosData);
    } catch (error) {
      console.error('Error al actualizar el álbum de fotos:', error);
      isUpdating &&
        enqueueSnackbar(`Error al guardar el orden de las fotos: ${error}`, {
          variant: 'error',
        });
    }
  };

  const updatePhotoNumbers = (photos: ExtendedPhoto[]): ExtendedPhoto[] => {
    return photos.map((photo, index) => ({
      ...photo,
      isCover: index === 0,
      number: index,
    }));
  };

  const deletePhoto = (photoId: string) => {
    setPhotos((prevPhotos) => {
      const newPhotos = prevPhotos.filter((photo) => photo.id !== photoId);
      return updatePhotoNumbers(newPhotos);
    });
  };

  return (
    <PhotoContext.Provider
      value={{ photos, setPhotos, handlePhotoAlbum, deletePhoto }}
    >
      {children}
    </PhotoContext.Provider>
  );
};
