import { useState } from "react";
import { api } from "../api/http";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      const token = res.data.token;
      const role = res.data.role;

      // Зберігаємо авторизацію
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Перенаправлення адміністратора в адмін-панель
      if (role === "admin") {
        window.location.href = "/admin/products";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("Невірний логін або пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900/90 rounded-3xl p-8 shadow-2xl border border-slate-800/70">
        <h1 className="text-3xl font-bold mb-6 text-center text-sky-400">
          Вхід в акаунт
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/20 border border-red-700/60 rounded-2xl px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Вхід…" : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
}
