// 현재 주소 반환
export const getCurrentPath = () => {
    return window.location.pathname;
};

// 주소 이동 실행
export const navigateTo = (to: string) => {
    // 1. 주소창 변경
    window.history.pushState({}, '', to);
    
    // 2. 강제로 popstate event 발생시키기
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
}