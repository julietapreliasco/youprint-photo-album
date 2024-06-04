import { useEffect } from 'react';
import {
  deletePhotoAlbum,
  fetchPhotoAlbums,
} from '../services/photoAlbumService';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/useModalHook';
import { useRequest } from '../context/useRequestHook';
// import { PhotoAlbum } from '../types';
import { usePhotoContext } from '../context/usePhotosHook';
import { enqueueSnackbar } from 'notistack';

export const PhotoAlbumList = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { setLoading, setError, error } = useRequest();
  const { photoAlbums, setPhotoAlbums } = usePhotoContext();

  useEffect(() => {
    const getPhotoAlbum = async () => {
      try {
        setLoading(true);
        const data = await fetchPhotoAlbums();
        setPhotoAlbums(data);
      } catch (error) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError({ error: true, message: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    if (photoAlbums.length === 0) {
      getPhotoAlbum();
    }
  }, [photoAlbums, setLoading, setError, setPhotoAlbums]);

  const handleDelete = (id: string) => {
    openModal(
      'Atención! Se va a borrar permanentemente la galería del cliente',
      async () => {
        try {
          await deletePhotoAlbum(id);
          setPhotoAlbums((prevPhotos) =>
            prevPhotos.filter((photo) => photo._id !== id)
          );
          enqueueSnackbar('Fotolibro borrado con éxito', {
            variant: 'success',
          });
        } catch (error) {
          console.error('Error deleting photo album:', error);
          enqueueSnackbar(`Error al borrar el Fotolibro: ${error}`, {
            variant: 'error',
          });
        }
      }
    );
  };

  if (error.error) return null;

  return (
    <div className="flex flex-col items-center gap-5">
      <h2 className="text-xl font-bold">Proyectos</h2>
      {photoAlbums.map((photoAlbum) => (
        <div
          key={photoAlbum._id}
          className="flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center text-sm hover:bg-slate-100 sm:w-3/4 sm:max-w-full sm:flex-row sm:justify-between sm:text-base lg:w-1/2"
        >
          <div className="flex flex-col sm:items-start">
            <span className="font-semibold">Cliente:</span>
            {photoAlbum.client.name && (
              <span className="">{photoAlbum.client.name}</span>
            )}
            <span className="">{photoAlbum.client.phone}</span>
          </div>
          <div className="flex gap-3 sm:self-end">
            <Button
              variant="PRIMARY"
              message="Galería"
              onClick={() => navigate(`/gallery/${photoAlbum._id}`)}
            />
            <Button
              message="Eliminar"
              onClick={() => handleDelete(photoAlbum._id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
