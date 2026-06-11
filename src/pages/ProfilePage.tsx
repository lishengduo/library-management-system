import { useUserStore } from '@/store/userStore';
import { useBorrowStore } from '@/store/borrowStore';
import { useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, Star, Clock, Award } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser } = useUserStore();
  const { getUserFavorites, getUserBorrowRecords, getUserReservations } = useBorrowStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-4">请先登录</h3>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            前往登录
          </button>
        </div>
      </div>
    );
  }

  const favorites = getUserFavorites(currentUser.id);
  const borrowRecords = getUserBorrowRecords(currentUser.id);
  const reservations = getUserReservations(currentUser.id);
  const currentBorrows = borrowRecords.filter((r) => r.status === 'borrowed');
  const pendingReservations = reservations.filter((r) => r.status === 'pending');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN');
  };

  const getRoleText = () => {
    switch (currentUser.role) {
      case 'student':
        return '学生';
      case 'teacher':
        return '教职工';
      case 'admin':
        return '管理员';
      default:
        return '用户';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">个人中心</h1>

        <div className="card p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentUser.username}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center text-gray-500">
                  <Award className="w-4 h-4 mr-1" />
                  {getRoleText()}
                </span>
                <span className="flex items-center text-gray-500">
                  <Mail className="w-4 h-4 mr-1" />
                  {currentUser.email}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">学号/工号：{currentUser.studentId}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{currentBorrows.length}</div>
                <div className="text-gray-500 text-sm">当前借阅</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{pendingReservations.length}</div>
                <div className="text-gray-500 text-sm">预约中</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{favorites.length}</div>
                <div className="text-gray-500 text-sm">我的收藏</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-accent-500" />
            我的收藏
          </h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/books/${favorite.bookId}`)}
                >
                  {favorite.book && (
                    <>
                      <img
                        src={favorite.book.coverUrl}
                        alt={favorite.book.title}
                        className="w-full h-32 object-cover rounded-lg mb-3 bg-gradient-to-br from-primary-100 to-primary-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <h3 className="font-semibold text-gray-800 truncate">{favorite.book.title}</h3>
                      <p className="text-gray-500 text-sm">{favorite.book.author}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无收藏图书</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
            当前借阅
          </h2>
          {currentBorrows.length > 0 ? (
            <div className="space-y-4">
              {currentBorrows.map((record) => (
                <div key={record.id} className="card p-4">
                  <div className="flex items-center space-x-4">
                    {record.book && (
                      <img
                        src={record.book.coverUrl}
                        alt={record.book.title}
                        className="w-16 h-20 object-cover rounded-lg bg-primary-100"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{record.book?.title}</h3>
                      <p className="text-gray-500 text-sm">{record.book?.author}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                        <span>借阅：{formatDate(record.borrowDate)}</span>
                        <span>到期：{formatDate(record.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无当前借阅</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
