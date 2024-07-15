import { NextResponse } from 'next/server';
import PhotoAlbum from '../../models/photoAlbum';
import connectDB from '../../config/db';

export async function GET() {
  await connectDB();

  try {
    const photoAlbums = await PhotoAlbum.find();
    return NextResponse.json(photoAlbums, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
