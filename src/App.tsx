import { Photo, PhotoAlbum, RenderPhotoProps } from "react-photo-album";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import React from "react";
import mockedPhotos from "./data/photos";

// interface SortablePhoto extends Photo {
//   id: UniqueIdentifier;
// }

// type SortablePhotoProps = RenderPhotoProps<SortablePhoto>;

// const PhotoFrame = React.memo(
//   React.forwardRef<HTMLDivElement, PhotoFrameProps>(function PhotoFrame(props, ref) {
//     const { layoutOptions, imageProps, overlay, active, insertPosition, attributes, listeners } = props;
//     const { alt, style, ...restImageProps } = imageProps;

//     return (
//       <div
//         ref={ref}
//         style={{
//         width: overlay ? `calc(100% - ${2 * layoutOptions.padding}px)` : "100%",
//         padding: style.padding,
//         marginBottom: style.marginBottom,
//         }}
//         className={clsx("photo-frame", {
//           overlay: overlay,
//           active: active,
//           insertBefore: insertPosition === "before",
//           insertAfter: insertPosition === "after",
//         })}
//         {...attributes}
//         {...listeners}
//       >
//         <img
//           alt={alt}
//           style={{
//             ...style,
//             width: "100%",
//             padding: 0,
//             marginBottom: 0,
//             objectFit: "cover"
//           }}
//           {...restImageProps}
//         />
//       </div>
//     );
//   }),
// );


function App() {
  const [photos, setPhotos] = React.useState(
    (mockedPhotos as Photo[]).map((photo) => ({
      ...photo,
      id: photo.key || photo.src,
    })),
  );
  // const renderedPhotos = React.useRef<{ [key: string]: SortablePhotoProps }>({});
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

//   const renderPhoto = (props: SortablePhotoProps) => {
//     renderedPhotos.current[props.photo.id] = props;
//     return <SortablePhotoFrame activeIndex={activeIndex} {...props} />;
//   };

//   function SortablePhotoFrame(props: SortablePhotoProps & { activeIndex?: number }) {
//   const { photo, activeIndex } = props;
//   const { attributes, listeners, isDragging, index, over, setNodeRef } = useSortable({ id: photo.id });

//   return (
//     <PhotoFrame
//       ref={setNodeRef}
//       active={isDragging}
//       insertPosition={
//         activeIndex !== undefined && over?.id === photo.id && !isDragging
//           ? index > activeIndex
//             ? "after"
//             : "before"
//           : undefined
//       }
//       aria-label="sortable image"
//       attributes={attributes}
//       listeners={listeners}
//       {...props}
//     />
//   );
// }

  return (
    <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  >
    <SortableContext items={photos}>
      <div>
        <PhotoAlbum
          photos={photos}
          layout="columns"
          columns={2}
          spacing={20}
          padding={10}
        />
      </div>
    </SortableContext>
  </DndContext>
  )
}

export default App
