import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploadField from '../components/common/ImageUploadField';
import api from '../lib/api';
import type { Banner, BannerPlacement } from '../lib/types';

interface BannerFormValues {
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: BannerPlacement;
  isActive: boolean;
}

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<BannerFormValues>({
    defaultValues: { title: '', imageUrl: '', linkUrl: '', placement: 'TOP_728X90', isActive: true },
  });

  const editForm = useForm<BannerFormValues>({
    defaultValues: { title: '', imageUrl: '', linkUrl: '', placement: 'TOP_728X90', isActive: true },
  });

  useEffect(() => {
    if (editingBanner) {
      editForm.reset({
        title: editingBanner.title,
        imageUrl: editingBanner.imageUrl,
        linkUrl: editingBanner.linkUrl,
        placement: editingBanner.placement,
        isActive: editingBanner.isActive,
      });
    }
  }, [editingBanner, editForm]);

  const bannersQuery = useQuery({
    queryKey: ['banners'],
    queryFn: async () => (await api.get<Banner[]>('/banners')).data,
  });

  const createMutation = useMutation({
    mutationFn: (values: BannerFormValues) => api.post('/banners', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner created');
      reset();
      setShowForm(false);
    },
    onError: () => toast.error('Failed to create banner'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: BannerFormValues }) => api.patch(`/banners/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner updated');
      setEditingBanner(null);
    },
    onError: () => toast.error('Failed to update banner'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner deleted');
    },
    onError: () => toast.error('Failed to delete banner'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Banners & Ads</h2>
          <p className="mt-1 text-sm text-gray-500">Manage promotional banners and advertisement placements.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((current) => !current);
            if (showForm) reset();
          }}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {showForm ? 'Cancel' : 'New Banner'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          className="space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register('title', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Link URL</label>
              <input
                {...register('linkUrl', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Placement</label>
              <select
                {...register('placement', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="TOP_728X90">Top Header (728x90)</option>
                <option value="SIDEBAR_300X350">Sidebar (300x350)</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" {...register('isActive')} />
                Active
              </label>
            </div>
          </div>

          <ImageUploadField
            label="Banner Image"
            value={watch('imageUrl')}
            onChange={(value) => setValue('imageUrl', value, { shouldValidate: true, shouldDirty: true })}
          />

          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? 'Saving...' : 'Create Banner'}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Banner</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Link</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Placement</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {bannersQuery.isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Loading banners...
                </td>
              </tr>
            )}
            {bannersQuery.data?.map((banner) => (
              <tr key={banner.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={banner.imageUrl} alt={banner.title} className="h-10 w-24 rounded object-cover" />
                    <span className="font-medium text-gray-900">{banner.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                    {banner.linkUrl}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-500">{banner.placement}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setEditingBanner(banner)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(banner.id)}
                      className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!bannersQuery.isLoading && !bannersQuery.data?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No banners created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog.Root open={!!editingBanner} onOpenChange={(open) => !open && setEditingBanner(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-gray-950/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-gray-900">Edit Banner</Dialog.Title>
              <Dialog.Close className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
                <X size={18} />
              </Dialog.Close>
            </div>
            <form onSubmit={editForm.handleSubmit((v) => updateMutation.mutate({ id: editingBanner!.id, values: v }))} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                  <input
                    {...editForm.register('title', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Link URL</label>
                  <input
                    {...editForm.register('linkUrl', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Placement</label>
                  <select
                    {...editForm.register('placement', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="TOP_728X90">Top Header (728x90)</option>
                    <option value="SIDEBAR_300X350">Sidebar (300x350)</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" {...editForm.register('isActive')} />
                    Active
                  </label>
                </div>
              </div>

              <ImageUploadField
                label="Banner Image"
                value={editForm.watch('imageUrl')}
                onChange={(value) => editForm.setValue('imageUrl', value, { shouldValidate: true, shouldDirty: true })}
              />

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
