import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import { toast } from 'sonner';
import 'react-quill/dist/quill.snow.css';
import ImageUploadField from '../components/common/ImageUploadField';
import api, { getImageUrl } from '../lib/api';
import type { Article, Category } from '../lib/types';

interface ArticleFormValues {
  title: string;
  slug: string;
  categoryId: string;
  image: string;
  excerpt: string;
  isFeatured: boolean;
}

const defaultArticleValues: ArticleFormValues = {
  title: '',
  slug: '',
  categoryId: '',
  image: '',
  excerpt: '',
  isFeatured: false,
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

function paragraphsToHtml(paragraphs: string[]) {
  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
}

function htmlToParagraphs(html: string) {
  if (!html.trim()) return [];

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nodes = Array.from(doc.body.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote'));
  const values = nodes.map((node) => node.textContent?.trim() || '').filter(Boolean);

  if (values.length > 0) {
    return values;
  }

  const fallback = doc.body.textContent?.trim();
  return fallback ? [fallback] : [];
}

export default function ArticlesPage() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createBody, setCreateBody] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editBody, setEditBody] = useState('');

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data,
  });
  const articlesQuery = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await api.get<{ data: Article[] } | Article[]>('/articles', { params: { limit: 100 } });
      // Handle both paginated and flat responses
      return Array.isArray(res.data) ? res.data : res.data.data;
    },
  });

  const createForm = useForm<ArticleFormValues>({ defaultValues: defaultArticleValues });
  const editForm = useForm<ArticleFormValues>({ defaultValues: defaultArticleValues });

  useEffect(() => {
    if (!editingArticle) return;

    editForm.reset({
      title: editingArticle.title,
      slug: editingArticle.slug,
      categoryId: String(editingArticle.category.id),
      image: editingArticle.image,
      excerpt: editingArticle.excerpt,
      isFeatured: editingArticle.isFeatured,
    });
    setEditBody(paragraphsToHtml(editingArticle.body));
  }, [editForm, editingArticle]);

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post('/articles', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article created');
      setShowCreateForm(false);
      createForm.reset(defaultArticleValues);
      setCreateBody('');
    },
    onError: () => toast.error('Failed to create article'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => api.patch(`/articles/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article updated');
      setEditingArticle(null);
      setEditBody('');
    },
    onError: () => toast.error('Failed to update article'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success('Article deleted');
    },
    onError: () => toast.error('Failed to delete article'),
  });

  const submitCreate = (values: ArticleFormValues) => {
    const body = htmlToParagraphs(createBody);
    createMutation.mutate({
      ...values,
      body: body.length ? body : [''],
      categoryId: Number(values.categoryId),
    });
  };

  const submitEdit = (values: ArticleFormValues) => {
    if (!editingArticle) return;
    const body = htmlToParagraphs(editBody);
    updateMutation.mutate({
      id: editingArticle.id,
      payload: {
        ...values,
        body: body.length ? body : [''],
        categoryId: Number(values.categoryId),
      },
    });
  };

  const categories = categoriesQuery.data ?? [];
  const articles = articlesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Articles</h2>
          <p className="mt-1 text-sm text-gray-500">Create, publish, edit, and delete news items.</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm((current) => !current);
            if (showCreateForm) {
              createForm.reset(defaultArticleValues);
              setCreateBody('');
            }
          }}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {showCreateForm ? 'Cancel' : 'New Article'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={createForm.handleSubmit(submitCreate)} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input
                {...createForm.register('title', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
              <input
                {...createForm.register('slug', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="my-article-slug"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                {...createForm.register('categoryId', { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Select category</option>
                {categories.filter((c: any) => !c.parent).map((parentCat: any) => {
                  const children = categories.filter((c: any) => c.parent?.id === parentCat.id);
                  if (children.length > 0) {
                    return (
                      <optgroup key={parentCat.id} label={parentCat.label}>
                        {children.map((child: any) => (
                          <option key={child.id} value={child.id}>{child.label}</option>
                        ))}
                      </optgroup>
                    );
                  }
                  return <option key={parentCat.id} value={parentCat.id}>{parentCat.label}</option>;
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Excerpt</label>
            <textarea
              {...createForm.register('excerpt', { required: true })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <ImageUploadField
            label="Article Image"
            value={createForm.watch('image')}
            onChange={(value) => createForm.setValue('image', value, { shouldDirty: true, shouldValidate: true })}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Article Body</label>
            <ReactQuill theme="snow" value={createBody} onChange={setCreateBody} modules={quillModules} />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...createForm.register('isFeatured')} />
            Featured article
          </label>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? 'Publishing...' : 'Publish Article'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Featured</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articlesQuery.isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Loading articles...
                </td>
              </tr>
            )}
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={getImageUrl(article.image)} alt={article.title} className="h-10 w-14 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">{article.title}</p>
                      <p className="truncate text-xs text-gray-400">{article.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{article.category?.label}</td>
                <td className="px-4 py-3 text-gray-500">{article.isFeatured ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setEditingArticle(article)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(article.id)}
                      className="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!articlesQuery.isLoading && !articles.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No articles created yet.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      <Dialog.Root open={!!editingArticle} onOpenChange={(open) => !open && setEditingArticle(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-gray-950/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[90vh] w-[min(960px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">Edit Article</Dialog.Title>
                <p className="mt-1 text-sm text-gray-500">Update article content and metadata.</p>
              </div>
              <Dialog.Close className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                <X size={18} />
              </Dialog.Close>
            </div>

            <form onSubmit={editForm.handleSubmit(submitEdit)} className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                  <input
                    {...editForm.register('title', { required: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    {...editForm.register('slug', { required: true })}
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
                    {categories.filter((c: any) => !c.parent).map((parentCat: any) => {
                      const children = categories.filter((c: any) => c.parent?.id === parentCat.id);
                      if (children.length > 0) {
                        return (
                          <optgroup key={parentCat.id} label={parentCat.label}>
                            {children.map((child: any) => (
                              <option key={child.id} value={child.id}>{child.label}</option>
                            ))}
                          </optgroup>
                        );
                      }
                      return <option key={parentCat.id} value={parentCat.id}>{parentCat.label}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Excerpt</label>
                <textarea
                  {...editForm.register('excerpt', { required: true })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <ImageUploadField
                label="Article Image"
                value={editForm.watch('image')}
                onChange={(value) => editForm.setValue('image', value, { shouldDirty: true, shouldValidate: true })}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Article Body</label>
                <ReactQuill theme="snow" value={editBody} onChange={setEditBody} modules={quillModules} />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" {...editForm.register('isFeatured')} />
                Featured article
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <Dialog.Close className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                  Cancel
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
