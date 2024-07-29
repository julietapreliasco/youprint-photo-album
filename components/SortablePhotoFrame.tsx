import PhotoFrame from './PhotoFrame';
import { useSortable } from '@dnd-kit/sortable';
import { SortablePhotoProps } from '../types';

function SortablePhotoFrame(
  props: SortablePhotoProps & {
    activeIndex?: number;
    photoAlbumStatus?: boolean;
    isVideo?: boolean;
  }
) {
  const { photo, activeIndex, photoAlbumStatus } = props;
  const { attributes, listeners, isDragging, index, over, setNodeRef } =
    useSortable({ id: photo.id });

  return (
    <PhotoFrame
      key={photo.id}
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
      photoAlbumStatus={photoAlbumStatus}
      isVideo={photo.isVideo}
      {...props}
    />
  );
}

export default SortablePhotoFrame;
