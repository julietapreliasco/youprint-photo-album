import { useState } from 'react';
import { useAuth } from '../context/useAuthHook';
import { useRequest } from '../context/useRequestHook';
import { loginRequest } from '../services/authService';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setError } = useRequest();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginRequest(username, password);

      if (response) {
        if (response.token) {
          login(response?.token);
          window.location.href = '/';
        }

        if (response.error) {
          setError(response.error);
        }
      }
    } catch (error) {
      setError('Ocurrió un error al intentar iniciar sesión.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};
