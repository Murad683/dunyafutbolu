import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/api';
import type { Category, LeagueType } from '../lib/types';

interface CategoryFormValues {
  slug: string;
  label: string;
  leagueType: LeagueType;
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: { slug: '', label: '', leagueType: 'world' },
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data,
  });

  const createMutation = useMutation({
    mutationFn: (values: CategoryFormValues) => api.post('/categories', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
      reset();
      setShowForm(false);
    },
    onError: () => toast.error('Failed to create category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const onSubmit = (values: CategoryFormValues) => createMutation.mutate(values);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
          <p className="mt-1 text-sm text-gray-500">Manage article groupings and league classification.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((current) => !current);
            if (showForm) reset();
          }}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {showForm ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input
              {...register('slug', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="premier-league"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Label</label>
            <input
              {...register('label', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Premier League"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">League Type</label>
            <select
              {...register('leagueType', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="local">Local</option>
              <option value="world">World</option>
              <option value="special">Special</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createMutation.isPending ? 'Saving...' : 'Create Category'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Label</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categoriesQuery.isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Loading categories...
                </td>
              </tr>
            )}
            {categoriesQuery.data?.map((category) => (
              <tr key={category.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3 font-medium text-gray-900">{category.label}</td>
                <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                <td className="px-4 py-3 text-gray-500">{category.leagueType}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteMutation.mutate(category.id)}
                    className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!categoriesQuery.isLoading && !categoriesQuery.data?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No categories created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
