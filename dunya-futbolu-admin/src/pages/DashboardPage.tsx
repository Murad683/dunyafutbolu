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
    queryFn: async () => (await api.get<Article[]>('/articles')).data,
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
    </div>
  );
}
