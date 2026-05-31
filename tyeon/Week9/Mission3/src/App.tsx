import { useCartStore } from './store/useCartStore';
import Navbar from './components/Navbar';
import CartItem from './components/CartItem';
import CartTotals from './components/CartTotals';
import Modal from './components/Modal';

function App() {
  // useSelector/useDispatch 없이 Zustand 훅 하나로 상태를 꺼내 사용
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-6xl mb-4">🛒</span>
            <h2 className="text-xl font-semibold text-gray-500">플레이리스트가 비어있어요</h2>
            <p className="text-sm text-gray-400 mt-2">음반을 담아보세요!</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              플레이리스트 ({cartItems.length}개 음반)
            </h2>
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
            <CartTotals />
          </>
        )}
      </main>

      {/* 모달: Zustand의 isModalOpen으로 표시 여부 결정 */}
      <Modal />
    </div>
  );
}

export default App;
