import { Photo, RenderPhotoProps } from 'react-photo-album';
import PhotoFrame from './PhotoFrame';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';

interface SortablePhoto extends Photo {
  id: UniqueIdentifier;
  isCover?: boolean;
}

type SortablePhotoProps = RenderPhotoProps<SortablePhoto>;

function SortablePhotoFrame(
  props: SortablePhotoProps & { activeIndex?: number },
) {
  const { photo, activeIndex } = props;
  const { attributes, listeners, isDragging, index, over, setNodeRef } =
    useSortable({ id: photo.id });

  return (
    <PhotoFrame
      ref={setNodeRef}
      active={isDragging}
      isCover={photo.isCover}
      insertPosition={
        activeIndex !== undefined && over?.id === photo.id && !isDragging
          ? index > activeIndex
            ? 'after'
            : 'before'
          : undefined
      }
      aria-label='sortable image'
      attributes={attributes}
      listeners={listeners}
      {...props}
    />
  );
}

export default SortablePhotoFrame;
