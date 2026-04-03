import Link from "next/link";

export default function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="text-sm text-gray-300 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-blue-300 hover:underline">
            Home
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
