import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, BookOpen } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { useBookStore } from '@/store/bookStore';

export default function BookListPage() {
  const { categories, getFilteredBooks, setSearchQuery, setSelectedCategory, setSortBy, sortBy } = useBookStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    setSearchQuery(search);
    setSelectedCategory(category);
    setLocalSearch(search);
  }, [searchParams, setSearchQuery, setSelectedCategory]);

  const books = getFilteredBooks();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch) {
      params.set('search', localSearch);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
    setSearchQuery(localSearch);
  };

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sort: 'title' | 'author' | 'borrowCount') => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">图书查询</h1>
          <p className="text-gray-500">共找到 {books.length} 本图书</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="搜索图书名称、作者、ISBN..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  搜索
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-800">图书分类</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      !searchParams.get('category') ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    全部分类
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        searchParams.get('category') === category.id ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">排序：</span>
                <div className="flex space-x-2">
                  {[
                    { value: 'title', label: '书名' },
                    { value: 'author', label: '作者' },
                    { value: 'borrowCount', label: '借阅量' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value as 'title' | 'author' | 'borrowCount')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        sortBy === option.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {books.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">未找到相关图书</h3>
                <p className="text-gray-400">尝试更换搜索关键词或筛选条件</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
