import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, MessageCircle, LogIn, UserPlus, Menu, LogOut, LayoutPanelLeft } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("donor_id");
    setIsLoggedIn(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://envs.sh/ov.png"
                alt="Bridge of Hope Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gray-800">Bridge of Hope</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-8" onClick={() => setIsDropdownOpen(false)}>
            <NavLink to="/" icon={<Home size={18} />} text="Home" isActive={isActive('/')} />
            <NavLink to="/about" icon={<Info size={18} />} text="About" isActive={isActive('/about')} />
            <NavLink to="/contact" icon={<MessageCircle size={18} />} text="Contact" isActive={isActive('/contact')} />
            {/* View More Dropdown (Visible Only If Logged In) */}
            {isLoggedIn && (
              <>
                <NavLink to="/donorhome" icon={<LayoutPanelLeft size={18} />} text="Dashboard" isActive={isActive('/donorhome')} />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <NavLink to="/login" icon={<LogIn size={18} />} text="Login" isActive={isActive('/login')} />
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/register') ? 'text-rose-600 bg-rose-50' : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      <Link
                        to="/register/donor"
                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Register as Donor
                      </Link>
                      <Link
                        to="/register/organization"
                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Register as Organization
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-rose-600 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" icon={<Home size={18} />} text="Home" isActive={isActive('/')} />
            <NavLink to="/about" icon={<Info size={18} />} text="About" isActive={isActive('/about')} />
            <NavLink to="/contact" icon={<MessageCircle size={18} />} text="Contact" isActive={isActive('/contact')} />

            {isLoggedIn && (
              <NavLink to="/donorhome" icon={<LayoutPanelLeft size={18} />} text="Dashboard" isActive={isActive('/donorhome')} />
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex w-full text-left items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <NavLink to="/login" icon={<LogIn size={18} />} text="Login" isActive={isActive('/login')} />
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/register') ? 'text-rose-600 bg-rose-50' : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      <Link
                        to="/register/donor"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Register as Donor
                      </Link>
                      <Link
                        to="/register/organization"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Register as Organization
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, icon, text, isActive, onClick }: { to: string; icon: React.ReactNode; text: string; isActive: boolean; onClick?: () => void }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-rose-600 bg-rose-50' : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50'
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
