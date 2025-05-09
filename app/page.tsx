import Movies from "@/components/movies";
import SearchBar from "@/components/search-bar";

export default function Home() {
  return (
    <main>
      {/* Main Content Container */}
      <div className="main-content">
        <div className="mt-6 mb-8">
          <h2 className="page-title">Find Patents & Technologies</h2>
          <p className="page-subtitle">
            Enter your search query below to find relevant patents and technologies.
          </p>
        </div>
        
        <div className="search-container p-4 bg-white rounded-md shadow-sm">
          <SearchBar />
        </div>
        
        {/* Results List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#a02337] mb-4">Latest Tech</h3>
          <Movies />
        </div>
      </div>
    </main>
  );
}
