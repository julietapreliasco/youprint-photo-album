interface LoginResponse {
  token?: string;
  error?: string;
}

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const loginRequest = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  return await response.json();
};
