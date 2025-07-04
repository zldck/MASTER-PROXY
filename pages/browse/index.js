import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BrowseIndex() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Browse Content</h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <Link href="/browse/movie">
          <Button className="w-48 h-20 text-lg rounded-2xl bg-gray-800 hover:bg-gray-700">
            🎬 Browse Movies
          </Button>
        </Link>

        <Link href="/browse/series">
          <Button className="w-48 h-20 text-lg rounded-2xl bg-gray-800 hover:bg-gray-700">
            📺 Browse Series
          </Button>
        </Link>
      </div>
    </div>
  );
}
