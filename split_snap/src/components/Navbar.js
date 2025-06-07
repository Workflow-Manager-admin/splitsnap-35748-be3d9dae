import React from "react";
import { useAuth } from "./AuthContext";

/**
 * Renders the SplitSnap top navigation bar.
 */
export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar bg-white shadow fixed w-full top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto px-3 md:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-xl px-2 py-1" onClick={() => setSidebarOpen?.(!sidebarOpen)}>
            <span className="material-icons" aria-hidden>menu</span>
          </button>
          <div className="logo text-lg font-bold flex items-center gap-2 select-none">
            <span className="text-blue-600 text-2xl font-black">🧾</span>
            SplitSnap
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="font-medium text-slate-700 truncate max-w-xs">
              {user.email}
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
