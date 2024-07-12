'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader } from '../../../components/ui/Loader';
import { Gallery } from '../../../components/Gallery';
// import {
//   fetchPhotoAlbumById,
//   fetchPhotoAlbums,
// } from '../../../services/photoAlbumService';

export default function GalleryPage() {
  const params = useParams();
  const { id } = params;
  const [idLoaded, setIdLoaded] = useState<string | null>(null);
  console.log(id);

  useEffect(() => {
    if (typeof id === 'string') {
      console.log(id);
      setIdLoaded(id);
    }
  }, [id]);

  return idLoaded ? <Gallery id={idLoaded} /> : <Loader />;
}

// export async function generateStaticParams() {
//   try {
//     const photoAlbums = await fetchPhotoAlbums();
//     const paths = photoAlbums.map((album) => ({
//       params: { id: album._id.toString() },
//     }));
//     return {
//       paths,
//       fallback: false,
//     };
//   } catch (error) {
//     console.error('Error fetching photo albums:', error);
//     return {
//       paths: [],
//       fallback: false,
//     };
//   }
// }

// export async function getStaticProps({ params }) {
//   try {
//     const photoAlbum = await fetchPhotoAlbumById(params.id);
//     return {
//       props: {
//         photoAlbum,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching photo album by ID:', error);
//     return {
//       notFound: true,
//     };
//   }
// }
