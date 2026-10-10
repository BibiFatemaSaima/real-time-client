import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-md relative">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          Real-Time Collaborative
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        <ul className="menu menu-horizontal px-1 items-center">
          <li>
            <Link to="/">Home</Link>
          </li>

          {user && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-error btn-sm text-white"
                >
                  Logout
                </button>
              </li>
            </>
          )}

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
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-ghost btn-circle"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 w-full bg-base-100 shadow-md md:hidden z-50">
          <ul className="menu p-4">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>

            {user && (
              <>
                <li>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-error"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

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
