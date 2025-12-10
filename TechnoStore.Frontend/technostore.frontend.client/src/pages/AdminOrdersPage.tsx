import { useEffect, useState } from "react";
import { api } from "../api/http";

const STATUS_COLORS: Record<string, string> = {
  "new": "bg-yellow-600",
  "processing": "bg-blue-600",
  "shipped": "bg-purple-600",
  "completed": "bg-green-600"
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");

  const loadOrders = () => {
    api
      .get("/orders/all")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Нет доступа. Вы не администратор."));
  };

  useEffect(() => loadOrders(), []);

  if (error)
    return <h2 className="p-6 text-red-400 text-xl font-semibold">{error}</h2>;

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Усі замовлення</h1>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Замовлення №{order.id}</h2>

              <span
                className={`px-3 py-1 text-sm rounded-full ${STATUS_COLORS[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-slate-400 text-sm mt-1">
              Дата: {new Date(order.createdAt).toLocaleString("uk-UA")}
            </p>

            <button
              onClick={() =>
                (window.location.href = `/admin/orders/${order.id}`)
              }
              className="mt-4 bg-sky-600 hover:bg-sky-500 px-5 py-2 rounded-xl text-white transition"
            >
              Переглянути деталі
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
