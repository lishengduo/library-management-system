import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, AlertCircle, GraduationCap } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('登录失败，请检查邮箱是否正确');
      }
    } else {
      const success = register(username, email, password, studentId);
      if (success) {
        navigate('/');
      } else {
        setError('注册失败，该邮箱已被使用');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-blue-500 flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      <div className="w-full max-w-md mx-4 relative z-10 animate-fade-in-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-500 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">校园图书馆</h1>
              <p className="text-white/70 text-sm">智能借阅管理系统</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                  isLogin ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                登录
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                  !isLogin ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                注册
              </button>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 mb-4 bg-red-50 p-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="请输入学号或工号"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-base mt-2"
              >
                {isLogin ? '登录' : '注册'}
              </button>
            </form>

            {isLogin && (
              <div className="text-center mt-5 space-y-1">
                <p className="text-gray-400 text-xs">测试账号</p>
                <p className="text-gray-500 text-xs">学生：zhangsan@school.edu.cn</p>
                <p className="text-gray-500 text-xs">管理员：admin@school.edu.cn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
