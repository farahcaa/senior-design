import { useState } from "react";
import { NavLink } from "react-router";
import { Home, UserCircle } from "lucide-react";

const navItems = [
  { to: "/account", label: "Home", icon: Home },
  { to: "/account/profile", label: "Account", icon: UserCircle },
];

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        hidden md:flex flex-col min-h-screen border-r border-black/[0.08] bg-white
        transition-all duration-200 ease-in-out flex-shrink-0
        ${hovered ? "w-52" : "w-14"}
      `}
    >
      {/* Brand */}
      <div className="h-14 border-b border-black/[0.08] flex items-center px-3 gap-3 overflow-hidden whitespace-nowrap">
        <img src="/logo.png" alt="App logo" className="w-8 h-8 rounded-xl flex-shrink-0 object-contain" />
        <span
          className={`text-sm font-semibold text-gray-900 transition-opacity duration-150 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          App
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 p-2 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap overflow-hidden
              ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "text-black/50 hover:bg-black/5 hover:text-black/80"
              }
              ${!hovered ? "justify-center" : ""}`
            }
            title={!hovered ? item.label : undefined}
          >
            <item.icon size={18} className="flex-shrink-0" />
            <span
              className={`transition-opacity duration-100 ${
                hovered ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
