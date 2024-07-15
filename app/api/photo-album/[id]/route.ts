import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import PhotoAlbum from '../../models/photoAlbum';
import connectDB from '../../config/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { id } = params;

  try {
    if (id) {
      if (!isValidObjectId(id)) {
        return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
      }
      const photoAlbum = await PhotoAlbum.findById(id);
      if (!photoAlbum) {
        return NextResponse.json(
          { error: 'Álbum de fotos no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json(photoAlbum, { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectDB();
    const body = await req.json();
    const { photos } = body;

    if (!photos) {
      return NextResponse.json(
        { error: 'Error, debe especificar un nuevo orden de las fotos' },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Id inválida' }, { status: 400 });
    }

    const photoAlbum = await PhotoAlbum.findById(id);
    if (!photoAlbum) {
      return NextResponse.json(
        { error: 'Álbum de fotos no encontrado' },
        { status: 404 }
      );
    }

    photoAlbum.photos = photos;
    photoAlbum.updatedAt = new Date();

    await photoAlbum.save();

    return NextResponse.json(photoAlbum, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
