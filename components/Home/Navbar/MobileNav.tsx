import React from "react";
import Link from "next/link";
import { navLinks } from "@/constant/constant";
import { CgClose } from "react-icons/cg";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ closeNav, showNav }: Props) => {
  const navOpen = showNav ? "translate-x-0" : "-translate-x-full";

  return (
    <div>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[900] bg-black transition-opacity duration-500 ${showNav ? "opacity-70 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeNav} // Cierra el menú al hacer clic en el fondo
      ></div>


      {/* Navlinks */}
      <div
        className={`fixed top-0 left-0 z-[1000] h-full w-[80%] sm:w-[60%] bg-[#647C64] text-white transform ${navOpen} transition-transform duration-500 ease-in-out flex flex-col items-start p-6 space-y-6`}
      >
        {/* Close button */}
        <CgClose
          onClick={closeNav}
          className="absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 text-white cursor-pointer"
        />

        {/* Navigation links */}
        {navLinks.map((navlink) => (
          <Link key={navlink.id} href={navlink.url}>
            <p className="text-[20px] sm:text-[30px] font-medium ml-4 border-b border-white pb-1 hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
              {navlink.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
