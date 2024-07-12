import { Gallery } from '../../components/Gallery';
import { useRouter } from 'next/router';

export default function GalleryPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return null;
  }

  return <Gallery id={id} />;
}
