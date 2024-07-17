import cloudinary from '../../../../cloudinaryConfig';
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

    const optimizedPhotoUrls: string[] = [];

    for (const originalURL of photos) {
      const result = await cloudinary.uploader.upload(originalURL, {
        quality: 'auto',
        fetch_format: 'auto',
        format: 'webp',
        folder: 'photo-albums',
      });
      optimizedPhotoUrls.push(result.secure_url);
    }

    const newPhotoAlbum = new PhotoAlbumModel({
      photos: photos.map((originalURL: string, index: number) => ({
        originalURL,
        optimizedURL: optimizedPhotoUrls[index],
      })),
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
