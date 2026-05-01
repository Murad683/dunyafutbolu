import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';
import type { Newsletter } from '../lib/types';

export default function NewsletterPage() {
  const queryClient = useQueryClient();

  const newsletterQuery = useQuery({
    queryKey: ['newsletter'],
    queryFn: async () => (await api.get<Newsletter[]>('/newsletter')).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/newsletter/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] });
      toast.success('Subscriber deleted');
    },
    onError: () => toast.error('Failed to delete subscriber'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Newsletter</h2>
          <p className="mt-1 text-sm text-gray-500">Manage email subscribers.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
          <Mail size={16} />
          <span>{newsletterQuery.data?.length || 0} Subscribers</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Email Address</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Subscribed At</th>
              <th className="px-6 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {newsletterQuery.isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">Loading subscribers...</td>
              </tr>
            ) : (
              newsletterQuery.data?.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(sub.subscribedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(sub.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      <Trash2 size={14} /> Unsubscribe
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!newsletterQuery.isLoading && !newsletterQuery.data?.length && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
