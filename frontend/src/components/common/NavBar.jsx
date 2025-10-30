import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between bg-blue-100 p-4 px-10">

      {/* Logo */}
      <ul className="flex justify-between items-center">
        <li className="text-blue-600 text-2xl font-bold font-mono">
          <Link to="/">Code Glance</Link>
        </li>
      </ul>

      {/* Navigation Links */}
      <nav>
        <ul className="flex gap-8 text-[#000] text-[16px]">
          {[
            { name: "Batch Report", path: "/batch-report" },
            { name: "Student Report", path: "/student-report" },
            { name: "CP Report", path: "/cp-report" },
            { name: "Compare", path: "/compare" },
          ].map((item, index) => (
            <li key={index} className="relative group">
              <Link to={item.path} className="hover:text-blue-600 transition duration-300">
                {item.name}
              </Link>
              {/* Hover Line Effect */}
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:bottom-[-5px]"></span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
