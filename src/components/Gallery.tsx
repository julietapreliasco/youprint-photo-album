import { useCallback, useRef, useState } from 'react';
import { Photo, PhotoAlbum } from 'react-photo-album';
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


import photoSet from '../data/photos';
import PhotoFrame from '../components/PhotoFrame';
import SortablePhotoFrame from '../components/SortablePhotoFrame';
import { ExtendedPhoto, SortablePhotoProps } from '../types';
import { FaRegHandPaper } from 'react-icons/fa';
import Button from './ui/Button';
import ConfirmationModal from './ui/Modal';

export default function Gallery() {
  const { width } = useWindowSize();
  const [photos, setPhotos] = useState(
    (photoSet as Photo[]).map((photo, index) => ({
      ...photo,
      id: photo.key || photo.src,
      isCover: index === 0,
      number: index,
    })),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRowConstraints = () => {
    if (width < 500) {
      return { minPhotos: 2, maxPhotos: 2 };
    } else {
      return { minPhotos: 2, maxPhotos: 3 };
    }
  };

  const renderedPhotos = useRef<{ [key: string]: SortablePhotoProps }>({});
  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const activeIndex = activeId
    ? photos.findIndex((photo) => photo.id === activeId)
    : undefined;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAction = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className='flex md:justify-center md:items-center flex-col sm:flex-row'>
        <div className='w-full md:w-4/5 pb-2 rounded-md text-center'>
          <div className='flex items-start mb-2 flex-row justify-start'>
            <FaRegHandPaper className='mr-2 text-yp-blue md:text-xl' />
            <p className='text-xs text-left md:text-base'>
              Arrastrar y soltar las fotos para ordenarlas
            </p>
          </div>
        </div>
        <div className='flex ml-5 gap-2'>
          <Button
            onClick={handleAction}
            variant='PRIMARY'
            message={'Confirmar orden'}
          ></Button>
          <Button
            onClick={() => console.log('hii')}
            variant='SECONDARY'
            message={'Descargar'}
          ></Button>
        </div>
      </div>
      {!photoSet ? (
        <div className='loader'>Loading...</div>
      ) : (
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
      )}
       <ConfirmationModal
          isOpen={isModalOpen}
          message='¿Desea confirmar el orden de las fotos?'
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
    </>
  );
}
