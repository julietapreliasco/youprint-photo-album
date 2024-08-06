import cloudinary from '../cloudinaryConfig';
import axios from 'axios';

const MAX_RETRIES = 5;
export const FALLBACK_IMAGE_URL =
  'https://asset.cloudinary.com/dkzstcvny/69c575507342915a7c18044623b92aa9';

const getContentType = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    return response.headers['content-type'];
  } catch (error) {
    console.error(`Error fetching URL: ${url} - ${error}`);
    return null;
  }
};

const uploadImage = async (
  url: string,
  retries = MAX_RETRIES
): Promise<string | null> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(url, {
        quality: 20,
        fetch_format: 'auto',
        format: 'webp',
        folder: 'photo-albums',
      });
      return result.secure_url;
    } catch (error) {
      console.error(
        `Attempt ${attempt + 1} failed to upload image: ${url} - ${error}`
      );
    }
  }
  return null;
};

const generateThumbnail = async (
  url: string,
  retries = MAX_RETRIES
): Promise<string | null> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(url, {
        resource_type: 'video',
        eager: [{ format: 'webp', quality: 20 }],
        eager_async: false,
      });
      return result.eager[0].secure_url;
    } catch (error) {
      console.error(
        `Attempt ${attempt + 1} failed to generate thumbnail: ${url} - ${error}`
      );
    }
  }
  return null;
};

export const processImages = async (
  photos: { originalURL: string; optimizedUrl?: string | null }[]
) => {
  const processedPhotos = await Promise.all(
    photos.map(async (photo) => {
      let optimizedURL = photo?.optimizedUrl;
      let attempt = 0;

      const contentType = await getContentType(photo.originalURL);
      const isVideo = contentType?.startsWith('video/');

      while (
        (!optimizedURL ||
          optimizedURL === FALLBACK_IMAGE_URL ||
          optimizedURL === photo.originalURL) &&
        attempt < MAX_RETRIES
      ) {
        if (isVideo) {
          optimizedURL = await generateThumbnail(photo.originalURL);
        } else {
          optimizedURL = await uploadImage(photo.originalURL);
        }

        attempt += 1;
        if (!optimizedURL) {
          console.error(
            `Retrying to process image: ${photo.originalURL}, attempt: ${attempt}`
          );
        }
      }

      if (!optimizedURL) {
        optimizedURL = isVideo ? FALLBACK_IMAGE_URL : photo.originalURL;
        console.error(`Failed to optimize image: ${photo.originalURL}`);
      }

      return {
        originalURL: photo.originalURL,
        optimizedURL,
        isVideo,
      };
    })
  );

  return {
    processedPhotos,
    isOptimized: processedPhotos.every(
      (photo) => photo.optimizedURL !== photo.originalURL || FALLBACK_IMAGE_URL
    ),
  };
};
