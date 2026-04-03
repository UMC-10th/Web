import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import type { MouseEvent, ReactNode } from 'react'
import { getCurrentPath, navigateTo } from './utils.tsx'  
import App from './App.tsx'
import './index.css'

interface ILink {
  to: string;
  children?: ReactNode;
}

export const Link = ({ to, children }: ILink) => {
  const handleClick = (e:MouseEvent<HTMLAnchorElement>) => {
    
    // 서버에 요청하려는 동작 막기
    e.preventDefault();

    // 현재 경로가 이동할 경로라면 그대로
    if (getCurrentPath() === to)
      return;

    // 다르다면 해당 주소로 이동 실행
    navigateTo(to);
  }

  // <a> 태그 클릭 시 서버에 요청을 보낸 후 전체 리렌더링
  return (
    <a className='border border-solid border-black rounded-2xl p-4 hover:bg-black hover:text-white' href={to} onClick={handleClick}>
      {children}
    </a>
  )
}

const Header = () => {
  return (
    <nav className='flex gap-3 justify-center items-center mt-4'>
      <Link to="/first">1st</Link>
      <Link to="/second">2nd</Link>
      <Link to="/third">3rd</Link>
      <Link to="/not-found">not-found</Link>
    </nav>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='flex gap-3 flex-col justify-center items-center'>
      <Header />
      <App />
    </div>
  </StrictMode>,
)
