import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ImagePlus, LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    try {
      const response = await api.post<{ url: string }>('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(response.data.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:flex-row md:items-center">
        <div className="flex-1 space-y-2">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder="https://example.com/image.jpg"
          />
          {value ? (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <img src={value} alt={label} className="h-40 w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ImagePlus size={16} />
                No image selected
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            {isUploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
            {isUploading ? 'Uploading...' : 'Upload file'}
          </label>
          <input id={inputId} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
}
