"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/public/android-chrome-192x192.png";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black backdrop-blur-md border-b-[0.5px] border-[#333] shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Movie Explorer" className="w-10 h-10" priority />
            <h1 className="text-2xl font-bold text-white">Movie Explorer</h1>
          </div>
          {/* Navigation Links */}
          <nav className="flex gap-6" aria-label="Main navigation">
            <Link
              href="/"
              className={`text-white hover:text-blue-300 transition pb-1 ${
                pathname === "/" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Movies
            </Link>
            <Link
              href="/tv"
              className={`text-white hover:text-blue-300 transition pb-1 ${
                pathname === "/tv" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              TV Shows
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}