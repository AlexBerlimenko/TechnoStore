import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = id === "new";

  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    categoryId: 1,
  });

  useEffect(() => {
    if (!isNew) {
      api.get(`/products/${id}`).then((res) => {
        setForm({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
          imageUrl: res.data.imageUrl,
          categoryId: res.data.categoryId,
        });
      });
    }
  }, [id, isNew]);

  const submit = async () => {
    try {
      if (isNew) {
        await api.post("/products", form);
      } else {
        await api.put(`/products/${id}`, form);
      }

      alert("Збережено!");
      navigate("/admin/products");
    } catch {
      alert("Помилка збереження!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        {isNew ? "Додати товар" : "Редагувати товар"}
      </h1>

      <div className="flex flex-col gap-4">

        <input
          placeholder="Назва"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
        />

        <input
          type="number"
          placeholder="Ціна"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
        />

        <textarea
          placeholder="Опис"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 min-h-[150px]"
        />

        <input
          placeholder="URL зображення"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
        />

        <input
          type="number"
          placeholder="ID категорії"
          value={form.categoryId}
          onChange={(e) =>
            setForm({ ...form, categoryId: Number(e.target.value) })
          }
          className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
        />

        <button
          onClick={submit}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 rounded-lg font-semibold"
        >
          Зберегти
        </button>
      </div>
    </div>
  );
}
