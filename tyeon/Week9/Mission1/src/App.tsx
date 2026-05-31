import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';
import { calculateTotals } from './store/cartSlice';
import Navbar from './components/Navbar';
import CartItem from './components/CartItem';
import CartTotals from './components/CartTotals';

function App() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-6xl mb-4">🛒</span>
            <h2 className="text-xl font-semibold text-gray-500">장바구니가 비어있어요</h2>
            <p className="text-sm text-gray-400 mt-2">음반을 담아보세요!</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              장바구니 ({cartItems.length}개 음반)
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
    </div>
  );
}

export default App;
