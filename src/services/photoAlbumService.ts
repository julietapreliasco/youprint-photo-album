const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const fetchPhotoAlbumById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/photo-album/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    const data = await response.json();

    for (const photo of data.photos) {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = photo;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPhotoAlbums = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/photo-album`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/photo-album/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePhotoAlbum = async (id: string, photos: string[]) => {
  try {
    const response = await fetch(`${API_URL}/photo-album/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photos }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePhotoAlbumStatus = async (id: string) => {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/photo-album/status/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
