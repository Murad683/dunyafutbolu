import { useQuery } from '@tanstack/react-query';
import { ArrowLeftRight, FileText, Tag, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import api from '../lib/api';
import type { Article, Category, Transfer, Video as VideoItem } from '../lib/types';

interface StatCardProps {
  label: string;
  count: number | undefined;
  icon: LucideIcon;
  color: string;
}

function StatCard({ label, count, icon: Icon, color }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <div className={`rounded-lg p-3 text-white ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{count ?? '...'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const articles = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await api.get<{ data: Article[] } | Article[]>('/articles', { params: { limit: 100 } });
      return Array.isArray(res.data) ? res.data : res.data.data;
    },
  });
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data,
  });
  const transfers = useQuery({
    queryKey: ['transfers'],
    queryFn: async () => (await api.get<Transfer[]>('/transfers')).data,
  });
  const videos = useQuery({
    queryKey: ['videos'],
    queryFn: async () => (await api.get<VideoItem[]>('/videos')).data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Live counts from the NestJS API.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Articles" count={articles.data?.length} icon={FileText} color="bg-blue-500" />
        <StatCard label="Categories" count={categories.data?.length} icon={Tag} color="bg-violet-500" />
        <StatCard label="Transfers" count={transfers.data?.length} icon={ArrowLeftRight} color="bg-amber-500" />
        <StatCard label="Videos" count={videos.data?.length} icon={Video} color="bg-rose-500" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Top 5 Read Articles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Title</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : (
                (articles.data || [])
                  .sort((a, b) => Number(b.views) - Number(a.views))
                  .slice(0, 5)
                  .map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <img src={article.image} alt="" className="h-8 w-8 rounded object-cover" />
                          <span className="truncate max-w-[300px] block">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{article.category?.label || '-'}</td>
                      <td className="px-6 py-4 text-right font-medium text-brand">{article.views}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
