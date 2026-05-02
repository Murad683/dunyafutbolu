import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploadField from '../components/common/ImageUploadField';
import api from '../lib/api';
import type { Transfer, TransferType } from '../lib/types';

interface TransferFormValues {
  playerName: string;
  fromClub: string;
  fromClubLogo?: string;
  toClub: string;
  toClubLogo?: string;
  fee: string;
  league: string;
  image: string;
  type: TransferType;
}

const transferTypes: TransferType[] = ['Daimi Transfer', 'İcarə', 'Mübadilə', 'Digər'];

export default function TransfersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);

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
      fromClubLogo: '',
      toClub: '',
      toClubLogo: '',
      fee: 'N/A',
      league: '',
      image: '',
      type: 'Daimi Transfer',
    },
  });

  const editForm = useForm<TransferFormValues>({
    defaultValues: {
      playerName: '',
      fromClub: '',
      fromClubLogo: '',
      toClub: '',
      toClubLogo: '',
      fee: 'N/A',
      league: '',
      image: '',
      type: 'Daimi Transfer',
    },
  });

  useEffect(() => {
    if (editingTransfer) {
      editForm.reset({
        playerName: editingTransfer.playerName,
        fromClub: editingTransfer.fromClub,
        fromClubLogo: editingTransfer.fromClubLogo || '',
        toClub: editingTransfer.toClub,
        toClubLogo: editingTransfer.toClubLogo || '',
        fee: editingTransfer.fee,
        league: editingTransfer.league,
        image: editingTransfer.image,
        type: editingTransfer.type as TransferType,
      });
    }
  }, [editingTransfer, editForm]);

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

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: TransferFormValues }) => api.patch(`/transfers/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer updated');
      setEditingTransfer(null);
    },
    onError: () => toast.error('Failed to update transfer'),
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

          <div className="grid gap-4 md:grid-cols-3">
            <ImageUploadField
              label="Player Image"
              value={watch('image')}
              onChange={(value) => setValue('image', value, { shouldValidate: true, shouldDirty: true })}
            />
            <ImageUploadField
              label="From Club Logo"
              value={watch('fromClubLogo') || ''}
              onChange={(value) => setValue('fromClubLogo', value, { shouldValidate: true, shouldDirty: true })}
            />
            <ImageUploadField
              label="To Club Logo"
              value={watch('toClubLogo') || ''}
              onChange={(value) => setValue('toClubLogo', value, { shouldValidate: true, shouldDirty: true })}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? 'Saving...' : 'Create Transfer'}
          </button>
        </form>
      )}

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
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
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setEditingTransfer(transfer)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(transfer.id)}
                      className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
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

      <Dialog.Root open={!!editingTransfer} onOpenChange={(open) => !open && setEditingTransfer(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-gray-950/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-gray-900">Edit Transfer</Dialog.Title>
              <Dialog.Close className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
                <X size={18} />
              </Dialog.Close>
            </div>
            <form onSubmit={editForm.handleSubmit((v) => updateMutation.mutate({ id: editingTransfer!.id, values: v }))} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Player Name</label>
                  <input
                    {...editForm.register('playerName', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">From Club</label>
                  <input
                    {...editForm.register('fromClub', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">To Club</label>
                  <input
                    {...editForm.register('toClub', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fee</label>
                  <input
                    {...editForm.register('fee', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">League</label>
                  <input
                    {...editForm.register('league', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Transfer Type</label>
                  <select
                    {...editForm.register('type', { required: true })}
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

              <div className="grid gap-4 md:grid-cols-3">
                <ImageUploadField
                  label="Player Image"
                  value={editForm.watch('image')}
                  onChange={(value) => editForm.setValue('image', value, { shouldValidate: true, shouldDirty: true })}
                />
                <ImageUploadField
                  label="From Club Logo"
                  value={editForm.watch('fromClubLogo') || ''}
                  onChange={(value) => editForm.setValue('fromClubLogo', value, { shouldValidate: true, shouldDirty: true })}
                />
                <ImageUploadField
                  label="To Club Logo"
                  value={editForm.watch('toClubLogo') || ''}
                  onChange={(value) => editForm.setValue('toClubLogo', value, { shouldValidate: true, shouldDirty: true })}
                />
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
