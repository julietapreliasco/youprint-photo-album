import { useEffect, useState } from 'react';
import {
  fetchPhotoAlbums,
  updatePhotoAlbumStatus,
} from '../services/photoAlbumService';
import { Button } from './ui/Button';
import { useModal } from '../context/useModalHook';
import { useRequest } from '../context/useRequestHook';
import { usePhotoContext } from '../context/usePhotosHook';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const PhotoAlbumList = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const { setLoading, setError, error } = useRequest();
  const { photoAlbums, setPhotoAlbums } = usePhotoContext();
  const [emptyList, setEmptyList] = useState(false);
  const token = getAuthToken();

  useEffect(() => {
    const getPhotoAlbum = async () => {
      try {
        setLoading(true);
        const response = await fetch('api/photo-album/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        });

        const data = await response.json();

        setPhotoAlbums(data);
        setEmptyList(data?.length === 0);
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
  }, [setLoading, setError, setPhotoAlbums, photoAlbums.length, token]);

  // const handleUpdateStatus = (id: string, isPending: boolean) => {
  //   openModal(
  //     `${isPending ? '¿Desea dar por finalizado el fotolibro?' : '¿Desea volver a habilitar la edición del fotolibro?'}`,
  //     async () => {
  //       try {
  //         await updatePhotoAlbumStatus(id);
  //         const data = await fetchPhotoAlbums();
  //         setPhotoAlbums(data);
  //         enqueueSnackbar(
  //           `${isPending ? 'Fotolibro finalizado con éxito' : 'Fotolibro habilitado con éxito'}`,
  //           {
  //             variant: 'success',
  //           }
  //         );
  //       } catch (error) {
  //         console.error('Error updating photo album:', error);
  //         enqueueSnackbar(`Error al actualizar el Fotolibro: ${error}`, {
  //           variant: 'error',
  //         });
  //       }
  //     }
  //   );
  // };

  if (error.error) return null;

  const sortedPhotoAlbums = [...photoAlbums].sort((a, b) => {
    return a.isPending === b.isPending ? 0 : a.isPending ? -1 : 1;
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <h2 className="text-2xl font-semibold">Fotolibros</h2>
      {emptyList && (
        <div className="p-10">
          <p className="rounded-xl border-2 border-yp-orange p-8 text-center text-sm">
            No hay ningún Fotolibro para gestionar actualmente
          </p>
        </div>
      )}
      {sortedPhotoAlbums?.map((photoAlbum) => (
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
              onClick={() => router.push(`/gallery/${photoAlbum._id}`)}
            />
            {photoAlbum.isPending ? (
              <Button
                message="Finalizar"
                onClick={() =>
                  handleUpdateStatus(photoAlbum._id, photoAlbum.isPending)
                }
              />
            ) : (
              <Button
                variant="DISABLED"
                message="Finalizado"
                onClick={() =>
                  handleUpdateStatus(photoAlbum._id, photoAlbum.isPending)
                }
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
