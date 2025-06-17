import Link from "next/link";
import { FileText, Folder, Layers, Briefcase } from "lucide-react";

const stats = [
  { title: "Posts", value: 12, icon: <FileText className="w-5 h-5" />, href: "/admin/posts" },
  { title: "Projects", value: 8, icon: <Briefcase className="w-5 h-5" />, href: "/admin/projects" },
  { title: "Categories", value: 4, icon: <Folder className="w-5 h-5" />, href: "/admin/categories" },
  { title: "Experiences", value: 6, icon: <Layers className="w-5 h-5" />, href: "/admin/experiences" },
];

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
       
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white border shadow-sm p-4 rounded-lg hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Recent Posts</h3>
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {/* Replace with map from fetched posts */}
              <tr className="border-t">
                <td className="px-4 py-2">Intro to Tailwind</td>
                <td className="px-4 py-2">Frontend</td>
                <td className="px-4 py-2">11 Jun 2025</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">React CMS Setup</td>
                <td className="px-4 py-2">Development</td>
                <td className="px-4 py-2">10 Jun 2025</td>
              </tr>
              {/* ... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
