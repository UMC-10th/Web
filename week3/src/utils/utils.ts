import { useState, useEffect } from 'react';

// 1. 현재 주소창의 경로를 가져오는 도구
export const getCurrentPath = () => window.location.pathname;

// 2. 새로고침 없이 주소를 바꾸고 '나 바뀌었어!'라고 소문내는 도구
export const navigateTo = (to: string) => {
  window.history.pushState({}, '', to);
  
  // 브라우저에게 주소가 바뀌었다는 신호(popstate)를 강제로 보냅니다.
  const navigationEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navigationEvent);
};

// 3. 주소창을 실시간으로 감시해서 리액트 화면을 바꿔주는 커스텀 훅 (감시카메라)
export const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handler = () => setPath(getCurrentPath());
    
    // 사용자가 뒤로가기를 누르거나 navigateTo가 실행될 때마다 실행!
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return path;
};