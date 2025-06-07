import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "home" },
  { to: "/upload", label: "Upload Receipt", icon: "upload" },
  { to: "/settle", label: "Settle Up", icon: "payments" },
  { to: "/history", label: "History", icon: "history" },
];

const activeClasses = "bg-blue-100 text-blue-700 font-medium";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-20 transition-opacity ${open ? 'block md:hidden' : 'hidden'}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 transition-transform z-30 bg-white shadow
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:shadow-none md:block hidden`}
        aria-label="Sidebar"
      >
        <nav className="py-6 flex flex-col gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 rounded-md hover:bg-blue-50 transition-all ${
                  isActive || location.pathname === link.to ? activeClasses : "text-slate-800"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <span className="material-icons text-blue-500">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
