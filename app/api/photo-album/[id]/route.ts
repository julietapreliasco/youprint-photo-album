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
  console.log('idParams', id);

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
