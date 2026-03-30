import { NavLink, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import SignInButton from "./SignInButton";
import logo from "../images/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Find a Doctor" },
  { to: "/appointments", label: "My Appointments" },
];

export default function Layout() {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="Medi Connect" className="h-8 w-auto" />
            <span className="text-xl font-bold text-blue-700 uppercase">Medi Connect</span>
          </NavLink>
          <ul className="flex gap-6 items-center">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-700 font-semibold border-b-2 border-blue-700 pb-1"
                      : "text-gray-500 hover:text-blue-600 transition-colors"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              {isAuthenticated ? (
                <button
                  onClick={signOut}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <SignInButton label="Sign In" className="text-sm px-4 py-1.5" />
              )}
            </li>
          </ul>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
