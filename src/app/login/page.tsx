'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type LoginData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const router = useRouter();

  const onSubmit = (data: LoginData) => {
    localStorage.setItem('user', JSON.stringify(data)); // Simulate login
    router.push('/dashboard');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) router.push('/dashboard');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <input
          {...register('email', { required: 'Email is required' })}
          placeholder="Email"
          type="email"
          className="input-field"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register('password', { required: 'Password is required' })}
          placeholder="Password"
          type="password"
          className="input-field"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button type="submit" className="btn-primary">Login</button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-500 underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
