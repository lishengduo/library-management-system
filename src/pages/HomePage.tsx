import { BookOpen, TrendingUp, Award, Users, ArrowRight, GraduationCap, Lightbulb, Palette, Microscope, Cpu } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import { useBookStore } from '@/store/bookStore';
import { Link } from 'react-router-dom';

const categoryIcons: Record<string, typeof BookOpen> = {
  '1': BookOpen,
  '2': Cpu,
  '3': Lightbulb,
  '4': Palette,
  '5': GraduationCap,
  '6': Microscope,
};

const categoryColors: Record<string, string> = {
  '1': 'from-rose-500 to-pink-500',
  '2': 'from-blue-500 to-cyan-500',
  '3': 'from-amber-500 to-orange-500',
  '4': 'from-purple-500 to-fuchsia-500',
  '5': 'from-green-500 to-emerald-500',
  '6': 'from-indigo-500 to-violet-500',
};

export default function HomePage() {
  const { books, categories } = useBookStore();
  
  const popularBooks = [...books].sort((a, b) => (b.stock - b.available) - (a.stock - a.available)).slice(0, 6);

  const stats = [
    { icon: BookOpen, label: '馆藏图书', value: '100,000+', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: '注册用户', value: '50,000+', color: 'from-emerald-500 to-green-600' },
    { icon: Award, label: '年度借阅', value: '200,000+', color: 'from-amber-500 to-orange-600' },
    { icon: TrendingUp, label: '新书上架', value: '500+', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-blue-500 text-white py-20 md:py-28 overflow-hidden">
        {/* 装饰元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-accent-400/10 rounded-full animate-float" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight animate-fade-in-up">
              校园图书馆
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-2 animate-fade-in-up-delay-1 font-light">
              智能借阅管理系统
            </p>
            <p className="text-base text-white/50 mb-10 max-w-xl mx-auto animate-fade-in-up-delay-2">
              探索知识的海洋，开启智慧之旅
            </p>
            <div className="animate-fade-in-up-delay-3">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`card p-6 text-center animate-fade-in-up-delay-${index + 1}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">热门借阅</h2>
              <p className="text-gray-400 mt-1">最受读者欢迎的图书</p>
            </div>
            <Link
              to="/books"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium group"
            >
              查看更多 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {popularBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">图书分类</h2>
            <p className="text-gray-400 mt-1">按兴趣探索不同领域</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] || BookOpen;
              const colorClass = categoryColors[category.id] || 'from-primary-500 to-primary-600';
              return (
                <Link
                  key={category.id}
                  to={`/books?category=${category.id}`}
                  className="card p-6 text-center group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{category.name}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 via-primary-600 to-blue-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">24小时自助借阅服务</h2>
              <p className="text-white/70 mb-8 text-lg leading-relaxed">
                随时随地借阅图书，智能推荐系统为您精选好书，让阅读更加便捷。
              </p>
              <Link
                to="/books"
                className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 inline-flex items-center shadow-lg shadow-black/10 hover:shadow-xl"
              >
                开始探索 <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-black">45</div>
                    <div className="text-white/50 text-sm mt-1">借阅天数</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black">2</div>
                    <div className="text-white/50 text-sm mt-1">续借次数</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black">10</div>
                    <div className="text-white/50 text-sm mt-1">最大借阅</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
