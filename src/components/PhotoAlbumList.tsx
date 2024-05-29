import { useEffect, useState } from 'react';
import {
  deletePhotoAlbum,
  fetchPhotoAlbums,
} from '../services/photoAlbumService';
import { PhotoAlbum } from '../types';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/useModalHook';

export const PhotoAlbumList = () => {
  const [photos, setPhotos] = useState<PhotoAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { openModal } = useModal();

  useEffect(() => {
    const getPhotoAlbum = async () => {
      try {
        const data = await fetchPhotoAlbums();
        setPhotos(data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
        setIsLoading(false);
      }
    };
    getPhotoAlbum();
  }, []);
  console.log(error);
  console.log(isLoading);

  const handleDelete = (id: string) => {
    openModal(
      'Atención! Se va a borrar permanentemente la galería del cliente',
      async () => {
        try {
          await deletePhotoAlbum(id);
          setPhotos((prevPhotos) =>
            prevPhotos.filter((photo) => photo._id !== id)
          );
        } catch (error) {
          console.error('Error deleting photo album:', error);
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <h2 className="text-xl font-bold">Proyectos</h2>
      {photos.map((photo) => (
        <div
          key={photo._id}
          className="flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center text-sm hover:bg-slate-100 sm:w-3/4 sm:max-w-full sm:flex-row sm:justify-between sm:text-base lg:w-1/2"
        >
          <div className="flex flex-col sm:items-start">
            <span className="font-semibold">Cliente:</span>
            {photo.client.name && <span className="">{photo.client.name}</span>}
            <span className="">{photo.client.phone}</span>
          </div>
          <div className="flex gap-3 sm:self-end">
            <Button
              variant="PRIMARY"
              message="Galería"
              onClick={() => navigate(`/gallery/${photo._id}`)}
            />
            <Button
              message="Eliminar"
              onClick={() => handleDelete(photo._id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
