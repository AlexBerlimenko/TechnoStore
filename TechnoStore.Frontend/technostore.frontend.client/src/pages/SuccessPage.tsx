export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-white p-6">
      
      {/* Иконка успешного заказа */}
      <div className="bg-green-600 rounded-full w-28 h-28 flex items-center justify-center shadow-lg mb-6">
        <span className="text-5xl">✔</span>
      </div>

      <h1 className="text-4xl font-bold mb-4 text-center">
        Замовлення успішно оформлено!
      </h1>

      <p className="text-gray-300 text-lg mb-8 text-center max-w-md">
        Дякуємо за покупку! Ваше замовлення вже прийнято до обробки.  
        Наш менеджер зв'яжеться з вами у разі необхідності.
      </p>

      <a
        href="/catalog"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg shadow transition"
      >
        Повернутися до каталогу
      </a>
    </div>
  );
}
