import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api/client';

const operationSchema = z.object({
  type: z.enum(['BUY', 'SELL']),
  amount: z.number().positive(),
  currency: z.string().min(3).max(8),
});

type OperationFormData = z.infer<typeof operationSchema>;

interface Operation {
  id: string;
  type: 'BUY' | 'SELL';
  amount: string;
  currency: string;
  createdAt: string;
}

export default function Dashboard() {
  const { state, logout } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OperationFormData>({
    resolver: zodResolver(operationSchema)
  });

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      const response = await api.get('/operations');
      setOperations(response.data);
    } catch (err) {
      console.error('Error fetching operations:', err);
    }
  };

  const onSubmit = async (data: OperationFormData) => {
    setMessage(null);
    setError(null);
    setIsLoading(true);
    try {
      await api.post('/operations', data);
      setMessage('Operación creada exitosamente');
      reset();
      fetchOperations(); 
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al crear operación');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">Hola, {state.user?.email}</span>
              <button 
                onClick={logout} 
                className="btn-danger px-4 py-2 text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nueva Operación</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Operación
                  </label>
                  <select 
                    id="type" 
                    {...register('type')} 
                    className={`input-field ${errors.type ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                  >
                    <option value="BUY">Compra</option>
                    <option value="SELL">Venta</option>
                  </select>
                  {errors.type && (
                    <p className="mt-2 text-sm text-error-600 font-medium">{errors.type.message}</p>
                  )}
                </div>

                {/* Monto */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Monto
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('amount', { valueAsNumber: true })}
                    className={`input-field ${errors.amount ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                  />
                  {errors.amount && (
                    <p className="mt-2 text-sm text-error-600 font-medium">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select
                    id="currency"
                    {...register('currency')}
                    className={`input-field ${errors.currency ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                  >
                    <option value="USD">USD - Dólar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="GBP">GBP - Libra Esterlina</option>
                    <option value="JPY">JPY - Yen Japonés</option>
                  </select>
                  {errors.currency && (
                    <p className="mt-2 text-sm text-error-600 font-medium">{errors.currency.message}</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creando...
                    </div>
                  ) : (
                    'Crear Operación'
                  )}
                </button>
              </form>

              {message && (
                <div className="mt-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                  {message}
                </div>
              )}
              {error && (
                <div className="mt-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Operaciones</h2>
              {operations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No hay operaciones registradas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {operations.map((operation) => (
                    <div 
                      key={operation.id} 
                      className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${
                        operation.type === 'BUY' 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          operation.type === 'BUY'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          {operation.type === 'BUY' ? 'Compra' : 'Venta'}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDate(operation.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          {formatAmount(operation.amount)} {operation.currency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
