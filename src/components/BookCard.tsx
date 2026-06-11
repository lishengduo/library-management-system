import { useNavigate } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react';
import type { Book } from '@/types';
import { useUserStore } from '@/store/userStore';
import { useBorrowStore } from '@/store/borrowStore';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { isFavorite, addFavorite, removeFavorite } = useBorrowStore();
  const isFav = currentUser ? isFavorite(currentUser.id, book.id) : false;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    
    if (isFav) {
      removeFavorite(currentUser.id, book.id);
    } else {
      addFavorite(currentUser.id, book.id);
    }
  };

  return (
    <div
      className="card cursor-pointer group"
      onClick={() => navigate(`/books/${book.id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-52 object-cover bg-gradient-to-br from-primary-100 to-primary-200 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const placeholder = target.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
        <div style={{ display: 'none' }} className="w-full h-52 bg-gradient-to-br from-primary-100 to-primary-200 items-center justify-center">
          <BookOpen className="w-12 h-12 text-primary-300" />
        </div>
        {/* 底部渐变遮罩 */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={handleFavorite}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm ${
            isFav ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30' : 'bg-white/70 text-gray-500 hover:bg-white hover:text-accent-500'
          }`}
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
        <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
          book.available > 0 ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
        }`}>
          {book.available > 0 ? `可借 ${book.available}` : '已借出'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate mb-1 group-hover:text-primary-600 transition-colors">{book.title}</h3>
        <p className="text-gray-400 text-sm truncate">{book.author}</p>
      </div>
    </div>
  );
}
