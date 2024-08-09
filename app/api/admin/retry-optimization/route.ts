import {
  FALLBACK_IMAGE_URL,
  processImages,
} from '../../../../helpers/processImages';
import { PhotoAlbumPhotos } from '../../../../types';
import connectDB from '../../config/db';
import PhotoAlbumModel from '../../models/photoAlbum';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { albumId } = body;

    if (!albumId) {
      return NextResponse.json(
        { error: 'Album ID es requerido' },
        { status: 400 }
      );
    }

    const album = await PhotoAlbumModel.findById(albumId);

    if (!album) {
      return NextResponse.json(
        { error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    const photosToReprocess = album.photos.filter(
      (photo: PhotoAlbumPhotos) =>
        !photo.optimizedURL ||
        photo.optimizedURL === photo.originalURL ||
        photo.optimizedURL === FALLBACK_IMAGE_URL
    );

    const { processedPhotos, isOptimized } =
      await processImages(photosToReprocess);

    const updatedPhotos = album.photos.map((photo: PhotoAlbumPhotos) => {
      const reprocessedPhoto = processedPhotos.find(
        (rp) => rp.originalURL === photo.originalURL
      );
      if (reprocessedPhoto) {
        return reprocessedPhoto;
      }
      return photo;
    });

    await PhotoAlbumModel.findByIdAndUpdate(
      albumId,
      {
        photos: updatedPhotos,
        isOptimized: isOptimized,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json(
      { message: 'Images reprocessed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during reprocessing:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
