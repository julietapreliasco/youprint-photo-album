import connectDB from '../app/api/config/db';
import PhotoAlbumModel from '../app/api/models/photoAlbum';
import { PhotoAlbumPhotos } from '../types';
import cloudinary from '../cloudinaryConfig';

export async function processImages(albumId: string) {
  try {
    await connectDB();

    const album = await PhotoAlbumModel.findById(albumId);

    const uploadPromises = album.photos.map((photo: PhotoAlbumPhotos) =>
      cloudinary.uploader.upload(photo.originalURL, {
        quality: 'auto',
        fetch_format: 'auto',
        format: 'webp',
        folder: 'photo-albums',
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const optimizedPhotoUrls = uploadResults.map((result) => result.secure_url);

    await PhotoAlbumModel.findByIdAndUpdate(
      albumId,
      {
        $set: {
          photos: album.photos.map(
            (photo: PhotoAlbumPhotos, index: number) => ({
              originalURL: photo.originalURL,
              optimizedURL: optimizedPhotoUrls[index],
            })
          ),
          isPending: true,
          updatedAt: new Date(),
          isOptimized: true,
        },
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error al procesar imágenes:', error);
  }
}
