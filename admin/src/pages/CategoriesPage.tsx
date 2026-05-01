import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';
import type { Category } from '../lib/types';

// The two hardcoded root categories that act as pillars
const PARENT_OPTIONS = [
  { slug: 'olke-futbolu', label: 'Ölkə futbolu' },
  { slug: 'dunya-futbolu', label: 'Dünya futbolu' },
] as const;

interface CategoryFormValues {
  slug: string;
  label: string;
  parentSlug: string;
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: { slug: '', label: '', parentSlug: PARENT_OPTIONS[0].slug },
  });

  const editForm = useForm<CategoryFormValues>({
    defaultValues: { slug: '', label: '', parentSlug: PARENT_OPTIONS[0].slug },
  });

  useEffect(() => {
    if (editingCategory) {
      editForm.reset({
        slug: editingCategory.slug,
        label: editingCategory.label,
        parentSlug: editingCategory.parent?.slug || PARENT_OPTIONS[0].slug,
      });
    }
  }, [editingCategory, editForm]);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data,
  });

  const resolveParentId = (parentSlug: string): number | undefined => {
    const found = categoriesQuery.data?.find(c => c.slug === parentSlug);
    return found?.id;
  };

  const createMutation = useMutation({
    mutationFn: (values: CategoryFormValues) => {
      const { parentSlug, ...rest } = values;
      const parentId = resolveParentId(parentSlug);
      return api.post('/categories', { ...rest, parentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
      reset();
      setShowForm(false);
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: CategoryFormValues }) => {
      const { parentSlug, ...rest } = values;
      const parentId = resolveParentId(parentSlug);
      return api.patch(`/categories/${id}`, { ...rest, parentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
      setEditingCategory(null);
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
    },
    onError: () => toast.error('Failed to delete category'),
  });

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
        <form onSubmit={handleSubmit((v) => createMutation.mutate(v))} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-3">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Parent Category</label>
            <select
              {...register('parentSlug', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {PARENT_OPTIONS.map(opt => (
                <option key={opt.slug} value={opt.slug}>{opt.label}</option>
              ))}
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
              <th className="px-4 py-3 text-left font-medium text-gray-600">Parent</th>
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
                <td className="px-4 py-3 text-gray-500">{category.parent?.label || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(category.id)}
                      className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
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

      <Dialog.Root open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-gray-950/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-gray-900">Edit Category</Dialog.Title>
              <Dialog.Close className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
                <X size={18} />
              </Dialog.Close>
            </div>
            <form onSubmit={editForm.handleSubmit((v) => updateMutation.mutate({ id: editingCategory!.id, values: v }))} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
                <input
                  {...editForm.register('slug', { required: true })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Label</label>
                <input
                  {...editForm.register('label', { required: true })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Parent Category</label>
                <select
                  {...editForm.register('parentSlug', { required: true })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {PARENT_OPTIONS.map(opt => (
                    <option key={opt.slug} value={opt.slug}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <Dialog.Close className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                  Cancel
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
