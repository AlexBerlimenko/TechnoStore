namespace TechnoStore.Models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Новый статус заказа
        // Возможные значения:
        // "Новий", "Обробляється", "Відправлено", "Завершено"
        public string Status { get; set; } = "Новий";

        // Внешний ключ на пользователя
        public int UserId { get; set; }
        public User? User { get; set; }

        // Состав заказа
        public List<OrderItem> Items { get; set; } = new();
    }
}
