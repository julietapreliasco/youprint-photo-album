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

    const existingPhotos = photoAlbum.photos;
    const newPhotos = photos.filter(
      (photo: string) => !existingPhotos.includes(photo)
    );

    if (newPhotos.length === 0) {
      return NextResponse.json(
        { error: 'Todas las fotos ya existen en el álbum' },
        { status: 400 }
      );
    }

    photoAlbum.photos = Array.from(
      new Set([...photoAlbum.photos, ...newPhotos])
    );
    photoAlbum.updatedAt = new Date();

    await photoAlbum.save();

    return NextResponse.json(photoAlbum, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
