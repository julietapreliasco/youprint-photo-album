import { Photo, RenderPhotoProps } from 'react-photo-album';

export type PhotoFrameProps = SortablePhotoProps & {
  overlay?: boolean;
  active?: boolean;
  insertPosition?: 'before' | 'after';
  attributes?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  listeners?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  isCover?: boolean;
  isVideo?: boolean;
  number?: number;
  isAuthenticated?: boolean;
  onLoad?: () => void;
  photoAlbumStatus?: boolean;
  id?: string;
};

export type SortablePhotoProps = RenderPhotoProps<ExtendedPhoto> & {
  onLoad?: () => void;
};

export interface ExtendedPhoto extends Photo {
  originalURL: string;
  optimizedURL?: string;
  id: string;
  isCover: boolean;
  isVideo: boolean;
  number: number;
  client: { name?: string; phone: string };
}

export interface PhotoAlbumPhotos {
  id?: string;
  _id?: string;
  originalURL: string;
  optimizedURL: string;
  isVideo?: boolean;
}

export interface PhotoAlbum {
  _id: string;
  photos: PhotoAlbumPhotos[] | string[];
  client: {
    name?: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  isPending: boolean;
  isOptimized?: boolean;
}

export interface ErrorType {
  error: boolean;
  message: string;
}
