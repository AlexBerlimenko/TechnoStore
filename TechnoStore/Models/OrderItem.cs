namespace TechnoStore.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        // FK - Order
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        // FK - Product
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        // Количество товара
        public int Quantity { get; set; }

        // Цена на момент покупки
        public decimal PriceAtMoment { get; set; }
    }
}
