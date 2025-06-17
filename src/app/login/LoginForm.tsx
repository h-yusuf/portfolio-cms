"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      Swal.fire({
        icon: "success",
        title: "Login berhasil!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => router.push("/admin/dashboard"), 1600);
    } else {
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: "Email atau password salah.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex bg-white rounded-lg overflow-hidden w-full max-w-5xl">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-10 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Sign in to Yusup<br />Analysis Dashboard
          </h2>

          <form onSubmit={handleLogin} className="space-y-4" data-theme="light">
            <div>
              <label className="block text-sm text-gray-600">Email Address</label>
              <input
                className="input input-bordered w-full mt-1"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Password</label>
              <input
                className="input input-bordered w-full mt-1"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="checkbox" id="remember" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>

            <button type="submit" className="btn btn-accent w-full">Sign in</button>
          </form>
        </div>

        {/* Illustration Section */}
        <div className="hidden md:flex w-2/3 items-center justify-center bg-white p-6">
          <img
            src="/images/login-illustration.jpg"
            alt="Illustration"
            className="w-4/5 max-w-xs"
          />
        </div>
      </div>
    </div>
  );
}
