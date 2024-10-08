import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PhotoAlbum } from 'react-photo-album';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import PhotoFrame from './PhotoFrame';
import SortablePhotoFrame from './SortablePhotoFrame';
import { ExtendedPhoto, PhotoAlbumPhotos, SortablePhotoProps } from '../types';
import { Button } from './ui/Button';
import { useModal } from '../context/useModalHook';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useRequest } from '../context/useRequestHook';
import OnBoarding from './Onboarding';
import { usePhotoContext } from '../context/usePhotosHook';
import { useAuth } from '../context/useAuthHook';
import { FaExclamationCircle } from 'react-icons/fa';
import { ProgressLoader } from './ui/ProgressLoader';
import useFetchWithOptimizationCheck from '../hooks/useFetchWithOptimizationCheck';

interface GalleryProps {
  id: string;
}

export const Gallery: React.FC<GalleryProps> = ({ id }) => {
  const { photos, setPhotos, handlePhotoAlbum, isLoadingMorePhotos } =
    usePhotoContext();
  const { setError, error, setLoading } = useRequest();
  const { openModal } = useModal();
  const { isAuthenticated } = useAuth();
  const [photoAlbumStatus, setPhotoAlbumStatus] = useState<boolean | undefined>(
    undefined
  );
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [client, setClient] = useState<{ name?: string; phone: string }>({
    name: '',
    phone: '',
  });

  const { albumData, isOptimized } = useFetchWithOptimizationCheck(id);

  const getRowConstraints = () => {
    return { minPhotos: 1, maxPhotos: 2 };
  };

  const renderedPhotos = useRef<{ [key: string]: SortablePhotoProps }>({});

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const getPhotoAlbum = async () => {
      if (albumData) {
        try {
          setLoading(true);
          setClient(albumData.client);
          setPhotoAlbumStatus(albumData.isPending);
          handlePhotoAlbum(
            id,
            albumData.photos as PhotoAlbumPhotos[],
            false,
            albumData.client
          );
        } catch (error) {
          let errorMessage = 'An unknown error occurred';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          setError({ error: true, message: errorMessage });
          setLoading(false);
        }
      }
    };
    getPhotoAlbum();

    return () => {
      setPhotos([]);
    };
  }, [
    handlePhotoAlbum,
    id,
    setError,
    setLoading,
    setPhotos,
    isOptimized,
    albumData,
  ]);

  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    const photoFrames = document.querySelectorAll('.photo-frame');
    photoFrames.forEach((frame) => {
      frame.addEventListener('contextmenu', handleContextMenu);
    });

    return () => {
      photoFrames.forEach((frame) => {
        frame.removeEventListener('contextmenu', handleContextMenu);
      });
    };
  }, []);

  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const activeIndex = activeId
    ? photos.findIndex((photo) => photo.id === activeId)
    : undefined;

  const updateIsCover = (photos: ExtendedPhoto[]): ExtendedPhoto[] => {
    return photos.map((photo, index) => ({
      ...photo,
      isCover: index === photos.length - 1,
      number: index + 1,
    }));
  };

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => setActiveId(active.id),
    []
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setPhotos((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          const newItems = arrayMove(items, oldIndex, newIndex);
          return updateIsCover(newItems);
        });
      } else {
        setPhotos((items) => updateIsCover(items));
      }

      setActiveId(undefined);
    },
    [setPhotos]
  );

  const renderPhoto = (props: SortablePhotoProps) => {
    renderedPhotos.current[props.photo.id] = props;
    return (
      <SortablePhotoFrame
        key={props.photo.id}
        activeIndex={activeIndex}
        {...props}
        photoAlbumStatus={photoAlbumStatus}
        isVideo={props.photo.isVideo}
        isAuthenticated={isAuthenticated}
      />
    );
  };

  const handleSave = async (
    id: string,
    photoIds: string[],
    isAuthenticated: boolean
  ) => {
    openModal(
      '¿Desea guardar el orden de las fotos?',
      async () => {
        const photoAlbum: PhotoAlbumPhotos[] = photoIds.map((id) => {
          const photo = photos.find((photo) => photo.id === id);
          return {
            originalURL: photo?.originalURL || '',
            optimizedURL: photo?.src || '',
            isVideo: photo?.isVideo,
            id: photo?.id,
          };
        });

        await handlePhotoAlbum(id, photoAlbum, true, client, isAuthenticated);
      },
      isAuthenticated ? '' : 'Al confirmar será redirigido a WhatsApp'
    );
  };

  const fetchWithRetry = async (
    url: string,
    retries = 5
  ): Promise<Blob | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return await response.blob();
      } catch (error) {
        console.error(`Attempt ${attempt} failed to fetch ${url}:`, error);
        if (attempt === retries) return null;
      }
    }
    return null;
  };

  const handleDownload = async (
    photos: ExtendedPhoto[],
    client: { name?: string; phone: string }
  ) => {
    const zip = new JSZip();

    try {
      setIsDownloading(true);
      const fetchPromises = photos.map(async (photo, index) => {
        try {
          const blob = await fetchWithRetry(photo.originalURL);
          if (!blob)
            throw new Error(
              `Failed to fetch ${photo.originalURL} after ${5} attempts`
            );

          const contentType = blob.type;
          const extension = contentType.startsWith('video/') ? 'mp4' : 'jpeg';

          let fileName;
          switch (true) {
            case index === photos.length - 1:
              fileName = 'Portada';
              break;
            case index + 1 < 10:
              fileName = `00${index + 1}`;
              break;
            case index + 1 < 100:
              fileName = `0${index + 1}`;
              break;
            default:
              fileName = `${index + 1}`;
          }

          zip.file(`${fileName}.${extension}`, blob);
        } catch (error) {
          console.error('Error processing photo:', error);
        }
      });

      await Promise.all(fetchPromises);

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${client.name ?? client.phone}_photo_album.zip`);
    } catch (error) {
      console.error('Error generating zip:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (error.error) return null;

  const cover = photos.length ? [photos[photos.length - 1]] : [];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={photos}>
        {cover?.length !== 0 && (
          <>
            <div className="m-auto flex flex-wrap items-center justify-between gap-3 pb-10 md:w-[80%]">
              <div className="pb-5">
                <PhotoAlbum
                  photos={cover}
                  layout="rows"
                  rowConstraints={getRowConstraints()}
                  renderPhoto={renderPhoto}
                  breakpoints={[500, 600, 1200]}
                  spacing={15}
                />
              </div>
              {photoAlbumStatus ? (
                <>
                  <OnBoarding />
                  {isAuthenticated && (
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={() => handleDownload(photos, client)}
                        variant={isDownloading ? 'DISABLED' : 'SECONDARY'}
                        message={'Descargar'}
                        disabled={isDownloading}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex">
                  <FaExclamationCircle className="mr-2 text-lg text-yp-blue" />
                  <p className="text-sm">
                    El fotolibro se encuentra en estado finalizado.
                  </p>
                </div>
              )}
            </div>
            <div className="m-auto flex flex-col gap-4 md:w-[80%]">
              <PhotoAlbum
                photos={photos.slice(0, photos.length - 1)}
                layout="rows"
                rowConstraints={getRowConstraints()}
                renderPhoto={renderPhoto}
                breakpoints={[500, 600, 1200]}
                spacing={15}
                padding={1}
              />
              {!isLoadingMorePhotos && photoAlbumStatus && (
                <div className="mt-5 flex w-full flex-col items-end">
                  <div className="items-end">
                    <div className="flex items-end justify-end gap-2">
                      <Button
                        onClick={() => {
                          if (id) {
                            handleSave(
                              id,
                              photos.map((photo) => photo.id),
                              isAuthenticated
                            );
                          } else {
                            console.error('ID is undefined');
                          }
                        }}
                        variant="GALLERY"
                        message={'Guardar'}
                      />
                    </div>
                    {!isAuthenticated && (
                      <p className="mt-2 w-full text-center text-xs text-green-700">
                        Se continuará en Whatsapp
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SortableContext>
      <DragOverlay>
        {activeId && (
          <PhotoFrame overlay {...renderedPhotos.current[activeId]} />
        )}
      </DragOverlay>
      {isLoadingMorePhotos && <ProgressLoader />}
    </DndContext>
  );
};
