import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar bg-base-100 shadow-md">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          Real-Time Collaborative
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          {/* Home */}
          <li>
            <Link to="/">Home</Link>
          </li>

          {/* Dashboard - Only logged in user */}
          {user && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}

          {/* Login & Register - Only logged out user */}
          {!user && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>

              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-ghost btn-circle"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 right-0 w-full bg-base-100 shadow-md md:hidden">
          <ul className="menu p-4">
            {/* Home */}
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>

            {/* Dashboard - Only logged in user */}
            {user && (
              <li>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </li>
            )}

            {/* Login & Register - Only logged out user */}
            {!user && (
              <>
                <li>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </li>

                <li>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
