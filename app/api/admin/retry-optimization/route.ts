import { processImages } from '../../../../helpers/processImages';
import connectDB from '../../config/db';
import PhotoAlbumModel from '../../models/photoAlbum';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { albumId } = body;

    const album = await PhotoAlbumModel.findById(albumId);

    if (!albumId) {
      return NextResponse.json(
        { error: 'Album ID es requerido' },
        { status: 400 }
      );
    }

    if (!album) {
      return NextResponse.json(
        { error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    await processImages(album._id);

    return NextResponse.json(
      { message: 'Images reprocessed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
