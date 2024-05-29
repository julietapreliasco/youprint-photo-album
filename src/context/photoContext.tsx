import React, { createContext, useState, ReactNode } from 'react';
import { ExtendedPhoto } from '../types';
import {
  updatePhotoAlbum,
  getPhotoDimensions,
} from '../services/photoAlbumService';

interface PhotoContextType {
  photos: ExtendedPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<ExtendedPhoto[]>>;
  handleUpdatePhotoAlbum: (id: string, photos: string[]) => Promise<void>;
  deletePhoto: (photoId: string) => void;
}

export const PhotoContext = createContext<PhotoContextType | undefined>(
  undefined
);

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<ExtendedPhoto[]>([]);

  const handleUpdatePhotoAlbum = async (id: string, photos: string[]) => {
    try {
      const updatedPhotos = await updatePhotoAlbum(id, photos);
      const photosData: ExtendedPhoto[] = await Promise.all(
        updatedPhotos.photos.map(async (url: string, index: number) => {
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
          };
        })
      );
      setPhotos(photosData);
    } catch (error) {
      console.error('Error al actualizar el álbum de fotos:', error);
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
      value={{ photos, setPhotos, handleUpdatePhotoAlbum, deletePhoto }}
    >
      {children}
    </PhotoContext.Provider>
  );
};
