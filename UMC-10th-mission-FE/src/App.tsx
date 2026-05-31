import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <CartPage />
      <Footer />
    </div>
  );
}

export default App;
