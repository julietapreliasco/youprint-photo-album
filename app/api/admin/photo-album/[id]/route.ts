import cloudinary from '../../../../../cloudinaryConfig';
import { PhotoAlbumPhotos } from '../../../../../types';
import connectDB from '../../../config/db';
import PhotoAlbumModel from '../../../models/photoAlbum';
import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectDB();

    const body = await req.json();
    const { photos } = body;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Id inválida' }, { status: 400 });
    }

    const photoAlbum = await PhotoAlbumModel.findById(id);
    if (!photoAlbum) {
      return NextResponse.json(
        { error: 'Álbum de fotos no encontrado' },
        { status: 404 }
      );
    }

    const existingPhotoURLs = new Set(
      photoAlbum.photos.map((photo: PhotoAlbumPhotos) => photo.originalURL)
    );
    const newPhotos = photos.filter(
      (photo: string) => !existingPhotoURLs.has(photo)
    );

    if (newPhotos.length === 0) {
      return NextResponse.json(
        { error: 'Todas las fotos ya existen en el álbum' },
        { status: 400 }
      );
    }

    const uploadPromises = newPhotos.map((originalURL: string) =>
      cloudinary.uploader.upload(originalURL, {
        quality: 'auto: low',
        fetch_format: 'auto',
        format: 'webp',
        folder: 'photo-albums',
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const optimizedPhotoUrls = uploadResults.map((result, index) => ({
      originalURL: newPhotos[index],
      optimizedURL: result.secure_url,
    }));

    const updatedPhotos = [...photoAlbum.photos, ...optimizedPhotoUrls];

    const uniquePhotos = Array.from(
      new Set(updatedPhotos.map((photo) => JSON.stringify(photo)))
    ).map((photo) => JSON.parse(photo));

    photoAlbum.photos = uniquePhotos;
    photoAlbum.updatedAt = new Date();

    await photoAlbum.save();

    return NextResponse.json(photoAlbum, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
