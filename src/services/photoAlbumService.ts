const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const fetchPhotoAlbumById = async (id: string) => {
  const response = await fetch(`${API_URL}/photo-album/${id}`);
  if (!response.ok) {
    throw new Error('Error fetching photo album');
  }
  const data = await response.json();
  return data;
};

export const getPhotoDimensions = async (url: string): Promise<{ width: number; height: number }> => {
  const img = new Image();
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};