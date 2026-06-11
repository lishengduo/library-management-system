import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useBookStore } from '@/store/bookStore';
import { useBorrowStore } from '@/store/borrowStore';
import { LayoutDashboard, BookOpen, BarChart3, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import type { Book } from '@/types';

type TabType = 'books' | 'statistics';

export default function AdminPage() {
  const { currentUser } = useUserStore();
  const { books, categories, addBook, updateBook, deleteBook } = useBookStore();
  const { borrowRecords, reservations } = useBorrowStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('books');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishDate: '',
    description: '',
    coverUrl: '',
    stock: 0,
    available: 0,
    categoryId: '',
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-4">无访问权限</h3>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.author) {
      alert('请填写书名和作者');
      return;
    }

    if (editingBook) {
      updateBook(editingBook.id, {
        ...formData,
        publishDate: formData.publishDate ? new Date(formData.publishDate) : new Date(),
      });
      setShowEditModal(false);
    } else {
      addBook({
        ...formData,
        publishDate: formData.publishDate ? new Date(formData.publishDate) : new Date(),
        coverUrl: formData.coverUrl || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20generic%20design%20elegant&image_size=portrait_4_3',
      });
      setShowAddModal(false);
    }
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishDate: '',
      description: '',
      coverUrl: '',
      stock: 0,
      available: 0,
      categoryId: '',
    });
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishDate: new Date(book.publishDate).toISOString().split('T')[0],
      description: book.description,
      coverUrl: book.coverUrl,
      stock: book.stock,
      available: book.available,
      categoryId: book.categoryId,
    });
    setShowEditModal(true);
  };

  const handleDelete = (bookId: string) => {
    if (confirm('确定删除这本书？')) {
      deleteBook(bookId);
    }
  };

  const totalBooks = books.length;
  const totalBorrowed = borrowRecords.filter((r) => r.status === 'borrowed').length;
  const totalReservations = reservations.filter((r) => r.status === 'pending').length;
  const availableBooks = books.reduce((sum, book) => sum + book.available, 0);

  const popularBooks = [...books]
    .sort((a, b) => (b.stock - b.available) - (a.stock - a.available))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">管理后台</h1>
        <p className="text-gray-500 mb-8">欢迎回来，{currentUser.username}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-3xl font-bold text-primary-600 mb-1">{totalBooks}</div>
            <div className="text-gray-500">馆藏总数</div>
          </div>
          <div className="card p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">{availableBooks}</div>
            <div className="text-gray-500">可借数量</div>
          </div>
          <div className="card p-6">
            <div className="text-3xl font-bold text-accent-500 mb-1">{totalBorrowed}</div>
            <div className="text-gray-500">借阅中</div>
          </div>
          <div className="card p-6">
            <div className="text-3xl font-bold text-red-500 mb-1">{totalReservations}</div>
            <div className="text-gray-500">预约中</div>
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'books'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>图书管理</span>
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'statistics'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>统计报表</span>
          </button>
        </div>

        {activeTab === 'books' && (
          <div className="card">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">图书列表</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>添加图书</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">封面</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">书名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">作者</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">分类</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">库存</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">可借</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map((book) => {
                    const category = categories.find((c) => c.id === book.categoryId);
                    return (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded bg-primary-100"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{book.title}</td>
                        <td className="px-6 py-4 text-gray-600">{book.author}</td>
                        <td className="px-6 py-4 text-gray-600">{category?.name}</td>
                        <td className="px-6 py-4 text-gray-600">{book.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            book.available > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {book.available}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(book)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">借阅排行榜</h2>
              <div className="space-y-4">
                {popularBooks.map((book, index) => (
                  <div key={book.id} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-accent-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-400 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded bg-primary-100"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{book.title}</h3>
                      <p className="text-gray-500 text-sm">{book.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{book.stock - book.available}</div>
                      <div className="text-gray-400 text-sm">次借阅</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">分类统计</h2>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const categoryBooks = books.filter((b) => b.categoryId === category.id);
                    const total = categoryBooks.reduce((sum, b) => sum + b.stock, 0);
                    const percentage = totalBooks > 0 ? (total / totalBooks) * 100 : 0;
                    return (
                      <div key={category.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">{category.name}</span>
                          <span className="text-gray-500 text-sm">{categoryBooks.length} 本</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">借阅状态统计</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">馆藏总量</span>
                    <span className="font-bold text-gray-800">{totalBooks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">可借数量</span>
                    <span className="font-bold text-green-600">{availableBooks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">借阅中</span>
                    <span className="font-bold text-accent-500">{totalBorrowed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">预约中</span>
                    <span className="font-bold text-red-500">{totalReservations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">借阅率</span>
                    <span className="font-bold text-primary-600">
                      {totalBooks > 0 ? Math.round((totalBorrowed / totalBooks) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  {editingBook ? '编辑图书' : '添加图书'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingBook(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">书名 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="请输入书名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">作者 *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="input-field"
                    placeholder="请输入作者"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="input-field"
                    placeholder="请输入ISBN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出版社</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="input-field"
                    placeholder="请输入出版社"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出版日期</label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">请选择分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">库存数量</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="input-field"
                      placeholder="库存"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">可借数量</label>
                    <input
                      type="number"
                      value={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: Number(e.target.value) })}
                      className="input-field"
                      placeholder="可借"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">简介</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="请输入图书简介"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">封面图片URL</label>
                  <input
                    type="text"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    className="input-field"
                    placeholder="请输入封面图片URL"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBook ? '保存修改' : '添加图书'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
