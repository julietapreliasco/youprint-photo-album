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
import Button from './ui/Button';
import { useParams } from 'react-router-dom';
import { fetchPhotoAlbumById, getPhotoDimensions } from '../services/photoAlbumService';
import { useModal } from '../context/useModalHook';

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

export default function Gallery() {
  const { id } = useParams<{ id: string }>();
  const { width } = useWindowSize();
  const [photos, setPhotos] = useState<ExtendedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { openModal } = useModal()

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
    }),
  );

  useEffect(() => {
    const getPhotoAlbum = async () => {
      if(id){
        try {
          const data = await fetchPhotoAlbumById(id);
          const photosData: ExtendedPhoto[] = await Promise.all(
            data.photos.map(async (url: string, index: number) => {
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
          setIsLoading(false);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
          setIsLoading(false);
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
    [],
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
    openModal('¿Desea guardar el orden de las fotos?', () => {console.log("Photo album order saved")})
  }

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }


  return (
    <>
      <div className='flex md:justify-center md:items-center pb-10 gap-3 flex-col md:flex-row'>
        <div className='w-full md:w-4/5 rounded-md text-center'>
          <div className='flex items-start flex-row justify-start'>
            <FaRegHandPaper className='mr-2 text-yp-blue md:text-xl' />
            <p className='text-xs text-left md:text-base'>
              Arrastrar y soltar las fotos para ordenarlas
            </p>
          </div>
        </div>
        <div className='flex gap-2 pl-6'>
          <Button
            onClick={handleSave}
            variant='PRIMARY'
            message={'Guardar'}
          ></Button>
          <Button
            onClick={() => console.log('hii')}
            variant='SECONDARY'
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
            <div className='md:w-[80%] m-auto'>
              <PhotoAlbum
                photos={photos}
                layout='rows'
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
}
