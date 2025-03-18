import Movies from "@/components/movies";
import SearchBar from "@/components/search-bar";

export default function Home() {
  return (
    <main>
      {/* Container */}
      <div className="w-full px-8 py-10 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-neutral-50">🔍 PolyU KTEO Search Engine</h1>
        <p className="text-lg text-neutral-500 mt-2">
          Enter your search query below to find relevant results.
        </p>
        <SearchBar />
        {/* List */}
        <Movies />
      </div>
    </main>
  );
}
