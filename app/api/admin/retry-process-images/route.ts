import { processImages } from '../../../../helpers/processImages';
import connectDB from '../../config/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { albumId } = body;

    if (!albumId) {
      return NextResponse.json(
        { error: 'Album ID is required' },
        { status: 400 }
      );
    }

    await processImages(albumId);
    console.log('retry');
    return NextResponse.json(
      { message: 'Images reprocessed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
}
