
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NotFound() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    return (
      <div className="text-center mt-20" data-theme="light" >
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      </div>
    );
  }
  