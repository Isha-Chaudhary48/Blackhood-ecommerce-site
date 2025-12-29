import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Go to Home
      </Link>
    </div>
  );
}

