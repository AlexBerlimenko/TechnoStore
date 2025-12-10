import { useEffect, useState } from "react";
import { api } from "../api/http";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Ошибка загрузки заказов:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2 className="p-6 text-white text-xl">Загрузка…</h2>;

  if (orders.length === 0)
    return (
      <h2 className="p-6 text-gray-300 text-xl">
        У вас поки немає замовлень
      </h2>
    );

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Мої замовлення</h1>

      <div className="flex flex-col gap-6 max-w-3xl">
        {orders.map((order) => {
          const total = order.items.reduce(
            (sum: number, item: any) =>
              sum + item.priceAtMoment * item.quantity,
            0
          );

          return (
            <div
              key={order.id}
              className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700"
            >
              {/* Заголовок заказа */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Замовлення №{order.id}</h2>

                <span className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleString("uk-UA")}
                </span>
              </div>

              {/* Состав заказа */}
              <h3 className="text-lg font-medium mb-2">Состав замовлення:</h3>

              <div className="flex flex-col gap-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-gray-900 p-3 rounded-lg"
                  >
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {item.product?.name}
                      </p>

                      <p className="text-gray-400 text-sm">
                        Цена: {item.priceAtMoment} грн
                      </p>

                      <p className="text-gray-400 text-sm">
                        Количество: {item.quantity} шт.
                      </p>
                    </div>

                    <div className="text-blue-400 font-bold text-lg">
                      {item.priceAtMoment * item.quantity} грн
                    </div>
                  </div>
                ))}
              </div>

              {/* Итоговая сумма */}
              <div className="mt-4 text-right">
                <p className="text-xl font-bold text-blue-400">
                  Разом: {total} грн
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
