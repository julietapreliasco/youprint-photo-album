'use client';

import { useContext } from 'react';
import { PhotoContext } from './photoContext';

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};
