import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/api';
import type { Video } from '../lib/types';

interface VideoFormValues {
  youtubeUrl: string;
  category: string;
}

export default function VideosPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<VideoFormValues>({
    defaultValues: { youtubeUrl: '', category: '' },
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
            <input
              {...register('category', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Xülasə"
            />
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
                  {video.views} views · {video.category}
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
                <button
                  onClick={() => deleteMutation.mutate(video.id)}
                  className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {!videosQuery.isLoading && !videosQuery.data?.length && (
          <p className="text-sm text-gray-400">No videos added yet.</p>
        )}
      </div>
    </div>
  );
}
