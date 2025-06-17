import Link from "next/link";

export default function Projects() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Link href="/admin/posts/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          New Post
        </Link>
      </div>

      <div>
        {/* Daftar post bisa di-fetch di sini */}
        <p>Daftar postingan akan tampil di sini</p>
      </div>
    </div>
  );
}
