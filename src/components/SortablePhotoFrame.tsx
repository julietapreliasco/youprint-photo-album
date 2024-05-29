import PhotoFrame from './PhotoFrame';
import { useSortable } from '@dnd-kit/sortable';
import { SortablePhotoProps } from '../types';

function SortablePhotoFrame(
  props: SortablePhotoProps & { activeIndex?: number }
) {
  const { photo, activeIndex } = props;
  const { attributes, listeners, isDragging, index, over, setNodeRef } =
    useSortable({ id: photo.id });

  return (
    <PhotoFrame
      ref={setNodeRef}
      active={isDragging}
      isCover={photo.isCover}
      number={photo.number}
      insertPosition={
        activeIndex !== undefined && over?.id === photo.id && !isDragging
          ? index > activeIndex
            ? 'after'
            : 'before'
          : undefined
      }
      aria-label="sortable image"
      attributes={attributes}
      listeners={listeners}
      {...props}
    />
  );
}

export default SortablePhotoFrame;
