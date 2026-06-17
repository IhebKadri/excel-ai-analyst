import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Log in</h1>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        No account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </form>
  );
}