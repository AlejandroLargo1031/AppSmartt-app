import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ 
    resolver: zodResolver(schema) 
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        email: data.email,
        password: data.password
      });
      
      // Auto-login after successful registration
      const loginRes = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });
      
      login(loginRes.data.token, loginRes.data.user);
      navigate('/dashboard', { replace: true });
    } catch (e: unknown) {
      const error = e as { response?: { status?: number; data?: { message?: string } } };
      if (error?.response?.status === 400) {
        setServerError(error.response.data?.message || 'Error en el registro');
      } else {
        setServerError('Error inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="auth-card animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
          <p className="text-gray-600">Únete a nuestra plataforma</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              className={`input-field ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-error-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              {...register('password')}
              className={`input-field ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-error-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              {...register('confirmPassword')}
              className={`input-field ${errors.confirmPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-error-600 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
              {serverError}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
