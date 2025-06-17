"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  useEditor,
  EditorContent
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import TextAlign from "@tiptap/extension-text-align";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Pilcrow
} from "lucide-react";


type Post = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  createdAt?: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<Post>({
    title: "",
    slug: "",
    content: "",
    category: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Heading.configure({ levels: [1, 2] }),
      Paragraph,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
  });

  const buttons = [
    { icon: <BoldIcon size={16} />, label: "Bold", action: () => editor?.chain().focus().toggleBold().run() },
    { icon: <ItalicIcon size={16} />, label: "Italic", action: () => editor?.chain().focus().toggleItalic().run() },
    { icon: <UnderlineIcon size={16} />, label: "Underline", action: () => editor?.chain().focus().toggleUnderline().run() },
    { icon: <Strikethrough size={16} />, label: "Strike", action: () => editor?.chain().focus().toggleStrike().run() },
    { icon: <Heading1 size={16} />, label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: <Heading2 size={16} />, label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: <Pilcrow size={16} />, label: "Paragraph", action: () => editor?.chain().focus().setParagraph().run() },
    { icon: <List size={16} />, label: "Bullet", action: () => editor?.chain().focus().toggleBulletList().run() },
    { icon: <ListOrdered size={16} />, label: "Ordered", action: () => editor?.chain().focus().toggleOrderedList().run() },
    { icon: <Quote size={16} />, label: "Quote", action: () => editor?.chain().focus().toggleBlockquote().run() },
    { icon: <Code size={16} />, label: "Code", action: () => editor?.chain().focus().toggleCodeBlock().run() },
    { icon: <Undo2 size={16} />, label: "Undo", action: () => editor?.chain().focus().undo().run() },
    { icon: <Redo2 size={16} />, label: "Redo", action: () => editor?.chain().focus().redo().run() },
    { icon: <AlignLeft size={16} />, label: "Left", action: () => editor?.chain().focus().setTextAlign("left").run() },
    { icon: <AlignCenter size={16} />, label: "Center", action: () => editor?.chain().focus().setTextAlign("center").run() },
    { icon: <AlignRight size={16} />, label: "Right", action: () => editor?.chain().focus().setTextAlign("right").run() },
    { icon: <AlignJustify size={16} />, label: "Justify", action: () => editor?.chain().focus().setTextAlign("justify").run() }
  ];

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  // categories

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // end categories  

  const deletePost = async (id: string) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus post ini?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast.success("Post berhasil dihapus");
        fetchPosts();
      } catch {
        toast.error("Gagal menghapus post");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editor) return;

    const updatedForm = {
      ...form,
      slug: generateSlug(form.title),
      content: editor.getHTML(),
    };

    const method = isEdit ? "PUT" : "POST";
    const endpoint = isEdit ? `/api/posts/${form.id}` : `/api/posts`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");

      toast.success(
        isEdit ? "Post berhasil diperbarui" : "Post berhasil dibuat"
      );
      setForm({ title: "", slug: "", content: "", category: "" });
      editor.commands.clearContent();
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan");
    }
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")      // hilangkan karakter aneh
      .replace(/\s+/g, "-")          // ganti spasi jadi "-"
      .replace(/--+/g, "-");         // hindari dobel "-"

  // Dalam handleSubmit
  const slug = generateSlug(form.title);
  const body = { ...form, slug };


  const handleEdit = (post: Post) => {
    setForm(post);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleCreate = () => {
    setForm({ title: "", slug: "", content: "", category: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editor && form.content) {
      editor.commands.setContent(form.content);
    }
  }, [editor, form.content]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">POST</h2>
        <button
          className="flex items-center gap-1 px-3 py-2 text-sm bg-info-content text-white rounded-full hover:bg-info-content/50 transition"
          onClick={handleCreate}
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Create</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-500">
            <tr>
              <th>#</th>
              <th>Judul</th>
              <th>Slug</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>{post.title}</td>
                <td className="text-sm">{post.slug}</td>
                <td>
                  <span className="badge badge-primary">{post.category}</span>
                </td>
                <td>{new Date(post.createdAt!).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-ghost text-blue-500"
                    onClick={() => handleEdit(post)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-ghost text-red-500"
                    onClick={() => deletePost(post.id!)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <p className="text-center py-6 text-gray-500">Belum ada post.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {isEdit ? "Edit Post" : "Create Post"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-theme="light"
            >
              <input
                type="text"
                name="title"
                placeholder="Judul"
                className="input input-bordered w-full"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({ ...form, title, slug: generateSlug(title) });
                }}
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
              <select
                name="category"
                className="select select-bordered w-full"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="" disabled>Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="border rounded-md p-4 shadow bg-white space-y-4">
                {/* Toolbar */}
                <div className="flex flex-wrap gap-2">
                  {buttons.map((btn, index) => (
                    <button
                      key={index}
                      onClick={btn.action}
                      type="button"
                      className="flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md border border-gray-300 bg-gray-100 hover:bg-blue-100 text-gray-700 transition"
                      title={btn.label}
                    >
                      {btn.icon}
                    </button>
                  ))}
                </div>

                {/* Editor */}
                <div className="min-h-[200px] border border-gray-300 rounded-md p-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-300 transition-all">
                  <EditorContent className="min-h-[200px]" editor={editor} />
                </div>
              </div>

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
