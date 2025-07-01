"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="text-xl font-bold text-orange-600">
            RepoRadar
          </Link>

    
          <div className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>


      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <Link href="/" className="block py-2 hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="block py-2 hover:text-blue-600">
            About
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
