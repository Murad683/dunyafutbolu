import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ImageUploadField from '../components/common/ImageUploadField';
import api from '../lib/api';
import type { Transfer, TransferType } from '../lib/types';

interface TransferFormValues {
  playerName: string;
  fromClub: string;
  toClub: string;
  fee: string;
  league: string;
  image: string;
  type: TransferType;
}

const transferTypes: TransferType[] = ['giriş', 'çıxış', 'icarə'];

export default function TransfersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<TransferFormValues>({
    defaultValues: {
      playerName: '',
      fromClub: '',
      toClub: '',
      fee: 'N/A',
      league: '',
      image: '',
      type: 'giriş',
    },
  });

  const transfersQuery = useQuery({
    queryKey: ['transfers'],
    queryFn: async () => (await api.get<Transfer[]>('/transfers')).data,
  });

  const createMutation = useMutation({
    mutationFn: (values: TransferFormValues) => api.post('/transfers', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer created');
      reset();
      setShowForm(false);
    },
    onError: () => toast.error('Failed to create transfer'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/transfers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer deleted');
    },
    onError: () => toast.error('Failed to delete transfer'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Transfers</h2>
          <p className="mt-1 text-sm text-gray-500">Track incoming, outgoing, and loan movement.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((current) => !current);
            if (showForm) reset();
          }}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {showForm ? 'Cancel' : 'New Transfer'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          className="space-y-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Player Name</label>
              <input
                {...register('playerName', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">From Club</label>
              <input
                {...register('fromClub', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">To Club</label>
              <input
                {...register('toClub', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fee</label>
              <input
                {...register('fee', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">League</label>
              <input
                {...register('league', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Transfer Type</label>
              <select
                {...register('type', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                {transferTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ImageUploadField
            label="Player Image"
            value={watch('image')}
            onChange={(value) => setValue('image', value, { shouldValidate: true, shouldDirty: true })}
          />

          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? 'Saving...' : 'Create Transfer'}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Player</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Move</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Fee</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">League</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {transfersQuery.isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Loading transfers...
                </td>
              </tr>
            )}
            {transfersQuery.data?.map((transfer) => (
              <tr key={transfer.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={transfer.image} alt={transfer.playerName} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium text-gray-900">{transfer.playerName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {transfer.fromClub} → {transfer.toClub}
                </td>
                <td className="px-4 py-3 text-gray-500">{transfer.fee}</td>
                <td className="px-4 py-3 text-gray-500">{transfer.league}</td>
                <td className="px-4 py-3 text-gray-500">{transfer.type}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteMutation.mutate(transfer.id)}
                    className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!transfersQuery.isLoading && !transfersQuery.data?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No transfers created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
