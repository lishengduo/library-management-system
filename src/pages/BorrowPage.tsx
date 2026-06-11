import { useUserStore } from '@/store/userStore';
import { useBorrowStore } from '@/store/borrowStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, RefreshCw, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BorrowPage() {
  const { currentUser } = useUserStore();
  const { getUserBorrowRecords, getUserReservations, renewBorrowRecord, cancelReservation } = useBorrowStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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

  const borrowRecords = getUserBorrowRecords(currentUser.id);
  const reservations = getUserReservations(currentUser.id);
  const currentBorrows = borrowRecords.filter((r) => r.status === 'borrowed' || r.status === 'overdue');
  const historyBorrows = borrowRecords.filter((r) => r.status === 'returned');
  const pendingReservations = reservations.filter((r) => r.status === 'pending');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN');
  };

  const getDaysLeft = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleRenew = (recordId: string) => {
    const success = renewBorrowRecord(recordId);
    if (success) {
      alert('续借成功');
    } else {
      alert('续借次数已达上限');
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    if (confirm('确定取消预约？')) {
      cancelReservation(reservationId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">借阅管理</h1>
        <p className="text-gray-500 mb-8">管理您的借阅和预约记录</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">{currentBorrows.length}</div>
            <div className="text-gray-500">当前借阅</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-accent-500 mb-1">{pendingReservations.length}</div>
            <div className="text-gray-500">预约中</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{historyBorrows.length}</div>
            <div className="text-gray-500">借阅历史</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
            当前借阅
          </h2>
          {currentBorrows.length > 0 ? (
            <div className="space-y-4">
              {currentBorrows.map((record) => {
                const daysLeft = getDaysLeft(record.dueDate);
                const isOverdue = daysLeft < 0;
                
                return (
                  <div key={record.id} className="card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {record.book && (
                          <img
                            src={record.book.coverUrl}
                            alt={record.book.title}
                            className="w-20 h-28 object-cover rounded-lg bg-primary-100"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {record.book?.title || '未知图书'}
                          </h3>
                          <p className="text-gray-500">{record.book?.author}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm">
                            <span className="flex items-center text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              借阅：{formatDate(record.borrowDate)}
                            </span>
                            <span className={`flex items-center ${isOverdue ? 'text-red-500' : daysLeft <= 7 ? 'text-accent-500' : 'text-gray-500'}`}>
                              <Clock className="w-4 h-4 mr-1" />
                              到期：{formatDate(record.dueDate)}
                              {isOverdue && (
                                <span className="ml-1">({Math.abs(daysLeft)}天前到期)</span>
                              )}
                              {!isOverdue && daysLeft <= 7 && daysLeft > 0 && (
                                <span className="ml-1">({daysLeft}天后到期)</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {isOverdue ? (
                          <span className="flex items-center text-red-500 text-sm">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            已逾期
                          </span>
                        ) : record.renewCount >= 2 ? (
                          <span className="text-gray-400 text-sm">已达续借上限</span>
                        ) : (
                          <button
                            onClick={() => handleRenew(record.id)}
                            className="flex items-center space-x-1 px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>续借</span>
                          </button>
                        )}
                        <span className="text-gray-400 text-sm">续借 {record.renewCount}/2</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无当前借阅记录</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-accent-500" />
            预约记录
          </h2>
          {pendingReservations.length > 0 ? (
            <div className="space-y-4">
              {pendingReservations.map((reservation) => (
                <div key={reservation.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {reservation.book && (
                        <img
                          src={reservation.book.coverUrl}
                          alt={reservation.book.title}
                          className="w-16 h-20 object-cover rounded-lg bg-primary-100"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {reservation.book?.title || '未知图书'}
                        </h3>
                        <p className="text-gray-500 text-sm">{reservation.book?.author}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>预约时间：{formatDate(reservation.reserveDate)}</span>
                          <span>有效期至：{formatDate(reservation.expireDate)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      取消预约
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无预约记录</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            借阅历史
          </h2>
          {historyBorrows.length > 0 ? (
            <div className="space-y-4">
              {historyBorrows.map((record) => (
                <div key={record.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {record.book && (
                        <img
                          src={record.book.coverUrl}
                          alt={record.book.title}
                          className="w-16 h-20 object-cover rounded-lg bg-primary-100"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {record.book?.title || '未知图书'}
                        </h3>
                        <p className="text-gray-500 text-sm">{record.book?.author}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>借阅：{formatDate(record.borrowDate)}</span>
                          <span>归还：{record.returnDate ? formatDate(record.returnDate) : '-'}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      已归还
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无借阅历史</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
