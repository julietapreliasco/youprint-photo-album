import mongoose, { model, Schema } from 'mongoose';
import { PhotoAlbum } from '../types';

const PhotoAlbumSchema = new Schema({
  photos: [
    {
      originalURL: {
        type: String,
        required: true,
      },
      optimizedURL: {
        type: String,
        required: false,
      },
    },
  ],
  client: {
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  isPending: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.models.PhotoAlbum ||
  model<PhotoAlbum>('PhotoAlbum', PhotoAlbumSchema);
