namespace TechnoStore.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }  // допускаем null

        public int ProductId { get; set; }
        public Product? Product { get; set; } // допускаем null

        public int Quantity { get; set; }
    }
}
