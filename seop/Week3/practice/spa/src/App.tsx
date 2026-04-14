import { Link, Route, Routes } from './router';
import SeopPage from './pages/SeopPage';
import SeopseopPage from './pages/SeopSeopPage';
import UmcPage from './pages/UmcPage';
import NotFoundPage from './pages/NotFoundPage';

const Header = () => {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100">
      <Link to='/seop'>SEOP</Link>
      <Link to='/seopseop'>SEOPSEOP</Link>
      <Link to='/umc'>UMC</Link>
      <Link to='/not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path='/seop' component={SeopPage} />
          <Route path='/seopseop' component={SeopseopPage} />
          <Route path='/umc' component={UmcPage} />
          <Route path='/not-found' component={NotFoundPage} />
        </Routes>
      </main>
    </>
  );
}

export default App;