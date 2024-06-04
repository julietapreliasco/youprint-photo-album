import { Photo, RenderPhotoProps } from 'react-photo-album';

export type PhotoFrameProps = SortablePhotoProps & {
  overlay?: boolean;
  active?: boolean;
  insertPosition?: 'before' | 'after';
  attributes?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  listeners?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  isCover?: boolean;
  number?: number;
  onLoad?: (id: string) => void;
};

export type SortablePhotoProps = RenderPhotoProps<ExtendedPhoto>;

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
}

export interface ErrorType {
  error: boolean;
  message: string;
}
