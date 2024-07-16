import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../config/db';
import PhotoAlbumModel from '../../../models/photoAlbum';
import { isValidObjectId } from 'mongoose';

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectDB();

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

    photoAlbum.isPending = !photoAlbum.isPending;
    photoAlbum.updatedAt = new Date();

    await photoAlbum.save();

    return NextResponse.json(photoAlbum, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
