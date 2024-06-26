import { Photo, RenderPhotoProps } from 'react-photo-album';

export type PhotoFrameProps = SortablePhotoProps & {
  overlay?: boolean;
  active?: boolean;
  insertPosition?: 'before' | 'after';
  attributes?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  listeners?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  isCover?: boolean;
  number?: number;
  onLoad?: () => void;
  photoAlbumStatus?: boolean;
};

export type SortablePhotoProps = RenderPhotoProps<ExtendedPhoto> & {
  onLoad?: () => void;
};

export interface ExtendedPhoto extends Photo {
  id: string;
  isCover: boolean;
  number: number;
  client: { name?: string; phone: string };
}

export interface PhotoAlbum {
  _id: string;
  photos: string[];
  client: {
    name?: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  isPending: boolean;
}

export interface ErrorType {
  error: boolean;
  message: string;
}
