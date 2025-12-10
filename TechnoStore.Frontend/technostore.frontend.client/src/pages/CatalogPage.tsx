import { useEffect, useMemo, useState } from "react";
import { api } from "../api/http";

type CategoryInfo = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  category?: CategoryInfo | null;
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get<Product[]>("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Помилка завантаження каталогу:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = new Map<number, string>();
    for (const p of products) {
      if (p.category && !map.has(p.category.id)) {
        map.set(p.category.id, p.category.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const byCategory =
          selectedCategoryId === "all" || p.categoryId === selectedCategoryId;
        const bySearch =
          search.trim().length === 0 ||
          p.name.toLowerCase().includes(search.toLowerCase());
        return byCategory && bySearch;
      }),
    [products, selectedCategoryId, search]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-xl text-slate-300">Завантаження каталогу…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
        {/* ЛІВА КОЛОНКА — КАТЕГОРІЇ */}
        <aside className="w-60 flex-shrink-0">
          <div className="bg-slate-900/80 rounded-3xl p-4 shadow-xl border border-slate-800/60 sticky top-6">
            <h2 className="text-lg font-semibold mb-3 text-slate-100">
              Категорії
            </h2>

            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`w-full text-left px-4 py-2 rounded-full mb-2 text-sm transition ${
                selectedCategoryId === "all"
                  ? "bg-sky-500 text-white"
                  : "text-slate-200 hover:bg-slate-800/70"
              }`}
            >
              Усі товари
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryId(c.id)}
                className={`w-full text-left px-4 py-2 rounded-full mb-1 text-sm transition ${
                  selectedCategoryId === c.id
                    ? "bg-sky-500 text-white"
                    : "text-slate-200 hover:bg-slate-800/70"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </aside>

        {/* ПРАВА ЧАСТИНА — ПОШУК + КАРТОЧКИ */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Пошук */}
          <div className="flex justify-center mb-2">
            <input
              type="text"
              placeholder="Пошук товарів за назвою…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xl px-5 py-3 rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-100 placeholder-slate-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Сітка товарів */}
          {filtered.length === 0 ? (
            <p className="text-slate-400 mt-4">
              Товари за заданим фільтром не знайдено.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => (window.location.href = `/product/${p.id}`)}
                  className="bg-slate-900/90 rounded-3xl overflow-hidden shadow-xl border border-slate-800/60 text-left hover:translate-y-[-4px] hover:shadow-2xl hover:border-sky-500/60 transition transform duration-200 flex flex-col h-full"
                >
                  {/* Блок з картинкою */}
                  {p.imageUrl ? (
                    <div className="w-full h-56 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.parentElement?.classList.add("hidden");
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      <div className="text-slate-700 text-sm">
                        Немає зображення
                      </div>
                    </div>
                  )}

                  {/* Контент картки - займає залишений простір */}
                  <div className="p-5 flex flex-col gap-2 flex-grow">
                    <h3 className="text-lg font-semibold text-slate-50 line-clamp-2 min-h-[3.5rem]">
                      {p.name}
                    </h3>

                    <div className="flex-grow">
                      <p className="text-sm text-slate-400 line-clamp-3 whitespace-pre-line min-h-[4.5rem]">
                        {p.description}
                      </p>
                    </div>

                    <p className="mt-2 text-lg font-bold text-sky-400">
                      {p.price.toLocaleString("uk-UA")} грн
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}