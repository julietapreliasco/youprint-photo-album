const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const fetchPhotoAlbums = async (token: string | null) => {
  if (token === null) {
    console.error('Token is null');
    return;
  }

  try {
    const response = await fetch('/api/photo-album/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch photo albums');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching photo albums:', error);
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
  const response = await fetch(`/api/photo-album/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photos }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
};

export const updatePhotoAlbumStatus = async (id: string) => {
  try {
    const token = getAuthToken();

    const response = await fetch(`/api/photo-album/status/${id}`, {
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
