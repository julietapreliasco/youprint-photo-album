'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader } from '../../../components/ui/Loader';
import { Gallery } from '../../../components/Gallery';

export default function GalleryPage() {
  const params = useParams();
  const { id } = params;
  const [idLoaded, setIdLoaded] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      setIdLoaded(id);
    }
  }, [id]);

  return idLoaded ? <Gallery id={idLoaded} /> : <Loader />;
}
