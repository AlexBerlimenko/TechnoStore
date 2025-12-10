import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/http";

export default function AdminOrderViewPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("");

  const load = () => {
    api.get(`/orders/all`).then((res) => {
      const found = res.data.find((o: any) => o.id === Number(id));
      setOrder(found);
      setStatus(found?.status || "");
    });
  };

  useEffect(() => load(), [id]);

  const saveStatus = () => {
    api
      .patch(`/orders/${id}/status?status=${status}`)
      .then(() => {
        alert("Статус оновлено");
        load();
      })
      .catch(() => alert("Помилка оновлення статусу"));
  };

  if (!order)
    return <h2 className="p-6 text-slate-300">Замовлення не знайдено</h2>;

  const total = order.items.reduce(
    (sum: number, item: any) => sum + item.priceAtMoment * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-semibold mb-6">
        Замовлення №{order.id}
      </h1>

      {/* Блок статуса */}
      <div className="mb-6">
        <label className="text-sm text-slate-400">Статус замовлення</label>
        <div className="flex gap-3 items-center mt-1">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl"
          >
            <option value="new">new</option>
            <option value="processing">processing</option>
            <option value="shipped">shipped</option>
            <option value="completed">completed</option>
          </select>

          <button
            onClick={saveStatus}
            className="bg-sky-600 px-4 py-2 rounded-xl hover:bg-sky-500"
          >
            Оновити
          </button>
        </div>
      </div>

      {/* Товары */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700">
        <h2 className="text-xl mb-4 font-semibold">Товари у замовленні</h2>

        <div className="flex flex-col gap-4">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-slate-800 px-4 py-3 rounded-xl"
            >
              <img
                src={item.product?.imageUrl}
                className="w-20 h-20 object-contain rounded-lg"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.product?.name}</p>
                <p className="text-sm text-slate-400">
                  {item.quantity} шт × {item.priceAtMoment} грн
                </p>
              </div>

              <div className="text-lg font-bold text-sky-400">
                {item.quantity * item.priceAtMoment} грн
              </div>
            </div>
          ))}
        </div>

        <div className="text-right mt-6 text-2xl font-bold text-sky-400">
          Разом: {total} грн
        </div>
      </div>
    </div>
  );
}
