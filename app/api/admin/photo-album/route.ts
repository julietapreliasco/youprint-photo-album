import connectDB from '../../config/db';
import PhotoAlbumModel from '../../models/photoAlbum';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { photos, client } = body;

    if (!photos || !client?.phone) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const newPhotoAlbum = new PhotoAlbumModel({
      photos,
      client,
      createdAt: new Date(),
      isPending: true,
    });

    await newPhotoAlbum.save();
    const url = `${process.env.APP}/gallery/${newPhotoAlbum._id}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
