import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [loginError, setLoginError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoginError(null);
      const response = await api.post<{ access_token: string; admin: { email: string } }>('/auth/login', data);
      login(response.data.access_token, response.data.admin.email);
      toast.success('Signed in');
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Invalid email or password';
      setLoginError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-center text-2xl font-bold text-gray-900">Admin Login</h2>
        <p className="mb-6 mt-1 text-center text-sm text-gray-500">Dünya Futbolu</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {loginError && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-xs font-medium text-red-600">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
