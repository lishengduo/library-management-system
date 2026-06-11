import { Routes, Route, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import BookListPage from '@/pages/BookListPage';
import BookDetailPage from '@/pages/BookDetailPage';
import BorrowPage from '@/pages/BorrowPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import AdminPage from '@/pages/AdminPage';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-primary-400" />
        </div>
        <h1 className="text-6xl font-black text-gray-200 mb-2">404</h1>
        <p className="text-gray-500 mb-6">页面不存在</p>
        <Link to="/" className="btn-primary">返回首页</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/borrow" element={<BorrowPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-600 p-1.5 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">校园图书馆</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">为师生提供便捷的图书借阅服务，让知识触手可及</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-200">快速链接</h3>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">首页</Link></li>
                <li><Link to="/books" className="hover:text-white transition-colors">图书查询</Link></li>
                <li><Link to="/borrow" className="hover:text-white transition-colors">借阅管理</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-200">服务时间</h3>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li>周一至周五: 8:00 - 22:00</li>
                <li>周六至周日: 9:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-200">联系我们</h3>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li>图书馆服务台</li>
                <li>电话: 010-12345678</li>
                <li>邮箱: library@school.edu.cn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 校园图书馆智能借阅管理系统</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
