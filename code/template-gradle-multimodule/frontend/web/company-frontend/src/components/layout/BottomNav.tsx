import { NavLink } from "react-router";
import { Home, UserCircle } from "lucide-react";

const navItems = [
  { to: "/account", label: "Home", icon: Home },
  { to: "/account/profile", label: "Account", icon: UserCircle },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-black/[0.08] flex items-center z-30">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
              isActive ? "text-emerald-500" : "text-black/40"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                className={`text-[10px] font-medium ${isActive ? "text-emerald-500" : "text-black/40"}`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
