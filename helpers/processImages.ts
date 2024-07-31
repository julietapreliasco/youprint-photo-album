import connectDB from '../app/api/config/db';
import PhotoAlbumModel from '../app/api/models/photoAlbum';
import { PhotoAlbumPhotos } from '../types';
import cloudinary from '../cloudinaryConfig';
import axios from 'axios';

const getContentType = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    return response.headers['content-type'];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error fetching URL: ${url} - ${error.message} - ${error.response?.status} - ${error.response?.data}`
      );
    } else {
      console.error(`Unknown error fetching URL: ${url} - ${error}`);
    }
    return null;
  }
};

const uploadImage = async (url: string) => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      quality: 'auto',
      fetch_format: 'auto',
      format: 'webp',
      folder: 'photo-albums',
    });
    return result.secure_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error uploading image: ${url} - ${error.message} - ${error.response?.status} - ${error.response?.data}`
      );
    } else {
      console.error(`Unknown error uploading image: ${url} - ${error}`);
    }
    return null;
  }
};

const generateThumbnail = async (url: string) => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'video',
      eager: [{ format: 'webp', quality: 'auto' }],
      eager_async: false,
    });
    return result.eager[0].secure_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error generating thumbnail: ${url} - ${error.message} - ${error.response?.status} - ${error.response?.data}`
      );
    } else {
      console.error(`Unknown error generating thumbnail: ${url} - ${error}`);
    }
    return null;
  }
};

export async function processImages(albumId: string) {
  try {
    await connectDB();

    const album = await PhotoAlbumModel.findById(albumId);

    const uploadPromises = album.photos.map(async (photo: PhotoAlbumPhotos) => {
      const contentType = await getContentType(photo.originalURL);

      if (contentType?.startsWith('video/') && !photo.optimizedURL) {
        const thumbnailURL = await generateThumbnail(photo.originalURL);
        return {
          originalURL: photo.originalURL,
          optimizedURL: thumbnailURL,
          isVideo: true,
        };
      } else if (!photo.optimizedURL) {
        const optimizedURL = await uploadImage(photo.originalURL);
        return {
          originalURL: photo.originalURL,
          optimizedURL,
          isVideo: false,
        };
      } else {
        return photo;
      }
    });

    const optimizedPhotos = await Promise.all(uploadPromises);

    const missingOptimizedLink = optimizedPhotos.some(
      (photo) => photo.optimizedURL === null
    );

    await PhotoAlbumModel.findByIdAndUpdate(
      albumId,
      {
        $set: {
          photos: optimizedPhotos,
          isPending: true,
          updatedAt: new Date(),
          isOptimized: !missingOptimizedLink,
        },
      },
      { new: true }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error al procesar imágenes:',
        error.message,
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error('Error desconocido al procesar imágenes:', error);
    }
  }
}
