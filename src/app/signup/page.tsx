'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type SignupData = {
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupData>();
  const router = useRouter();

  const onSubmit = (data: SignupData) => {
    localStorage.setItem('user', JSON.stringify(data)); // Simulate signup
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
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Name"
          className="input-field"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

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

        <button type="submit" className="btn-primary">Sign Up</button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 underline">Login</a>
        </p>
      </form>
    </div>
  );
}
