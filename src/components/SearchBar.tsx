import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/books?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索图书名称、作者、ISBN..."
          className="relative w-full px-6 py-3.5 pr-14 rounded-full border-0 shadow-xl focus:ring-4 focus:ring-white/20 outline-none text-gray-700 bg-white text-base"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-primary-500 text-white p-2.5 rounded-full hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 active:scale-95"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
