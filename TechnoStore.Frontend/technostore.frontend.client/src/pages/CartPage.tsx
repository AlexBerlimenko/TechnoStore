import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCart, removeCartItem, clearCart } from "../api/cart";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = () => {
    setLoading(true);
    getCart()
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (loading)
    return <h2 className="p-6 text-slate-200">Завантаження...</h2>;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const increase = async (itemId: number, qty: number) => {
    await updateCart(itemId, qty + 1);
    loadCart();
  };

  const decrease = async (itemId: number, qty: number) => {
    if (qty <= 1) return;
    await updateCart(itemId, qty - 1);
    loadCart();
  };

  const deleteItem = async (itemId: number) => {
    await removeCartItem(itemId);
    loadCart();
  };

  const clear = async () => {
    await clearCart();
    loadCart();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Кошик</h1>

      {items.length === 0 && (
        <p className="text-slate-300">Ваш кошик порожній.</p>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex gap-4 items-center shadow-lg shadow-black/40"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-20 h-20 rounded-2xl object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-slate-400">
                {item.product.price} грн за одиницю
              </p>

              <div className="mt-2 inline-flex items-center gap-2">
                <button
                  onClick={() => decrease(item.id, item.quantity)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-lg"
                >
                  –
                </button>
                <span className="min-w-[2rem] text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increase(item.id, item.quantity)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-sky-400 mb-2">
                {item.product.price * item.quantity} грн
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-xs px-3 py-1 rounded-full bg-red-500/80 hover:bg-red-400 text-white"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-xl">
            Разом:{" "}
            <span className="font-bold text-sky-400">{total} грн</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/30"
            >
              Оформити замовлення
            </button>
            <button
              onClick={clear}
              className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm"
            >
              Очистити кошик
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
