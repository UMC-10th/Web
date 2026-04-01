import './App.css';
import { Link, Route, Routes } from './router';
import { ComputerPage } from './pages/ComputerPage';
import { MiroPage } from './pages/MiroPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SieunPage } from './pages/SieunPage';

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/miro'>MIRO</Link>
      <Link to='/se'>SIEUN</Link>
      <Link to='/computer'>COMPUTER</Link>
      <Link to='/not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/miro' component={MiroPage} />
        <Route path='/se' component={SieunPage} />
        <Route path='/computer' component={ComputerPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;
