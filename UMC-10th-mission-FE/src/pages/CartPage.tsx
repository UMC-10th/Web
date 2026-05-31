import useCartStore from '../store/useCartStore';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);

  if (cartItems.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
        <span className="text-6xl">🛒</span>
        <p className="text-lg font-medium">장바구니가 비어 있어요.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
