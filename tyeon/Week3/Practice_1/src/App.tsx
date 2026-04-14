import './App.css'
import { useEffect, useState } from 'react';
import { getCurrentPath } from './utils';

type PagePath = '/first' | '/second' | '/third' | '/not-found';

const Page = (path: string) => {

  const title: Record<PagePath, string> = {
    '/first': '1st page',
    '/second': '2nd page',
    '/third': '3rd page',
    '/not-found': 'NOT FOUND'
  }

  const key = path as PagePath;
  const text = title[key] ?? title['/not-found'];

  return <h1 className='font-bold text-6xl mt-40'>{text}</h1>;
}

function App() {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const onPopState = () => setPath(getCurrentPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="App">
      {Page(path)}
    </div>
  );
}

export default App
