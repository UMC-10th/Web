import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import Footer from './components/Footer';
import Modal from './components/Modal';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Modal />
      <Navbar />
      <CartPage />
      <Footer />
    </div>
  );
}

export default App;
