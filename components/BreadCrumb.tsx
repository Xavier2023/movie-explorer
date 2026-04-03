"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb({ title }: { title: string }) {
  const pathname = usePathname();
  
  // Determine if we're in TV section
  const isTvPage = pathname?.startsWith("/tv");
  
  // Home link should go to the appropriate listing page
  const homeLink = isTvPage ? "/tv" : "/";
  const homeLabel = isTvPage ? "TV Shows" : "Movies";

  return (
    <nav className="text-sm text-gray-300 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link href={homeLink} className="hover:text-blue-300 hover:underline">
            {homeLabel}
          </Link>
        </li>
        <li className="text-gray-400" aria-hidden="true">
          /
        </li>
        <li className="font-medium text-white">{title}</li>
      </ol>
    </nav>
  );
}