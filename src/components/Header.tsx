import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Menu, X, LogOut } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function Header() {
  const { currentUser, logout } = useUserStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary-700/95 backdrop-blur-xl text-white shadow-lg shadow-primary-900/10 sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl shadow-lg shadow-primary-900/20">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <Link to="/" className="text-xl font-bold tracking-tight">
              校园图书馆
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {[
              { to: '/', label: '首页' },
              { to: '/books', label: '图书查询' },
              ...(currentUser ? [
                { to: '/borrow', label: '借阅管理' },
                { to: '/profile', label: '个人中心' },
                ...(currentUser.role === 'admin' ? [{ to: '/admin', label: '管理后台' }] : []),
              ] : []),
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{currentUser.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-sm text-white/80 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-primary-700 px-5 py-2 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 shadow-md shadow-black/10 text-sm"
              >
                登录
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in-up">
            <nav className="flex flex-col space-y-1">
              {[
                { to: '/', label: '首页' },
                { to: '/books', label: '图书查询' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {currentUser && (
                <>
                  <Link
                    to="/borrow"
                    className="px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    借阅管理
                  </Link>
                  <Link
                    to="/profile"
                    className="px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      管理后台
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </button>
                </>
              )}
              {!currentUser && (
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  登录
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
