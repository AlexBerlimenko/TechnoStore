namespace TechnoStore.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";

        // Для авторизации:
        public string PasswordHash { get; set; } = "";

        // Роль: "admin" или "user"
        public string Role { get; set; } = "user";
    }
}
