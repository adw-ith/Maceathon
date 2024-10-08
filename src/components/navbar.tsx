import React from "react";
import Logout from "./logout";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 sticky top-0 p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-white font-bold text-lg">
        <img
          src="https://encode.encidemace.xyz/images/encide_logo-removebg-preview.png"
          alt="Logo"
          className="h-8 inline-block mr-2"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-8">
        <a href="/" className="text-gray-300 hover:text-white">
          Home
        </a>
        <a href="/contact" className="text-gray-300 hover:text-white">
          Contact
        </a>
      </div>

      {/* Logout Button */}
      <div>
        <Logout></Logout>
      </div>
    </nav>
  );
}
