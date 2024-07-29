import { PhotoAlbumPhotos } from '../../../types';

export interface PhotoAlbum {
  photos: PhotoAlbumPhotos[];
  client: {
    name?: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  isPending: boolean;
}
