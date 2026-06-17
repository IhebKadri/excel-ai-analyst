import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/authApi';
import { useAppStore } from '../../../store/appStore';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.login(email, password);
      const user = await authApi.me();
      setUser(user);
      navigate('/');
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [setUser, navigate]);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(email, password);
      const user = await authApi.me();
      setUser(user);
      navigate('/');
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [setUser, navigate]);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    navigate('/login');
  }, [setUser, navigate]);

  return { login, register, logout, isLoading, error };
}

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { error?: string } } }).response;
    return response?.data?.error ?? 'Something went wrong';
  }
  return 'Something went wrong';
}