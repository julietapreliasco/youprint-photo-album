import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PhotoAlbum } from 'react-photo-album';
import { useWindowSize } from 'react-use';
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
import { PaginationLoader } from './ui/PaginationLoader';

interface GalleryProps {
  id: string;
}

export const Gallery: React.FC<GalleryProps> = ({ id }) => {
  const { width } = useWindowSize();
  const { photos, setPhotos, handlePhotoAlbum, isLoadingMorePhotos } =
    usePhotoContext();
  const { setError, error, setLoading } = useRequest();
  const { openModal } = useModal();
  const { isAuthenticated } = useAuth();
  const [photoAlbumStatus, setPhotoAlbumStatus] = useState<boolean | undefined>(
    undefined
  );

  const [client, setClient] = useState<{ name?: string; phone: string }>({
    name: '',
    phone: '',
  });

  const getRowConstraints = () => {
    if (width < 500) {
      return { minPhotos: 1, maxPhotos: 2 };
    } else if (width < 1200) {
      return { minPhotos: 1, maxPhotos: 3 };
    } else {
      return { minPhotos: 1, maxPhotos: 4 };
    }
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
      if (id) {
        try {
          setLoading(true);

          const response = await fetch(`/api/photo-album/${id}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
          const data = await response.json();

          setClient(data.client);
          setPhotoAlbumStatus(data.isPending);
          await handlePhotoAlbum(id, data.photos, false, data.client);
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
  }, [handlePhotoAlbum, id, setError, setLoading, setPhotos]);

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
          };
        });

        await handlePhotoAlbum(id, photoAlbum, true, client, isAuthenticated);
      },
      isAuthenticated ? '' : 'Al confirmar será redirigido a WhatsApp'
    );
  };

  const handleDownload = async () => {
    const zip = new JSZip();

    try {
      const fetchPromises = photos.map(async (photo, index) => {
        try {
          const response = await fetch(photo.originalURL);
          const blob = await response.blob();
          zip.file(
            `${index == photos.length - 1 ? 'Portada' : index + 1}.jpeg`,
            blob
          );
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      });

      await Promise.all(fetchPromises);

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${client.name ?? client.phone}_photo_album.zip`);
      });
    } catch (error) {
      console.error('Error generating zip:', error);
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
              <div className="pb-10">
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
                    <Button
                      onClick={handleDownload}
                      variant="SECONDARY"
                      message={'Descargar'}
                    />
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
              {!isLoadingMorePhotos && (
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
      {isLoadingMorePhotos && <PaginationLoader />}
    </DndContext>
  );
};
