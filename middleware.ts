import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from './helpers/auth';
import validateRequest from './helpers/validateRequest';
import {
  createPhotoAlbumSchema,
  updatePhotoAlbumSchema,
} from './app/api/validations/photoAlbumSchema';

export const config = {
  matcher: [
    '/api/photo-album',
    '/api/photo-album/status/:path*',
    '/api/admin/photo-album',
    '/api/admin/photo-album/:path*',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  const authRoutes = ['/api/photo-album', '/api/photo-album/status'];

  const validationRoutes = [
    '/api/admin/photo-album',
    '/api/admin/photo-album/',
  ];

  //Autenticación
  if (authRoutes.some((route) => url.startsWith(route))) {
    const authResult = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid token',
        },
        { status: 401 }
      );
    }
  }

  //Validación
  if (validationRoutes.some((route) => url.startsWith(route))) {
    if (url === '/api/admin/photo-album') {
      return validateRequest(createPhotoAlbumSchema)(req);
    } else if (url.startsWith('/api/admin/photo-album/')) {
      return validateRequest(updatePhotoAlbumSchema)(req);
    }
  }

  return NextResponse.next();
}
