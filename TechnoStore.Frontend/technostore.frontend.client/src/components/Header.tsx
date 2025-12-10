import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const linkBase =
  "px-4 py-2 text-sm font-medium transition rounded-full hover:bg-slate-800/70";
const active = "bg-slate-800 text-sky-300 shadow-sm shadow-sky-500/30";
const inactive = "text-slate-200 hover:text-sky-300";

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
        {/* ЛОГОТИП */}
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-sky-300"
        >
          TechnoStore
        </Link>

        {/* НАВІГАЦІЯ */}
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            Головна
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            Каталог
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            Кошик
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            Мої замовлення
          </NavLink>

          {/* ------- ADMIN BUTTONS -------- */}
          {role === "admin" && (
            <>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive ? active : "text-red-300 hover:text-red-400"
                  }`
                }
              >
                Admin Panel
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive ? active : "text-orange-300 hover:text-orange-400"
                  }`
                }
              >
                Orders Admin
              </NavLink>
            </>
          )}
        </nav>

        {/* БЛОК АВТОРИЗАЦИИ: Увійти + (опционально) Вийти */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium rounded-full border ${
                isActive
                  ? "border-sky-400 text-sky-300 bg-slate-900"
                  : "border-slate-700 text-slate-200 hover:border-sky-400 hover:text-sky-300"
              }`
            }
          >
            Увійти
          </NavLink>

          {role && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-full border border-red-600 text-red-300 hover:border-red-400 hover:text-red-200 transition"
            >
              Вийти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
