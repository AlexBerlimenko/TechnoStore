import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center">
      {/* фон-картинка + градієнт */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/90" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Магазин сучасної техніки для роботи та ігор
        </h1>
        <p className="text-slate-300 text-lg md:text-xl mb-8 leading-relaxed">
          Ноутбуки, периферія, аксесуари та охолодження — все, що потрібно
          для комфортної роботи, навчання та геймінгу.
        </p>

        <Link
          to="/catalog"
          className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-medium text-lg shadow-lg shadow-sky-500/30 transition"
        >
          Перейти до каталогу
        </Link>
      </div>
    </div>
  );
}
