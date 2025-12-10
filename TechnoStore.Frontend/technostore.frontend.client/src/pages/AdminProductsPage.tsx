import { useEffect, useState } from "react";
import { api } from "../api/http";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Видалити товар?")) return;

    try {
      await api.delete(`/products/${id}`);
      load();
    } catch {
      alert("Не вдалося видалити товар. Можливо, він використовується в замовленнях.");
    }
  };

  if (loading)
    return <div className="p-6 text-slate-200 text-lg">Завантаження…</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управління товарами</h1>

        <Link
          to="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold"
        >
          + Додати товар
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-20 h-20 object-cover rounded-lg bg-white"
              />
              <div>
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sky-400 font-bold">{p.price} грн</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/admin/products/${p.id}`}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
              >
                Редагувати
              </Link>

              <button
                onClick={() => remove(p.id)}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
