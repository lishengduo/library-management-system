import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Package, Star, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useBookStore } from '@/store/bookStore';
import { useUserStore } from '@/store/userStore';
import { useBorrowStore } from '@/store/borrowStore';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, categories } = useBookStore();
  const { currentUser } = useUserStore();
  const { createBorrowRecord, createReservation, isFavorite, addFavorite, removeFavorite } = useBorrowStore();

  const book = getBookById(id || '');
  const category = categories.find((c) => c.id === book?.categoryId);
  const isFav = currentUser && book ? isFavorite(currentUser.id, book.id) : false;

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">图书不存在</h3>
          <button
            onClick={() => navigate('/books')}
            className="mt-4 btn-primary"
          >
            返回图书列表
          </button>
        </div>
      </div>
    );
  }

  const handleBorrow = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const success = createBorrowRecord(currentUser.id, book.id);
    if (success) {
      alert('借阅成功，请前往图书馆取书');
    } else {
      alert('借阅失败，图书已被借完');
    }
  };

  const handleReserve = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const success = createReservation(currentUser.id, book.id);
    if (success) {
      alert('预约成功，图书到馆后将通知您');
    } else {
      alert('您已预约过此书');
    }
  };

  const handleFavorite = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (isFav) {
      removeFavorite(currentUser.id, book.id);
    } else {
      addFavorite(currentUser.id, book.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center text-gray-500 hover:text-primary-600 mb-8 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回图书列表
        </button>

        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden animate-fade-in-up">
          <div className="grid md:grid-cols-2 gap-0">
            {/* 封面区域 */}
            <div className="relative bg-gradient-to-br from-primary-50 to-blue-50 p-8 flex items-center justify-center">
              <div className="relative">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full max-w-sm h-80 object-cover rounded-2xl shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div style={{ display: 'none' }} className="w-full max-w-sm h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl items-center justify-center">
                  <BookOpen className="w-20 h-20 text-primary-300" />
                </div>
                <button
                  onClick={handleFavorite}
                  className={`absolute top-3 right-3 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
                    isFav ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30' : 'bg-white/80 text-gray-400 hover:text-accent-500 hover:bg-white'
                  }`}
                >
                  <Star className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* 信息区域 */}
            <div className="p-8 md:p-10">
              <div className="flex items-center space-x-2 mb-5">
                {category && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-lg text-sm font-medium">
                    {category.name}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  book.available > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {book.available > 0 ? '可借' : '已借出'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-lg text-gray-500 mb-5">{book.author}</p>

              <p className="text-gray-600 mb-8 leading-relaxed">{book.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                  <Package className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-xs text-gray-400">库存</div>
                    <span className="text-gray-700 font-medium">{book.stock} 本</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-xs text-gray-400">可借</div>
                    <span className="text-gray-700 font-medium">{book.available} 本</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-xs text-gray-400">出版日期</div>
                    <span className="text-gray-700 font-medium">{formatDate(book.publishDate)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="text-xs text-gray-400">出版社</div>
                    <span className="text-gray-700 font-medium">{book.publisher}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-gray-400 text-sm mb-6 bg-amber-50 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>借阅期限：45天，可续借2次</span>
              </div>

              <div className="flex space-x-3">
                {book.available > 0 ? (
                  <button
                    onClick={handleBorrow}
                    className="flex-1 btn-primary py-3.5 text-base"
                  >
                    立即借阅
                  </button>
                ) : (
                  <button
                    onClick={handleReserve}
                    className="flex-1 btn-secondary py-3.5 text-base"
                  >
                    预约图书
                  </button>
                )}
                <button
                  onClick={handleFavorite}
                  className={`px-5 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                    isFav
                      ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-accent-500'
                  }`}
                >
                  <Star className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="border-t border-gray-100 p-8 md:p-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">图书信息</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'ISBN', value: book.isbn },
                { label: '出版社', value: book.publisher },
                { label: '出版日期', value: formatDate(book.publishDate) },
                { label: '分类', value: category?.name },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-gray-700 font-medium text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
