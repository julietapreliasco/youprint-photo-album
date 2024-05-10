import * as React from "react";
import { Photo, PhotoAlbum } from "react-photo-album";
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
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import photoSet from "./data/photos";
import PhotoFrame from "./components/PhotoFrame";
import SortablePhotoFrame from "./components/SortablePhotoFrame";
import { SortablePhotoProps } from "./types";

export default function App() {
  const [photos, setPhotos] = React.useState(
    (photoSet as Photo[]).map((photo) => ({
      ...photo,
      id: photo.key || photo.src,
    })),
  );
  const renderedPhotos = React.useRef<{ [key: string]: SortablePhotoProps }>({});
  const [activeId, setActiveId] = React.useState<UniqueIdentifier>();
  const activeIndex = activeId ? photos.findIndex((photo) => photo.id === activeId) : undefined;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = React.useCallback(({ active }: DragStartEvent) => setActiveId(active.id), []);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(undefined);
  }, []);

  const renderPhoto = (props: SortablePhotoProps) => {
    renderedPhotos.current[props.photo.id] = props;
    return <SortablePhotoFrame activeIndex={activeIndex} {...props} />;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={photos}>
        <div style={{margin:"30px"}}>
          <PhotoAlbum
            photos={photos}
            layout="columns"
            columns={2}
            spacing={20}
            padding={10}
            renderPhoto={renderPhoto}
          />
        </div>
      </SortableContext>
      <DragOverlay>{activeId && <PhotoFrame overlay {...renderedPhotos.current[activeId]} />}</DragOverlay>
    </DndContext>
  );
}