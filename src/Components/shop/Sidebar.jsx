
import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/", icon: "▦" },
  { name: "Mobile Inventory", path: "/mobiles", icon: "📱" },
  { name: "Purchases", path: "/purchases", icon: "📦" },
  { name: "Sales", path: "/sales", icon: "🛒" },
  { name: "Expenses", path: "/expenses", icon: "💸" },
  { name: "Profit & Loss", path: "/profit-loss", icon: "📈" },
  { name: "Reports", path: "/reports", icon: "📊" },
];

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-64 shrink-0 bg-gray-950 text-white lg:min-h-screen rounded-xl p-4">
      <div className="flex items-center gap-3 px-2 py-4 mb-5">
        <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center text-2xl">
          📱
        </div>
        <div>
          <h2 className="font-bold text-lg">Mobile Shop</h2>
          <p className="text-xs text-gray-400">Management System</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500 px-3 mb-3">
        MAIN MENU
      </p>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
