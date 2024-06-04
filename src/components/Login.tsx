import { useState } from 'react';
import { useAuth } from '../context/useAuthHook';
import { loginRequest } from '../services/authService';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginRequest(username, password);

      if (response) {
        if (response.token) {
          login(response.token);
          navigate('/');
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
    <form
      className="relative m-auto mt-10 flex w-fit flex-col items-center gap-3 rounded-xl border border-yp-blue p-10 text-xs font-semibold shadow-xl md:text-sm"
      onSubmit={handleLogin}
    >
      <div className="flex w-36 flex-col gap-2 sm:w-auto">
        <label>Usuario:</label>
        <input
          className="rounded-lg border border-yp-secondary-blue px-2 py-1"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex w-36 flex-col gap-2 sm:w-auto">
        <label>Contraseña:</label>
        <input
          className="rounded-lg border border-yp-secondary-blue px-2 py-1"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <span
        className={`text-center text-xs text-yp-red ${error ? 'block' : 'hidden'}`}
      >
        {error}
      </span>
      <div className="pt-4">
        <Button variant="PRIMARY" message="Login" type="submit" />
      </div>
    </form>
  );
};
