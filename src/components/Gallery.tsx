import { useCallback, useEffect, useRef, useState } from 'react';
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

import PhotoFrame from '../components/PhotoFrame';
import SortablePhotoFrame from '../components/SortablePhotoFrame';
import { ExtendedPhoto, SortablePhotoProps } from '../types';
import { FaRegHandPaper } from 'react-icons/fa';
import { Button } from './ui/Button';
import { useParams } from 'react-router-dom';
import {
  fetchPhotoAlbumById,
  getPhotoDimensions,
} from '../services/photoAlbumService';
import { useModal } from '../context/useModalHook';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useRequest } from '../context/useRequestHook';

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

export const Gallery = () => {
  const { id } = useParams<{ id: string }>();
  const { width } = useWindowSize();
  const [photos, setPhotos] = useState<ExtendedPhoto[]>([]);
  const { openModal } = useModal();
  const { setLoading, setError } = useRequest();

  const getRowConstraints = () => {
    if (width < 500) {
      return { minPhotos: 1, maxPhotos: 2 };
    } else {
      return { minPhotos: 2, maxPhotos: 3 };
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
          const data = await fetchPhotoAlbumById(id);
          const { client, photos: photoUrls } = data;
          const photosData: ExtendedPhoto[] = await Promise.all(
            photoUrls.map(async (url: string, index: number) => {
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
                client,
              };
            })
          );
          setPhotos(photosData);
          setLoading(false);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
          setLoading(false);
        }
      }
    };
    getPhotoAlbum();
  }, [id]);

  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const activeIndex = activeId
    ? photos.findIndex((photo) => photo.id === activeId)
    : undefined;

  const updateIsCover = (photos: ExtendedPhoto[]): ExtendedPhoto[] => {
    return photos.map((photo, index) => ({
      ...photo,
      isCover: index === 0,
      number: index,
    }));
  };

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => setActiveId(active.id),
    []
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
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
  }, []);

  const renderPhoto = (props: SortablePhotoProps) => {
    renderedPhotos.current[props.photo.id] = props;
    return <SortablePhotoFrame activeIndex={activeIndex} {...props} />;
  };

  const handleSave = () => {
    openModal('¿Desea guardar el orden de las fotos?', () => {
      console.log('Photo album order saved');
    });
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    photos.forEach((photo, index) => {
      fetch(photo.src)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(`${index + 1}.jpeg`, blob);
          if (index === photos.length - 1) {
            zip.generateAsync({ type: 'blob' }).then((content) => {
              saveAs(
                content,
                `${photo.client.name ?? photo.client.phone}_photo_album.zip`
              );
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
        });
    });
  };

  return (
    <>
      <div className="m-auto flex flex-row flex-wrap items-center justify-between gap-3 pb-10 md:w-[80%]">
        <div className="rounded-md text-center">
          <div className="flex flex-row items-start justify-start">
            <FaRegHandPaper className="mr-2 text-yp-blue md:text-xl" />
            <p className="text-left text-xs md:text-sm lg:text-base">
              Arrastrar y soltar las fotos para ordenarlas
            </p>
          </div>
        </div>
        <div className="flex gap-2 pl-6">
          <Button
            onClick={handleSave}
            variant="PRIMARY"
            message={'Guardar'}
          ></Button>
          <Button
            onClick={handleDownload}
            variant="SECONDARY"
            message={'Descargar'}
          ></Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={photos}>
          <div className="m-auto md:w-[80%]">
            <PhotoAlbum
              photos={photos}
              layout="rows"
              rowConstraints={getRowConstraints()}
              renderPhoto={renderPhoto}
              breakpoints={[500, 600, 1200]}
              spacing={15}
              padding={1}
            />
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && (
            <PhotoFrame overlay {...renderedPhotos.current[activeId]} />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};
