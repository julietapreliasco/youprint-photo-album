const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const fetchPhotoAlbumById = async (id: string) => {
  const response = await fetch(`${API_URL}/photo-album/${id}`);
  if (!response.ok) {
    throw new Error('Error fetching photo album');
  }
  const data = await response.json();

  const imageLoadPromises = data.photos.map((photo: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = photo;
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
    });
  });

  await Promise.all(imageLoadPromises);

  return data;
};

export const fetchPhotoAlbums = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/photo-album`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error fetching photo albums');
  }
  const data = await response.json();
  return data;
};

export const getPhotoDimensions = async (
  url: string
): Promise<{ width: number; height: number }> => {
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

export const deletePhotoAlbum = async (id: string) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/photo-album/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error deleting photo album');
  }
  return await response.json();
};

export const updatePhotoAlbum = async (id: string, photos: string[]) => {
  const response = await fetch(`${API_URL}/photo-album/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photos }),
  });
  if (!response.ok) {
    throw new Error('Error updating photo album');
  }
  return await response.json();
};
