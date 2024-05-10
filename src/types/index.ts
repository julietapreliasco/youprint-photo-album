import { UniqueIdentifier } from '@dnd-kit/core';
import { Photo, RenderPhotoProps } from 'react-photo-album';

export interface SortablePhoto extends Photo {
  id: UniqueIdentifier;
}

export type PhotoFrameProps = SortablePhotoProps & {
  overlay?: boolean;
  active?: boolean;
  insertPosition?: 'before' | 'after';
  attributes?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  listeners?: Partial<React.HTMLAttributes<HTMLDivElement>>;
};

export type SortablePhotoProps = RenderPhotoProps<SortablePhoto>;
