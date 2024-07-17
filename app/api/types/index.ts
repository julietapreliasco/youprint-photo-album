export interface PhotoAlbum {
  photos: string[];
  client: {
    name?: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  isPending: boolean;
}
