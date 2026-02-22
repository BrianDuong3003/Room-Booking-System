import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary">SCAMS</span>
                <span className="ml-2 text-sm text-muted-foreground hidden md:block">Smart Campus System</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              {/* <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link> */}
            </div>
          </div>
          <div className="hidden sm:flex items-center">
            <Link to="/login">
              <Button variant="outline" className="mr-2">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link to="/about" className="nav-link block py-2">About</Link>
            <Link to="/contact" className="nav-link block py-2">Contact</Link>
            <div className="pt-4 pb-3 border-t border-gray-100 dark:border-gray-700">
              <Link to="/login" className="block py-2 text-base font-medium text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                Login
              </Link>
              <Link to="/register" className="block py-2 text-base font-medium text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}