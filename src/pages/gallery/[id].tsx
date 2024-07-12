import { useEffect, useState } from 'react';
import { Gallery } from '../../components/Gallery';
import { useRouter } from 'next/router';
import { Loader } from '../../components/ui/Loader';
// import {
//   fetchPhotoAlbumById,
//   fetchPhotoAlbums,
// } from '../../services/photoAlbumService';
// import { PhotoAlbum } from '../../types';

export default function GalleryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [idLoaded, setIdLoaded] = useState<string | null>(null);
  console.log(id);

  useEffect(() => {
    if (typeof id == 'string') {
      setIdLoaded(id);
    }
  }, [id]);

  return idLoaded ? <Gallery id={idLoaded} /> : <Loader />;
}

// export async function getStaticPaths() {
//   try {
//     const photoAlbums = await fetchPhotoAlbums();
//     const paths = photoAlbums.map((album: PhotoAlbum) => ({
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

// interface Params {
//   id: string;
// }

// export async function getStaticProps({ params }: { params: Params }) {
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
