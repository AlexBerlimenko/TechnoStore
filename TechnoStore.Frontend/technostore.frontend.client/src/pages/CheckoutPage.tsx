import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState("nova_poshta");
  const [payment, setPayment] = useState("cod");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cart")
      .then(res => setCart(res.data))
      .finally(() => setLoading(false));
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const submitOrder = async () => {
    if (!fullName || !phone || !city || !address) {
      alert("Заповніть всі поля!");
      return;
    }

    try {
      const res = await api.post("/orders/checkout", {
        fullName,
        phone,
        city,
        address,
        delivery,
        payment
      });

      alert("Замовлення успішно оформлене!");
      navigate("/success");
    } catch (e) {
      console.error(e);
      alert("Помилка оформлення замовлення");
    }
  };

  if (loading)
    return <p className="p-6 text-slate-300">Завантаження…</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-slate-100">
      <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* ЛІВА ЧАСТИНА — ФОРМА */}
        <div className="space-y-6 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">

          <div>
            <h2 className="text-xl font-semibold mb-3">Дані покупця</h2>

            <input
              type="text"
              placeholder="ПІБ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 mb-3"
            />

            <input
              type="text"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 mb-3"
            />

            <input
              type="text"
              placeholder="Місто"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 mb-3"
            />

            <input
              type="text"
              placeholder="Адреса / Відділення НП"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Доставка</h2>

            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700"
            >
              <option value="nova_poshta">Нова Пошта</option>
              <option value="courier">Кур’єром</option>
              <option value="pickup">Самовивіз</option>
            </select>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Оплата</h2>

            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700"
            >
              <option value="cod">Готівкою при отриманні</option>
              <option value="card">Карткою</option>
            </select>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА — ПІДСУМОК */}
        <div className="space-y-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">

          <h2 className="text-xl font-semibold mb-3">Ваше замовлення</h2>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-slate-800/50 p-4 rounded-2xl"
            >
              <img
                src={item.product.imageUrl}
                className="w-20 h-20 object-contain mr-4 rounded-xl"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-slate-400">
                  {item.quantity} × {item.product.price} грн
                </p>
              </div>

              <p className="text-sky-400 font-bold">
                {item.product.price * item.quantity} грн
              </p>
            </div>
          ))}

          <div className="text-xl font-bold mt-4 text-right">
            Разом: <span className="text-sky-400">{total} грн</span>
          </div>

          <button
            onClick={submitOrder}
            className="w-full mt-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-lg transition"
          >
            Підтвердити замовлення
          </button>
        </div>
      </div>
    </div>
  );
}
