import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/http";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Помилка завантаження товару:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    try {
      await api.post(`/cart/add?productId=${product.id}&quantity=1`);
      alert("Додано до кошика!");
    } catch (e) {
      console.error(e);
      alert("Помилка додавання до кошика");
    }
  };

  if (loading) {
    return (
      <h2 className="p-6 text-slate-200 text-center">Завантаження...</h2>
    );
  }

  if (!product) {
    return (
      <h2 className="p-6 text-slate-200 text-center">Товар не знайдено</h2>
    );
  }

  // Розбиваємо опис на блоки за подвійним перенесенням рядка
  const blocks = product.description.split("\n\n").filter((b: string) => b.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10 grid gap-10 md:grid-cols-[1.1fr,1fr]">
        {/* Блок з картинкою */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/40 inline-flex items-start justify-center self-start">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-[500px] max-w-full object-contain rounded-3xl p-2"
          />
        </div>

        {/* Блок з текстом / характеристиками */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-3xl font-bold text-sky-400">
              {product.price.toLocaleString("uk-UA")} грн
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
            {blocks.map((block, idx) => {
              const lines = block.split("\n").filter((l) => l.trim().length > 0);
              const title = lines[0];
              const rest = lines.slice(1);

              // якщо в блоці кілька рядків — вважаємо перший заголовком
              if (rest.length > 0) {
                return (
                  <section key={idx} className="border-b border-slate-800/70 last:border-none pb-3 last:pb-0">
                    <h3 className="text-sm font-semibold text-slate-200 mb-1">
                      {title}
                    </h3>
                    <ul className="text-sm text-slate-300 space-y-1">
                      {rest.map((line, i) => (
                        <li key={i} className="leading-relaxed">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              }

              // окремий рядок — просто абзац
              return (
                <p
                  key={idx}
                  className="text-sm text-slate-300 leading-relaxed whitespace-pre-line"
                >
                  {block}
                </p>
              );
            })}
          </div>

          <button
            onClick={addToCart}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 transition"
          >
            Додати до кошика
          </button>
        </div>
      </div>
    </div>
  );
}