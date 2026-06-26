import { LoginForm } from '../features/auth/components/forms/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
      <LoginForm />
    </div>
  );
}