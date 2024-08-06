import cloudinary from '../cloudinaryConfig';
import axios from 'axios';

const getContentType = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    return response.headers['content-type'];
  } catch (error) {
    console.error(`Error fetching URL: ${url} - ${error}`);
    return null;
  }
};

const uploadImage = async (url: string): Promise<string | null> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      quality: 20,
      fetch_format: 'auto',
      format: 'webp',
      folder: 'photo-albums',
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload image: ${url} - ${error}`);
    return null;
  }
};

const generateThumbnail = async (url: string): Promise<string | null> => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'video',
      eager: [{ format: 'webp', quality: 20 }],
      eager_async: false,
    });
    return result.eager[0].secure_url;
  } catch (error) {
    console.error(`Failed to generate thumbnail: ${url} - ${error}`);
    return null;
  }
};

const processSingleImage = async (photo: { originalURL: string }) => {
  const contentType = await getContentType(photo.originalURL);
  const isVideo = contentType?.startsWith('video/');
  let optimizedURL = null;

  if (isVideo) {
    optimizedURL = await generateThumbnail(photo.originalURL);
  } else {
    optimizedURL = await uploadImage(photo.originalURL);
  }

  return {
    originalURL: photo.originalURL,
    optimizedURL,
    isVideo: isVideo,
  };
};

export const processImages = async (photos: { originalURL: string }[]) => {
  let isOptimized = true;

  const processedPhotos = await Promise.all(
    photos.map(async (photo) => {
      let result = await processSingleImage(photo);

      while (result.optimizedURL === null) {
        console.warn(`Retrying optimization for ${photo.originalURL}`);
        result = await processSingleImage(photo);
      }

      if (result.optimizedURL === null) {
        isOptimized = false;
      }

      return result;
    })
  );

  return {
    processedPhotos,
    isOptimized,
  };
};
