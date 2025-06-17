"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type Category = {
  id?: string;
  name: string;
  slug: string;
  createdAt?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>({ name: "", slug: "" });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedForm = {
      ...form,
      slug: generateSlug(form.name),
    };

    const method = isEdit ? "PUT" : "POST";
    const endpoint = isEdit ? `/api/categories/${form.id}` : `/api/categories`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");

      toast.success(isEdit ? "Kategori diperbarui" : "Kategori ditambahkan");
      setForm({ name: "", slug: "" });
      setShowModal(false);
      fetchCategories();
    } catch {
      toast.error("Gagal menyimpan kategori");
    }
  };

  const deleteCategory = async (id: string) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus kategori ini?",
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast.success("Kategori berhasil dihapus");
        fetchCategories();
      } catch {
        toast.error("Gagal menghapus kategori");
      }
    }
  };

  const handleEdit = (category: Category) => {
    setForm(category);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleCreate = () => {
    setForm({ name: "", slug: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">CATEGORY</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-info-content text-white rounded-full hover:bg-info-content/50 transition"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Create</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-500">
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Slug</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {categories.map((cat,index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td className="text-sm">{cat.slug}</td>
                <td>{new Date(cat.createdAt!).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-ghost text-blue-500"
                    onClick={() => handleEdit(cat)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-ghost text-red-500"
                    onClick={() => deleteCategory(cat.id!)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <p className="text-center py-6 text-gray-500">Belum ada kategori.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-gray-500">
              {isEdit ? "Edit Kategori" : "Tambah Kategori"}
            </h3>

            <form onSubmit={handleSubmit} data-theme="light" className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nama Kategori"
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })
                }
                required
              />

              <input
                type="text"
                name="slug"
                placeholder="Slug"
                className="input input-bordered w-full"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />

              <div className="flex justify-end">
                <button type="submit" className="btn btn-info-content">
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
