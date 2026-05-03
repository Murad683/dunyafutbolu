import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, X, Play } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';
import type { Video, Category } from '../lib/types';

interface VideoFormValues {
  youtubeUrl: string;
  categoryId: string;
}

export default function VideosPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const { register, handleSubmit, reset } = useForm<VideoFormValues>({
    defaultValues: { youtubeUrl: '', categoryId: '' },
  });

  const editForm = useForm<VideoFormValues>({
    defaultValues: { youtubeUrl: '', categoryId: '' },
  });

  useEffect(() => {
    if (editingVideo) {
      editForm.reset({
        youtubeUrl: `https://www.youtube.com/watch?v=${editingVideo.youtubeId}`,
        categoryId: String(editingVideo.category.id),
      });
    }
  }, [editingVideo, editForm]);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data,
  });

  const videosQuery = useQuery({
    queryKey: ['videos'],
    queryFn: async () => (await api.get<Video[]>('/videos')).data,
  });

  const createMutation = useMutation({
    mutationFn: (values: VideoFormValues) => api.post('/videos', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video added. Metadata fetched from YouTube.');
      setShowForm(false);
      reset();
    },
    onError: (error: { response?: { data?: { message?: string | string[] } } }) => {
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Failed to add video');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: VideoFormValues }) => api.patch(`/videos/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video updated');
      setEditingVideo(null);
    },
    onError: (error: { response?: { data?: { message?: string | string[] } } }) => {
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Failed to update video');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video deleted');
    },
    onError: () => toast.error('Failed to delete video'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Videos</h2>
          <p className="mt-1 text-sm text-gray-500">YouTube items with auto-fetched metadata.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((current) => !current);
            if (showForm) reset();
          }}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {showForm ? 'Cancel' : 'Add Video'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          className="max-w-2xl space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">YouTube URL</label>
            <input
              {...register('youtubeUrl', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-400">Title, views, and thumbnail are pulled from YouTube.</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select
              {...register('categoryId', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">Select category</option>
              {(categoriesQuery.data || []).filter(c => c.type === 'video').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? 'Fetching...' : 'Add Video'}
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videosQuery.isLoading && <p className="text-sm text-gray-400">Loading videos...</p>}
        {videosQuery.data?.map((video) => (
          <div key={video.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <img src={video.thumbnailUrl} alt={video.title} className="aspect-video w-full object-cover" />
            <div className="space-y-3 p-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{video.title}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {video.views} views · {video.category?.label}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                >
                  Open on YouTube
                </a>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(video.id)}
                    className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!videosQuery.isLoading && !videosQuery.data?.length && (
          <p className="text-sm text-gray-400">No videos added yet.</p>
        )}
      </div>

      <Dialog.Root open={!!editingVideo} onOpenChange={(open) => !open && setEditingVideo(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-gray-950/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-gray-900">Edit Video</Dialog.Title>
              <Dialog.Close className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
                <X size={18} />
              </Dialog.Close>
            </div>
            <form onSubmit={editForm.handleSubmit((v) => updateMutation.mutate({ id: editingVideo!.id, values: v }))} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">YouTube URL</label>
                <input
                  {...editForm.register('youtubeUrl', { required: true })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <select
                  {...editForm.register('categoryId', { required: true })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="">Select category</option>
                  {(categoriesQuery.data || []).filter(c => c.type === 'video').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
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
                  {updateMutation.isPending ? 'Fetching...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
