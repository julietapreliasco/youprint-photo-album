import { model, Schema } from "mongoose";
import { PhotoAlbum } from "../types";

const PhotoAlbumSchema = new Schema({
  photos: [
    {
      type: String,
      required: true,
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

export default model<PhotoAlbum>("PhotoAlbum", PhotoAlbumSchema);
