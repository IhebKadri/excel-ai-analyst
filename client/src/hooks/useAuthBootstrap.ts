import { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useAppStore } from '../store/appStore';

export function useAuthBootstrap() {
  const [isChecking, setIsChecking] = useState(true);
  const { setUser } = useAppStore();

  useEffect(() => {
    authApi.me()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsChecking(false));
  }, [setUser]);

  return { isChecking };
}