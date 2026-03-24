import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HashLink as Lin } from "react-router-hash-link";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  FaUserCircle,
  FaArrowUp,
  FaBars,
  FaTimes,
  FaLeaf,
} from "react-icons/fa";

const Navbar = () => {
  const { user, role, loading, isLoggedIn, setIsLoggedIn } =
    useContext(AuthContext);
  const { cartCount, setCart } = useContext(CartContext);

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      if (setCart) setCart([]);
      closeAllMenus();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeAllMenus = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    setMobileProfileOpen(false);
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const sections = ["home", "about", "products", "faq", "contact"];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      setShowScrollUp(window.scrollY > 300);
      for (let id of sections) {
        const el = document.getElementById(id);
        if (
          el &&
          scrollPos >= el.offsetTop &&
          scrollPos < el.offsetTop + el.offsetHeight
        ) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target)
      )
        setMobileProfileOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClasses = (id) =>
    `transition px-3 py-1 rounded ${
      activeSection === id
        ? "text-green-400 font-bold border-b-2 border-green-400"
        : "text-gray-200 hover:text-green-400"
    }`;

  const navLinkClasses = ({ isActive }) =>
    `transition px-3 py-1 rounded ${
      isActive
        ? "text-green-400 font-bold border-b-2 border-green-400"
        : "text-gray-200 hover:text-green-400"
    }`;
  const handleBrandClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("home");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (role === "USER") {
      navigate("/products");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard");
    }
  };
  if (loading) return null;

  const ProfileLinks = () => (
    <>
      {!isLoggedIn ? (
        <>
          <Link
            to="/login"
            onClick={closeAllMenus}
            className="block text-sm text-gray-200 hover:text-green-400"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={closeAllMenus}
            className="block text-sm text-gray-200 hover:text-green-400"
          >
            Register
          </Link>
        </>
      ) : (
        <>
          {user?.name && (
            <p className="text-xs text-gray-400 truncate px-1 pb-1 border-b border-gray-700">
              {user.name}
            </p>
          )}
          <Link
            to="/profile"
            onClick={closeAllMenus}
            className="block text-sm text-gray-200 hover:text-green-400"
          >
            Profile
          </Link>
          <Link
            to="/transactions"
            onClick={closeAllMenus}
            className="block text-sm text-gray-200 hover:text-green-400"
          >
            Transactions
          </Link>
          <button
            onClick={() => {
              closeAllMenus();
              setShowLogoutModal(true);
            }}
            className="text-red-500 text-sm w-full text-left hover:text-red-600"
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className="w-full fixed top-0 z-50 bg-gray-900/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between p-4 items-center">
          <a
            href="/#home"
            onClick={handleBrandClick}
            className="flex items-center gap-2 text-2xl font-bold text-green-500 cursor-pointer"
          >
            <img src="/verdura.png" alt="Verdura Logo" className="w-6 h-6" />
            Verdura
          </a>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 items-center">
            {!isLoggedIn && (
              <>
                <Lin smooth to="/#home" className={linkClasses("home")}>
                  Home
                </Lin>
                <Lin smooth to="/#about" className={linkClasses("about")}>
                  About
                </Lin>
                <Lin smooth to="/#products" className={linkClasses("products")}>
                  Products
                </Lin>
                <Lin smooth to="/#faq" className={linkClasses("faq")}>
                  FAQ
                </Lin>
                <Lin smooth to="/#contact" className={linkClasses("contact")}>
                  Contact
                </Lin>
              </>
            )}
            {isLoggedIn && role === "USER" && (
              <>
                <NavLink to="/products" className={navLinkClasses}>
                  Products
                </NavLink>
                <NavLink to="/cart" className={navLinkClasses}>
                  Cart ({cartCount})
                </NavLink>
                <NavLink to="/orders" className={navLinkClasses}>
                  Orders
                </NavLink>
              </>
            )}
            {isLoggedIn && role === "ADMIN" && (
              <>
                <NavLink to="/admin/dashboard" className={navLinkClasses}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/manage-products" className={navLinkClasses}>
                  Manage Products
                </NavLink>
                <NavLink to="/products" className={navLinkClasses}>
                  Products
                </NavLink>
                <NavLink to="/orders" className={navLinkClasses}>
                  Orders
                </NavLink>
                <NavLink to="/admin/all-orders" className={navLinkClasses}>
                  All Orders
                </NavLink>
                <NavLink to="/cart" className={navLinkClasses}>
                  Cart ({cartCount})
                </NavLink>
              </>
            )}
            <div className="relative" ref={profileRef}>
              <FaUserCircle
                size={26}
                className="cursor-pointer text-green-400"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-gray-800 shadow-lg rounded-xl p-3 space-y-2">
                  <ProfileLinks />
                </div>
              )}
            </div>
          </div>

          {/* MOBILE ICONS */}
          <div className="md:hidden flex items-center gap-4">
            <div className="relative" ref={mobileProfileRef}>
              <FaUserCircle
                size={26}
                className="cursor-pointer text-green-400"
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              />
              {mobileProfileOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-gray-800 shadow-lg rounded-xl p-3 space-y-2">
                  <ProfileLinks />
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setMobileProfileOpen(false);
              }}
            >
              {mobileOpen ? (
                <FaTimes size={24} className="text-green-400" />
              ) : (
                <FaBars size={24} className="text-green-400" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden bg-gray-900/95 backdrop-blur-md shadow-lg w-full px-6 py-6 flex flex-col items-start space-y-4 text-left"
          >
            {!isLoggedIn && (
              <>
                {["home", "about", "products", "faq", "contact"].map((s) => (
                  <Lin
                    key={s}
                    smooth
                    to={`/#${s}`}
                    onClick={closeAllMenus}
                    className={linkClasses(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Lin>
                ))}
              </>
            )}

            {isLoggedIn && role === "USER" && (
              <>
                <NavLink
                  to="/products"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Products
                </NavLink>
                <NavLink
                  to="/cart"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Cart ({cartCount})
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Orders
                </NavLink>
              </>
            )}

            {isLoggedIn && role === "ADMIN" && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/manage-products"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Manage Products
                </NavLink>
                <NavLink
                  to="/products"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Products
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Orders
                </NavLink>
                <NavLink
                  to="/admin/all-orders"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  All Orders
                </NavLink>
                <NavLink
                  to="/cart"
                  onClick={closeAllMenus}
                  className={navLinkClasses}
                >
                  Cart ({cartCount})
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>

      {showScrollUp && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-green-400 hover:bg-green-300 text-gray-900 p-3 rounded-full shadow-lg z-50"
        >
          <FaArrowUp />
        </button>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-80 text-center">
            <p className="text-gray-200 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
