'use client';

import { useCategories } from '@/hooks/admin/useCategories';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import CategoryTable from '@/components/admin/categories/CategoryTable';
import type { Category, CategoryCreatePayload } from '@/lib/api-types';

export default function CategoriesPage() {
  const { items, loading, error, saving, actionId, load, create, toggleStatus, remove, currentPage, totalPages, nextPage, prevPage } =
    useCategories();

  const handleSubmit = async (payload: CategoryCreatePayload) => {
    await create(payload);
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Excluir a categoria "${category.name}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    await remove(category.id);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="text-[#39FF14] text-xs font-bold uppercase tracking-[0.3em]">Categorias</div>
        <h1 className="text-white text-3xl font-black">Gerenciar categorias</h1>
        <p className="text-white/50 text-sm">Crie novas categorias de catálogo e mantenha-as ativas.</p>
      </header>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-white text-lg font-bold mb-5">Nova categoria</h2>
        <CategoryForm onSubmit={handleSubmit} submitting={saving} />
      </div>

      <CategoryTable
        items={items}
        loading={loading}
        error={error}
        actionId={actionId}
        onToggleStatus={toggleStatus}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
}
